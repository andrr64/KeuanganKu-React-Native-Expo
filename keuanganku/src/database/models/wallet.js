// src/models/Wallet.js
import { getDB } from '../db'

export const addWallet = (nama, saldo = 0, onSuccess = undefined) => {
  const db = getDB();
  try {
    const result = db.runSync(
      `INSERT INTO wallet (nama, saldo) VALUES (?, ?)`,
      [nama, saldo]
    );
    const insertedId = result.lastInsertRowId;
    if (onSuccess){
      onSuccess();
    }
    return insertedId;
  } catch (error) {
    throw error;
  }
};

export const getAllWallet = () => {
  const db = getDB();
  try {
    const rows = db.getAllSync(`SELECT * FROM wallet ORDER BY id DESC`);
    return rows;
  } catch (error) {
    console.error('❌ Gagal ambil wallet:', error);
    throw error;
  }
};

export const getWalletById = (id) => {
  const db = getDB();
  try {
    const row = db.getFirstSync(`SELECT * FROM wallet WHERE id = ?`, [id]);
    return row;
  } catch (error) {
    console.error('❌ Gagal ambil wallet by ID:', error);
    throw error;
  }
};

export const updateWallet = (id, nama, saldo, onSuccess) => {
  const db = getDB();
  try {
    db.runSync(
      `UPDATE wallet SET nama = ?, saldo = ? WHERE id = ?`,
      [nama, saldo, id]
    );
    onSuccess();
  } catch (error) {
    console.error('❌ Gagal update wallet:', error);
    throw error;
  }
};

export const deleteWallet = (id) => {
  const db = getDB();
  try {
    db.runSync(`DELETE FROM wallet WHERE id = ?`, [id]);
    console.log('✅ Wallet dihapus, ID:', id);
  } catch (error) {
    console.error('❌ Gagal hapus wallet:', error);
    throw error;
  }
};

export const getTotalSaldo = () => {
  const db = getDB();
  try {
    const row = db.getFirstSync(`SELECT SUM(saldo) as total FROM wallet`);
    return row?.total || 0;
  } catch (error) {
    console.error('❌ Gagal hitung total saldo:', error);
    throw error;
  }
};