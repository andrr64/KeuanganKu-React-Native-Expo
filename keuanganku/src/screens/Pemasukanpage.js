import { useCallback, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';

// --- Component Imports ---
import TransactionItem from '../components/TransaksiItem';

// --- Modal Imports ---
import TambahPemasukanModal from '../modals/TambahPemasukanModal';
import EditPemasukanModal from '../modals/EditPemasukanModal';

// --- Database & Utility Imports ---
import { getAllTransaksi, getPemasukanBulanIni } from '../database/models/transaksi';
import { formatUang } from '../utils/format';

// --- Sub-Components for UI ---

const Header = ({ title }) => (
  <View style={styles.headerContainer}>
    <Text style={styles.headerTitle}>{title}</Text>
    <Text style={styles.headerSubtitle}>
      Pantau pemasukan untuk rencana keuangan lebih baik
    </Text>
  </View>
);

const IncomeBalanceCard = ({ totalIncome }) => (
  <View style={styles.balanceCardContainer}>
    <Text style={styles.balanceCardLabel}>Total Pemasukan</Text>
    <Text style={styles.balanceCardLabel}>(Bulan Ini)</Text>
    <Text style={styles.balanceCardValue}>{formatUang(totalIncome)}</Text>
  </View>
);

const AddIncomeButton = ({ onPress }) => (
  <View style={styles.actionButtonContainer}>
    <TouchableOpacity style={styles.actionButton} onPress={onPress}>
      <FontAwesome5 name="arrow-up" size={16} color="#16A34A" />
      <Text style={styles.actionButtonText}>Tambah Pemasukan</Text>
    </TouchableOpacity>
  </View>
);

const SectionHeader = ({ title }) => (
  <View style={styles.sectionHeaderContainer}>
    <Text style={styles.sectionHeaderTitle}>{title}</Text>
  </View>
);

// --- Main Component ---

export default function Incomepage() {
  // --- State Management ---
  const [isAddIncomeModalVisible, setAddIncomeModalVisible] = useState(false);
  const [isEditIncomeModalVisible, setEditIncomeModalVisible] = useState(false);
  const [selectedIncome, setSelectedIncome] = useState(null);
  const [incomeTransactions, setIncomeTransactions] = useState([]);
  const [pemasukanBulanIni, setPemasukan] = useState(0);

  // --- Data Fetching ---
  const fetchIncomeData = useCallback(() => {
    // Fetches all transactions of type 1 (income)
    setIncomeTransactions(getAllTransaksi(null, 1));
    setPemasukan(getPemasukanBulanIni());
  }, []);

  useFocusEffect(fetchIncomeData);

  // --- Event Handlers ---
  const handleEditIncome = (income) => {
    setSelectedIncome(income);
    setEditIncomeModalVisible(true);
  };

  // --- Render ---
  return (
    <>
      <EditPemasukanModal
        visible={isEditIncomeModalVisible}
        data={selectedIncome}
        onSuccess={() => {
          fetchIncomeData();
          setEditIncomeModalVisible(false);
          setSelectedIncome(null);
        }}
        onClose={() => {
          setEditIncomeModalVisible(false);
          setSelectedIncome(null);
        }}
      />
      <TambahPemasukanModal
        visible={isAddIncomeModalVisible}
        onSuccess={() => {
          fetchIncomeData();
          setAddIncomeModalVisible(false);
        }}
        onClose={() => setAddIncomeModalVisible(false)}
      />

      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <FlatList
          data={incomeTransactions}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TransactionItem data={item} onClick={() => handleEditIncome(item)} />
          )}
          ListHeaderComponent={
            <>
              <Header title="Pemasukan" />
              <IncomeBalanceCard totalIncome={pemasukanBulanIni} />
              <AddIncomeButton onPress={() => setAddIncomeModalVisible(true)} />
              <SectionHeader title="Daftar Pemasukan" />
            </>
          }
          ListEmptyComponent={
            <Text style={styles.emptyListText}>Belum ada pemasukan</Text>
          }
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 16 }}
        />
      </SafeAreaView>
    </>
  );
}

// === STYLES ===
const styles = StyleSheet.create({
  headerContainer: {
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  balanceCardContainer: {
    backgroundColor: '#16A34A', // Green for income
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
  },
  balanceCardLabel: {
    color: 'white',
    fontSize: 14,
  },
  balanceCardValue: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  actionButtonContainer: {
    marginBottom: 20,
  },
  actionButton: {
    backgroundColor: '#f0fdf4',
    padding: 12,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#16A34A',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#16A34A',
  },
  sectionHeaderContainer: {
    marginBottom: 12,
  },
  sectionHeaderTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  emptyListText: {
    textAlign: 'center',
    color: '#6B7280',
    fontSize: 14,
    marginTop: 20,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  separator: {
    height: 1,
    backgroundColor: '#f3f4f6',
  },
});
