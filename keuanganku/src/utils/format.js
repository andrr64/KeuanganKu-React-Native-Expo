// utils/format.js

export const formatUang = (number) => {
  if (!number) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0, // tanpa desimal
  }).format(number);
};


// ✅ Format JS Date ke format SQLite (YYYY-MM-DD HH:MM:SS)
export const formatDatetimeToSQLite = (date = new Date()) => {
  const pad = (n) => (n < 10 ? '0' + n : n);

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

export const parseSQLiteToDate = (sqliteString) => {
  if (!sqliteString) return new Date();

  // Split tanggal dan waktu
  const [datePart, timePart] = sqliteString.split(' ');
  if (!datePart) return new Date();

  const [year, month, day] = datePart.split('-').map(Number);
  let hours = 0, minutes = 0, seconds = 0;

  if (timePart) {
    [hours, minutes, seconds] = timePart.split(':').map(Number);
  }

  // Catatan: di JS, bulan dimulai dari 0
  return new Date(year, month - 1, day, hours, minutes, seconds);
};