// src/models/Transaksi.js
import { getDB } from '../db'

export const addTransaksi = (nama, jumlah, tipe, id_kategori, id_wallet, waktu, onSuccess = undefined) => {
  const db = getDB();
  try {
    // 1️⃣ Tambah transaksi
    const result = db.runSync(
      `INSERT INTO transactions (nama, jumlah, tipe, id_kategori, id_wallet, waktu) VALUES (?, ?, ?, ?, ?, ?)`,
      [nama, jumlah, tipe, id_kategori, id_wallet, waktu]
    );

    // tipe = 1 -> add (pemasukan), tipe = 2 -> subtract (pengeluaran)
    const signedAmount = tipe === 1 ? jumlah : -jumlah;
    db.runSync(
      `UPDATE wallet SET saldo = saldo + ? WHERE id = ?`,
      [signedAmount, id_wallet]
    );

    const insertedId = result.lastInsertRowId;
    console.log('✅ Transaksi berhasil ditambahkan, ID:', insertedId);

    if (onSuccess) {
      onSuccess()
    };

    return insertedId;
  } catch (error) {
    console.error('❌ Gagal tambah transaksi:', error);
    throw error;
  }
};

export const getAllTransaksi = (limit = null, tipe = null) => {
  const db = getDB();
  try {
    let query = `
      SELECT 
        t.*, 
        k.id AS kategori_id,
        k.nama AS kategori_nama,
        k.tipe AS kategori_tipe
      FROM transactions t
      LEFT JOIN kategori k ON t.id_kategori = k.id
    `;

    const params = [];

    // 🔹 Filter berdasarkan tipe kategori kalau ada
    if (tipe !== null) {
      query += ` WHERE t.tipe = ?`;
      params.push(tipe);
    }

    query += ` ORDER BY t.created_at DESC`;

    // 🔹 Tambahkan LIMIT kalau ada
    if (limit !== null) {
      query += ` LIMIT ?`;
      params.push(limit);
    }

    const rows = db.getAllSync(query, params);
    return rows;
  } catch (error) {
    console.error('❌ Gagal ambil semua transaksi:', error);
    throw error;
  }
};

export const getTransaksiById = (id) => {
  const db = getDB();
  try {
    const row = db.getFirstSync(`
      SELECT t.*, k.nama AS kategori_nama
      FROM transactions t
      LEFT JOIN kategori k ON t.id_kategori = k.id
      WHERE t.id = ?
    `, [id]);
    return row;
  } catch (error) {
    console.error('❌ Gagal ambil transaksi by ID:', error);
    throw error;
  }
};

export const updateTransaksi = async (
  oldData,
  id,
  nama,
  jumlah,
  tipe,
  id_kategori,
  id_wallet,
  waktu,
  callback
) => {
  const db = getDB();

  try {
    await db.withTransactionAsync(async () => {
      const oldWallet = await db.getFirstAsync(
        'SELECT saldo FROM wallet WHERE id = ?',
        [oldData.id_wallet]
      );

      if (!oldWallet) {
        throw new Error(`Wallet lama dengan ID ${oldData.id_wallet} tidak ditemukan`);
      }

      if (oldData.id_wallet === id_wallet) {
        const rollbackOld = oldData.tipe === 1 ? -oldData.jumlah : oldData.jumlah;
        const commitNew = tipe === 1 ? jumlah : -jumlah;

        const newSaldo = oldWallet.saldo + rollbackOld + commitNew;

        if (newSaldo < 0) {
          throw new Error('Saldo wallet tidak cukup untuk update transaksi');
        }

        await db.runAsync('UPDATE wallet SET saldo = ? WHERE id = ?', [
          newSaldo,
          id_wallet,
        ]);

      } else {

        const rollbackAmount = oldData.tipe === 1 ? -oldData.jumlah : oldData.jumlah;
        const oldWalletNewSaldo = oldWallet.saldo + rollbackAmount;

        if (oldWalletNewSaldo < 0) {
          throw new Error('Terjadi kesalahan saat mengembalikan saldo wallet lama.');
        }

        await db.runAsync('UPDATE wallet SET saldo = ? WHERE id = ?', [
          oldWalletNewSaldo,
          oldData.id_wallet,
        ]);

        const newWallet = await db.getFirstAsync(
          'SELECT saldo FROM wallet WHERE id = ?',
          [id_wallet]
        );

        if (!newWallet) {
          throw new Error(`Wallet baru dengan ID ${id_wallet} tidak ditemukan`);
        }

        const commitAmount = tipe === 1 ? jumlah : -jumlah;
        const newWalletNewSaldo = newWallet.saldo + commitAmount;

        if (newWalletNewSaldo < 0) {
          throw new Error('Saldo wallet baru tidak cukup untuk update transaksi');
        }

        await db.runAsync('UPDATE wallet SET saldo = ? WHERE id = ?', [
          newWalletNewSaldo,
          id_wallet,
        ]);
      }

      await db.runAsync(
        `UPDATE transactions 
         SET nama = ?, jumlah = ?, tipe = ?, id_kategori = ?, id_wallet = ?, waktu = ?
         WHERE id = ?`,
        [nama, jumlah, tipe, id_kategori, id_wallet, waktu, id]
      );

      console.log('✅ Transaksi berhasil diupdate, ID:', id);
      if (callback) callback();
    });
  } catch (error) {
    console.error('Gagal update transaksi:', error);
    alert(error.message);
    throw error;
  }
};

export const deleteTransaksi = async (transactionId, onSuccess) => {
  const db = getDB();
  try {
    await db.withTransactionAsync(async () => {
      // 1. Get the transaction details
      const transaction = await db.getFirstAsync(
        'SELECT jumlah, tipe, id_wallet FROM transactions WHERE id = ?',
        [transactionId]
      );

      if (!transaction) {
        throw new Error(`Transaksi dengan ID ${transactionId} tidak ditemukan.`);
      }

      // 2. Get the current wallet balance
      const wallet = await db.getFirstAsync(
        'SELECT saldo FROM wallet WHERE id = ?',
        [transaction.id_wallet]
      );

      if (!wallet) {
        throw new Error(`Wallet dengan ID ${transaction.id_wallet} tidak ditemukan.`);
      }

      // 3. Check if deleting an income transaction would result in a negative balance
      if (transaction.tipe === 1) { // If it's an income
        const newBalance = wallet.saldo - transaction.jumlah;
        if (newBalance < 0) {
          throw new Error('Gagal menghapus pemasukan: Saldo wallet tidak boleh menjadi negatif.');
        }
      }

      // 4. Calculate the reversal amount
      const reversalAmount = transaction.tipe === 1 ? -transaction.jumlah : transaction.jumlah;

      // 5. Update the wallet balance
      await db.runAsync(
        'UPDATE wallet SET saldo = saldo + ? WHERE id = ?',
        [reversalAmount, transaction.id_wallet]
      );

      // 6. Delete the transaction
      await db.runAsync(
        'DELETE FROM transactions WHERE id = ?',
        [transactionId]
      );

      console.log('✅ Transaksi berhasil dihapus dan saldo wallet disesuaikan, ID:', transactionId);
      if (onSuccess) onSuccess();
    });
  } catch (error) {
    console.error('❌ Gagal hapus transaksi secara transaksional:', error);
    alert(`Gagal menghapus transaksi: ${error.message}`);
    throw error;
  }
};

export const getPemasukanBulanIni = () => {
  const db = getDB();
  try {
    const result = db.getFirstSync(
      `SELECT SUM(jumlah) as total 
             FROM transactions 
             WHERE tipe = 1 AND strftime('%Y-%m', waktu) = strftime('%Y-%m', 'now')`
    );
    return result?.total || 0;
  } catch (error) {
    console.error('❌ Gagal mengambil total pemasukan bulan ini:', error);
    return 0;
  }
};

export const getPengeluaranBulanIni = () => {
  const db = getDB();
  try {
    const result = db.getFirstSync(
      `SELECT SUM(jumlah) as total 
             FROM transactions 
             WHERE tipe = 2 AND strftime('%Y-%m', waktu) = strftime('%Y-%m', 'now')`
    );
    return result?.total || 0;
  } catch (error) {
    console.error('❌ Gagal mengambil total pengeluaran bulan ini:', error);
    return 0;
  }
};