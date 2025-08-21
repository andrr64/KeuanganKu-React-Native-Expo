// database/models/chartdata.js
import { getColors } from '../../utils/colorGenerator';
import { getDB } from '../db';

// Helper: pembulatan angka, contoh 10,95 -> 11
const format = (num) => Math.round(num);


export const getWeeklyChartData = () => {
    const db = getDB();

    const query = `
        SELECT 
          strftime('%w', waktu) AS hari, -- 0 = Minggu, 1 = Senin, ... 6 = Sabtu
          SUM(CASE WHEN tipe = 1 THEN jumlah ELSE 0 END) AS pemasukan,
          SUM(CASE WHEN tipe = 2 THEN jumlah ELSE 0 END) AS pengeluaran
        FROM transactions
        WHERE date(waktu) BETWEEN date('now', 'weekday 1', '-7 days') AND date('now', 'weekday 0') 
        GROUP BY hari;
    `;

    try {
        const rows = db.getAllSync(query);
        const result = {
            pemasukan: Array(7).fill(0).map(format),
            pengeluaran: Array(7).fill(0).map(format),
        }

        rows.forEach((data) => {
            const indeks = Number(data.hari)
            result.pemasukan[indeks] = data.pemasukan;
            result.pengeluaran[indeks] = data.pengeluaran;
        })

        return result
    } catch (error) {
        console.error('Error fetching weekly chart data:', error);
        return {
            pemasukan: Array(7).fill(0).map(format),
            pengeluaran: Array(7).fill(0).map(format),
        };
    }
};

export const getMonthlyTrendData = () => {
    const db = getDB();
    const year = new Date().getFullYear();

    const query = `
        SELECT 
          strftime('%m', waktu) AS bulan,        -- '01' sampai '12'
          SUM(CASE WHEN tipe = 1 THEN jumlah ELSE 0 END) AS pemasukan,
          SUM(CASE WHEN tipe = 2 THEN jumlah ELSE 0 END) AS pengeluaran
        FROM transactions
        WHERE strftime('%Y', waktu) = ?
        GROUP BY bulan
        ORDER BY bulan;
    `;

    try {
        const rows = db.getAllSync(query, [year.toString()]);

        const pemasukan = Array(12).fill(0);
        const pengeluaran = Array(12).fill(0);
        const saldo = Array(12).fill(0);

        rows.forEach((row) => {
            const monthIndex = parseInt(row.bulan, 10) - 1; // '01' → 0, '12' → 11
            if (monthIndex >= 0 && monthIndex < 12) {
                pemasukan[monthIndex] = parseFloat(row.pemasukan) || 0;
                pengeluaran[monthIndex] = parseFloat(row.pengeluaran) || 0;
                saldo[monthIndex] = pemasukan[monthIndex] - pengeluaran[monthIndex];
            }
        });

        return { pemasukan, pengeluaran, saldo };
    } catch (error) {
        console.error("❌ Error fetching monthly trend data:", error);
        return {
            pemasukan: Array(12).fill(0),
            pengeluaran: Array(12).fill(0),
        };
    }
};

export const getKategoriChartData = (tipe = 2, waktu = 1) => {
    const db = getDB();

    let whereDate = "";
    const today = new Date();

    if (waktu === 1) {
        // 👉 Filter minggu ini (Senin - Minggu)
        const day = today.getDay(); // 0 = Minggu, 1 = Senin
        const diffToMonday = day === 0 ? -6 : 1 - day; // mundur ke Senin
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() + diffToMonday);
        startOfWeek.setHours(0, 0, 0, 0);

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);

        whereDate = `AND date(transactions.waktu) BETWEEN date('${startOfWeek.toISOString().split("T")[0]}') 
                     AND date('${endOfWeek.toISOString().split("T")[0]}')`;
    } else if (waktu === 2) {
        // 👉 Filter tahun ini (Jan - Des)
        const year = today.getFullYear();
        whereDate = `AND strftime('%Y', transactions.waktu) = '${year}'`;
    }

    const query = `
        SELECT 
          kategori.id,
          kategori.nama,
          SUM(transactions.jumlah) AS total
        FROM transactions
        LEFT JOIN kategori ON kategori.id = transactions.id_kategori
        WHERE transactions.tipe = ?
        ${whereDate}
        GROUP BY kategori.id, kategori.nama;
    `;

    const rows = db.getAllSync(query, [tipe]);
    const warnaLegend = "#7F7F7F";
    const warnaWarnaPie = getColors(rows.length);

    return rows.map((data, index) => ({
        name: data.nama,
        population: data.total,
        color: warnaWarnaPie[index],
        legendFontColor: warnaLegend,
        legendFontSize: 13,
    }));
};