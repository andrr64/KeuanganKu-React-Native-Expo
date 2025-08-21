Oke bro, aku bikinin template dokumen untuk aplikasi sesuai struktur yang kamu kasih. Jadi bisa kamu pakai buat dokumentasi proyek atau laporan.

---

# 📑 Proyek Akhir

## 1. Definisi Proyek


- **Nama Aplikasi**: KeuanganKu  
- **Deskripsi Singkat**:  
  KeuanganKu adalah aplikasi manajemen keuangan pribadi berbasis web yang membantu pengguna mencatat pemasukan, pengeluaran, serta memantau saldo secara praktis. Aplikasi ini menyediakan visualisasi data berupa grafik mingguan, bulanan, dan tahunan agar pengguna lebih mudah mengatur keuangan.  
- **Tujuan Utama**:  
  - Membantu pengguna mengatur dan melacak keuangan pribadi.  
  - Memberikan laporan berbentuk grafik agar data lebih mudah dipahami.  
  - Menyediakan database lokal sederhana menggunakan SQLite untuk penyimpanan data.  
- **Platform Target**: Web (Desktop & Mobile Responsive).  

- **Bahasa Pemrograman dan Framework**: React.js (JavaScript + JSX).  

---

## 2. Desain UI

* **Wireframe/Mockup**:

  * (sertakan screenshot/sketsa alur tampilan aplikasi)
* **Flow Navigasi**:

  * (contoh: Login → Dashboard → Detail → Setting)
* **Prinsip Desain**: (misalnya clean, minimalis, fokus pada UX)

---

## 3. Dependensi Library  

- **React Native** → framework utama untuk aplikasi mobile.  
- **Expo** → environment untuk build & running aplikasi.  
- **expo-sqlite** → database SQLite untuk penyimpanan data lokal.  
- **react-native-chart-kit** → visualisasi data (grafik pemasukan/pengeluaran).  
- **react-navigation** → manajemen navigasi antar halaman.  
- **react-native-paper** → komponen UI siap pakai.  
- **dayjs** → manipulasi dan format tanggal.  
- **react-native-toast-message** → notifikasi ringan (toast).  
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