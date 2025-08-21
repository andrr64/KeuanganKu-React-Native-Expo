// src/database/db.js
import * as SQLite from 'expo-sqlite';

const TABEL_WALLET = `
  CREATE TABLE IF NOT EXISTS wallet (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nama TEXT NOT NULL,
    saldo REAL NOT NULL DEFAULT 0
  );
`;

const TABEL_KATEGORI = `
  CREATE TABLE IF NOT EXISTS kategori (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nama TEXT NOT NULL,
    tipe INTEGER NOT NULL CHECK(tipe IN (1, 2)) -- 1 = pemasukan, 2 = pengeluaran
  );
`;

const TABEL_TRANSAKSI = `
  CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nama TEXT NOT NULL,
    jumlah REAL NOT NULL,
    id_kategori INTEGER,
    id_wallet INTEGER,
    tipe INTEGER NOT NULL,
    waktu DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (id_kategori) REFERENCES kategori (id) ON DELETE CASCADE,
    FOREIGN KEY (id_wallet) REFERENCES wallet (id) ON DELETE CASCADE
  );
`;

const db = SQLite.openDatabaseSync('keuanganku.db'); // Ganti nama jadi finance.db (lebih sesuai)

export const getDB = () => {
  return db;
};

export const initDB = () => {
  try {
    db.execSync(TABEL_KATEGORI);
    db.execSync(TABEL_TRANSAKSI);
    db.execSync(TABEL_WALLET);
    console.log('✅ Semua tabel berhasil dibuat');
    seedKategori();
  } catch (error) {
    console.error('❌ Gagal inisialisasi tabel:', error);
  }
};

const seedKategori = () => {
  const kategoriDefault = [
    // Pemasukan (tipe = 1)
    { nama: 'Gaji', tipe: 1 },
    { nama: 'Bonus', tipe: 1 },
    { nama: 'Investasi', tipe: 1 },
    { nama: 'Penjualan', tipe: 1 },
    { nama: 'Hadiah', tipe: 1 },
    { nama: 'Lainnya', tipe: 1 },

    // Pengeluaran (tipe = 2)
    { nama: 'Makanan & Minuman', tipe: 2 },
    { nama: 'Transportasi', tipe: 2 },
    { nama: 'Belanja', tipe: 2 },
    { nama: 'Tagihan', tipe: 2 },
    { nama: 'Hiburan', tipe: 2 },
    { nama: 'Kesehatan', tipe: 2 },
    { nama: 'Pendidikan', tipe: 2 },
    { nama: 'Donasi', tipe: 2 },
    { nama: 'Lainnya', tipe: 2 },
  ];

  const insertQuery = `
    INSERT INTO kategori (nama, tipe)
    SELECT ?, ?
    WHERE NOT EXISTS (
      SELECT 1 FROM kategori WHERE nama = ? AND tipe = ?
    );
  `;

  let inserted = 0;
  for (const item of kategoriDefault) {
    const result = db.runSync(insertQuery, [item.nama, item.tipe, item.nama, item.tipe]);

    if (result.changes && result.changes > 0) {
      inserted++;
    }
  }

  if (inserted > 0) {
    console.log(`✅ Berhasil menambahkan ${inserted} kategori default`);
  } else {
    console.log('ℹ️ Kategori default sudah ada, tidak ada yang ditambahkan');
  }
};