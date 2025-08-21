import { ScrollView, Pressable, Dimensions, StyleSheet, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BarChart, LineChart, PieChart } from 'react-native-chart-kit';
import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';

// --- Database & Utility Imports ---
import {
  getWeeklyChartData,
  getMonthlyTrendData,
  getKategoriChartData,
} from '../database/models/chart_data';
import { formatUang } from '../utils/format';

// --- Constants ---
const screenWidth = Dimensions.get('window').width;
const chartConfig = {
  backgroundColor: '#fff',
  backgroundGradientFrom: '#fff',
  backgroundGradientTo: '#fff',
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(17, 24, 39, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
  barPercentage: 0.6,
};

// --- Sub-Components for UI ---
const Header = ({ title, subtitle }) => (
  <View style={styles.headerContainer}>
    <Text style={styles.headerTitle}>{title}</Text>
    <Text style={styles.headerSubtitle}>{subtitle}</Text>
  </View>
);

const PieChartSection = ({ data, type, period, onTypeChange, onPeriodChange }) => {
  const totalAmount = data.reduce((sum, item) => sum + item.population, 0);
  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Distribusi Kategori</Text>
      {/* Filters */}
      <View style={styles.filterGroup}>
        <Pressable style={[styles.filterButton, type === 1 && styles.filterButtonActive]} onPress={() => onTypeChange(1)}>
          <Text style={[styles.filterText, type === 1 && styles.filterTextActive]}>Pemasukan</Text>
        </Pressable>
        <Pressable style={[styles.filterButton, type === 2 && styles.filterButtonActive]} onPress={() => onTypeChange(2)}>
          <Text style={[styles.filterText, type === 2 && styles.filterTextActive]}>Pengeluaran</Text>
        </Pressable>
      </View>
      <View style={styles.filterGroup}>
        <Pressable style={[styles.filterButton, period === 1 && styles.filterButtonActive]} onPress={() => onPeriodChange(1)}>
          <Text style={[styles.filterText, period === 1 && styles.filterTextActive]}>Minggu Ini</Text>
        </Pressable>
        <Pressable style={[styles.filterButton, period === 2 && styles.filterButtonActive]} onPress={() => onPeriodChange(2)}>
          <Text style={[styles.filterText, period === 2 && styles.filterTextActive]}>Bulan Ini</Text>
        </Pressable>
      </View>

      {data.length > 0 ? (
        <>
          <PieChart
            data={data}
            width={screenWidth - 48}
            height={220}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="16"
            style={styles.chart}
          />
          <View style={styles.detailsContainer}>
            <Text style={styles.detailsTitle}>Rincian Kategori</Text>
            {data.map((item, index) => (
              <View key={index} style={styles.detailRow}>
                <View style={[styles.detailDot, { backgroundColor: item.color }]} />
                <Text style={styles.detailLabel} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.detailAmount}>{formatUang(item.population)}</Text>
              </View>
            ))}
            <View style={styles.divider} />
            <View style={styles.detailRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalAmount}>{formatUang(totalAmount)}</Text>
            </View>
          </View>
        </>
      ) : (
        <Text style={styles.emptyChartText}>Belum ada data untuk kategori ini.</Text>
      )}
    </View>
  );
};

const WeeklyBarChart = ({ data }) => (
  <View style={styles.card}>
    <Text style={styles.sectionTitle}>Aktivitas Mingguan</Text>
    <BarChart
      data={{
        labels: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'],
        datasets: [{ data: data.pengeluaran || Array(7).fill(0) }],
      }}
      width={screenWidth - 50}
      height={220}
      fromZero
      yAxisLabel="Rp "
      chartConfig={{ ...chartConfig, color: () => '#DC2626' }}
      style={styles.chart}
    />
  </View>
);

const MonthlyLineChart = ({ data }) => {
  const totalIncome = data.pemasukan.reduce((a, b) => a + b, 0);
  const totalExpense = data.pengeluaran.reduce((a, b) => a + b, 0);
  const netBalance = totalIncome - totalExpense;

  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Tren Bulanan</Text>
      {data.pemasukan.some(Boolean) || data.pengeluaran.some(Boolean) ? (
        <>
          <LineChart
            data={{
              labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],
              datasets: [
                { data: data.pemasukan, color: () => '#16A34A', strokeWidth: 2 },
                { data: data.pengeluaran, color: () => '#DC2626', strokeWidth: 2 },
              ],
              legend: ['Pemasukan', 'Pengeluaran'],
            }}
            width={screenWidth - 48}
            height={220}
            yAxisLabel="Rp "
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
          <View style={styles.summaryContainer}>
            <View style={styles.detailRow}>
              <Text style={styles.summaryLabel}>Total Pemasukan</Text>
              <Text style={[styles.summaryValue, { color: '#16A34A' }]}>{formatUang(totalIncome)}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.summaryLabel}>Total Pengeluaran</Text>
              <Text style={[styles.summaryValue, { color: '#DC2626' }]}>{formatUang(totalExpense)}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.detailRow}>
              <Text style={styles.totalLabel}>Saldo Bersih</Text>
              <Text style={styles.totalAmount}>{formatUang(netBalance)}</Text>
            </View>
          </View>
        </>
      ) : (
        <Text style={styles.emptyChartText}>Tidak ada data tren bulanan.</Text>
      )}
    </View>
  );
};

// --- Main Component ---
export default function Statistikpage() {
  const [weeklyChartData, setWeeklyChartData] = useState({ pemasukan: [], pengeluaran: [] });
  const [monthlyTrendData, setMonthlyTrendData] = useState({ pemasukan: [], pengeluaran: [], saldo: [] });
  const [categoryChartData, setCategoryChartData] = useState([]);
  const [pieChartType, setPieChartType] = useState(2); // 1: income, 2: expense
  const [pieChartPeriod, setPieChartPeriod] = useState(1); // 1: weekly, 2: monthly

  useFocusEffect(
    useCallback(() => {
      setWeeklyChartData(getWeeklyChartData());
      setMonthlyTrendData(getMonthlyTrendData());
      setCategoryChartData(getKategoriChartData(pieChartType, pieChartPeriod));
    }, [pieChartType, pieChartPeriod])
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Header title="Statistik" subtitle="Ringkasan Keuangan Anda" />
        <PieChartSection
          data={categoryChartData}
          type={pieChartType}
          period={pieChartPeriod}
          onTypeChange={setPieChartType}
          onPeriodChange={setPieChartPeriod}
        />
        <WeeklyBarChart data={weeklyChartData} />
        <MonthlyLineChart data={monthlyTrendData} />
      </ScrollView>
    </SafeAreaView>
  );
}

// === STYLES ===
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 16,
  },
  headerContainer: {
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  chart: {
    borderRadius: 16,
    alignItems: 'center',
  },
  emptyChartText: {
    textAlign: 'center',
    color: '#6B7280',
    marginVertical: 60,
    fontSize: 14,
  },
  filterGroup: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
  },
  filterButtonActive: {
    backgroundColor: '#2563EB',
  },
  filterText: {
    fontSize: 13,
    color: '#374151',
  },
  filterTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  detailsContainer: {
    marginTop: 16,
  },
  detailsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  detailDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  detailLabel: {
    fontSize: 13,
    color: '#555',
    flex: 1,
  },
  detailAmount: {
    fontSize: 13,
    fontWeight: '500',
    color: '#333',
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  totalAmount: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  summaryContainer: {
    marginTop: 12,
    paddingHorizontal: 12,
  },
  summaryLabel: {
    fontSize: 13,
    color: '#555',
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 6,
  },
});
