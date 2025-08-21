// src/models/Kategori.js
import { getDB } from '../db';

export const addKategori = (nama, tipe, onSuccess = undefined) => {
  const db = getDB();
  try {
    const result = db.runSync(
      `INSERT INTO kategori (nama, tipe) VALUES (?, ?)`,
      [nama, tipe]
    );
    const insertedId = result.lastInsertRowId;
    console.log('✅ Kategori berhasil ditambahkan, ID:', insertedId);
    if (onSuccess) {
      onSuccess();
    }
    return insertedId;
  } catch (error) {
    console.error('❌ Gagal tambah kategori:', error);
    throw error;
  }
};

export const getAllKategori = () => {
  const db = getDB();
  try {
    const rows = db.getAllSync(`SELECT * FROM kategori ORDER BY id DESC`);
    return rows;
  } catch (error) {
    console.error('❌ Gagal ambil kategori:', error);
    throw error;
  }
};

export const getAllKategoriPemasukan = () => {
  const db = getDB();
  try {
    const rows = db.getAllSync(`SELECT * FROM kategori WHERE tipe=1 ORDER BY id DESC`);
    return rows;
  } catch (error) {
    console.error('❌ Gagal ambil kategori:', error);
    throw error;
  }
}

export const getAllKategoriPengeluaran = () => {
  const db = getDB();
  try {
    const rows = db.getAllSync(`SELECT * FROM kategori WHERE tipe=2 ORDER BY id DESC`);
    return rows;
  } catch (error) {
    console.error('❌ Gagal ambil kategori:', error);
    throw error;
  }
}

export const getKategoriById = (id) => {
  const db = getDB();
  try {
    const row = db.getFirstSync(`SELECT * FROM kategori WHERE id = ?`, [id]);
    return row;
  } catch (error) {
    console.error('❌ Gagal ambil kategori by ID:', error);
    throw error;
  }
};

export const updateKategori = (id, nama, tipe) => {
  const db = getDB();
  try {
    db.runSync(`UPDATE kategori SET nama = ?, tipe = ? WHERE id = ?`, [
      nama,
      tipe,
      id,
    ]);
    console.log('✅ Kategori diupdate, ID:', id);
  } catch (error) {
    console.error('❌ Gagal update kategori:', error);
    throw error;
  }
};

export const deleteKategori = (id) => {
  const db = getDB();
  try {
    db.runSync(`DELETE FROM kategori WHERE id = ?`, [id]);
    console.log('✅ Kategori dihapus, ID:', id);
  } catch (error) {
    console.error('❌ Gagal hapus kategori:', error);
    throw error;
  }
};
