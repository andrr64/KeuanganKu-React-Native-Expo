Oke bro, aku bikinin template dokumen untuk aplikasi sesuai struktur yang kamu kasih. Jadi bisa kamu pakai buat dokumentasi proyek atau laporan.

---

# 📑 Proyek Akhir

## 1. Definisi Proyek

* **Nama Aplikasi**: (isi nama aplikasi)
* **Deskripsi Singkat**: (jelaskan secara ringkas tujuan aplikasi)
* **Tujuan Utama**:

  * (misalnya: membantu pengguna mengatur keuangan pribadi)
* **Platform Target**: (Android, iOS, Web, Desktop)
* **Bahasa Pemrograman**: (misalnya React Native / Flutter / Node.js / Python)

---

## 2. Desain UI

* **Wireframe/Mockup**:

  * (sertakan screenshot/sketsa alur tampilan aplikasi)
* **Flow Navigasi**:

  * (contoh: Login → Dashboard → Detail → Setting)
* **Prinsip Desain**: (misalnya clean, minimalis, fokus pada UX)

---

## 3. Dependensi Library

* **React Native** (contoh)
* **SQLite** (penyimpanan data lokal)
* **chart-kit / victory-native** (untuk chart & visualisasi data)
* **axios** (untuk request API, jika ada)
* **react-navigation** (untuk manajemen navigasi)

---

## 4. Database

### 4.1 Teknologi

* **SQLite**: database lokal ringan untuk aplikasi mobile.

### 4.2 Entitas / Tabel

* **wallet**

  * id (INTEGER, PK, Auto Increment)
  * nama (TEXT)
  * saldo (REAL)

* **transactions**

  * id (INTEGER, PK, Auto Increment)
  * nama (TEXT)
  * jumlah (REAL)
  * tipe (INTEGER, 1 = pemasukan, 2 = pengeluaran)
  * tanggal (TEXT, format: YYYY-MM-DD HH\:mm\:ss)
  * wallet\_id (INTEGER, FK ke wallet)

---

## 5. Komponen UI

* **Header** (judul halaman, tombol back)
* **Form Input** (TextInput, Dropdown, DatePicker)
* **Button** (Simpan, Edit, Hapus)
* **ListView / FlatList** (untuk menampilkan data transaksi)
* **Chart** (bar chart/line chart untuk laporan)
* **Modal** (pop-up konfirmasi)

---

## 6. Koding

### 6.1 Struktur Proyek

```
src/
 ├── components/   # UI reusable
 ├── database/     # model & query sqlite
 ├── screens/      # halaman aplikasi
 ├── utils/        # helper, formatter
 └── App.js
```

### 6.2 Contoh Kode (SQLite Model)

```javascript
// src/database/db.js
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase("app.db");

export const createTables = () => {
  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS wallet (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nama TEXT NOT NULL,
        saldo REAL NOT NULL DEFAULT 0
      );`
    );
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nama TEXT NOT NULL,
        jumlah REAL NOT NULL,
        tipe INTEGER NOT NULL,
        tanggal TEXT NOT NULL,
        wallet_id INTEGER,
        FOREIGN KEY (wallet_id) REFERENCES wallet(id)
      );`
    );
  });
};
```

### 6.3 Contoh Komponen UI

```javascript
import { View, Text, Button } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={{ flex:1, justifyContent:'center', alignItems:'center' }}>
      <Text style={{ fontSize:20 }}>Selamat Datang!</Text>
      <Button title="Tambah Transaksi" onPress={() => {}} />
    </View>
  );
}
```

---

Mau aku bikinin juga **versi template tabel kosong (markdown)** biar kamu tinggal isi sesuai proyekmu?
