import React, { useCallback, useState } from 'react';
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
import TambahPengeluaranModal from '../modals/TambahPengeluaranModal';
import EditPengeluaranModal from '../modals/EditPengeluaranModal'; // Added for editing

// --- Database & Utility Imports ---
import { getAllTransaksi, getPengeluaranBulanIni } from '../database/models/transaksi';
import { formatUang } from '../utils/format';

// --- Sub-Components for UI ---

const Header = ({ title }) => (
  <View style={styles.headerContainer}>
    <Text style={styles.headerTitle}>{title}</Text>
    <Text style={styles.headerSubtitle}>Pantau pengeluaran agar tetap hemat</Text>
  </View>
);

const ExpenseBalanceCard = ({ totalExpense }) => (
  <View style={styles.balanceCardContainer}>
    <Text style={styles.balanceCardLabel}>Total Pengeluaran</Text>
    <Text style={styles.balanceCardLabel}>(Bulan Ini)</Text>
    <Text style={styles.balanceCardValue}>{formatUang(totalExpense)}</Text>
  </View>
);

const AddExpenseButton = ({ onPress }) => (
  <View style={styles.actionButtonContainer}>
    <TouchableOpacity style={styles.actionButton} onPress={onPress}>
      <FontAwesome5 name="arrow-down" size={16} color="#DC2626" />
      <Text style={styles.actionButtonText}>Tambah Pengeluaran</Text>
    </TouchableOpacity>
  </View>
);

const SectionHeader = ({ title }) => (
  <View style={styles.sectionHeaderContainer}>
    <Text style={styles.sectionHeaderTitle}>{title}</Text>
  </View>
);

// --- Main Component ---

export default function Expensepage() {
  // --- State Management ---
  const [isAddExpenseModalVisible, setAddExpenseModalVisible] = useState(false);
  const [isEditExpenseModalVisible, setEditExpenseModalVisible] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [expenseTransactions, setExpenseTransactions] = useState([]);
  const [pengeluaranBulanIni, setPengeluaran] = useState(0);

  // --- Data Fetching ---
  const fetchExpenseData = useCallback(() => {
    setExpenseTransactions(getAllTransaksi(null, 2));
    setPengeluaran(getPengeluaranBulanIni());
  }, []);

  useFocusEffect(fetchExpenseData);

  // --- Event Handlers ---
  const handleEditExpense = (expense) => {
    setSelectedExpense(expense);
    setEditExpenseModalVisible(true);
  };


  // --- Render ---
  return (
    <>
      <EditPengeluaranModal
        visible={isEditExpenseModalVisible}
        data={selectedExpense}
        onSuccess={() => {
          fetchExpenseData();
          setEditExpenseModalVisible(false);
          setSelectedExpense(null);
        }}
        onClose={() => {
          setEditExpenseModalVisible(false);
          setSelectedExpense(null);
        }}
      />
      <TambahPengeluaranModal
        visible={isAddExpenseModalVisible}
        onSuccess={() => {
          fetchExpenseData();
          setAddExpenseModalVisible(false);
        }}
        onClose={() => setAddExpenseModalVisible(false)}
      />

      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <FlatList
          data={expenseTransactions}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TransactionItem data={item} onClick={() => handleEditExpense(item)} />
          )}
          ListHeaderComponent={
            <>
              <Header title="Pengeluaran" />
              <ExpenseBalanceCard totalExpense={pengeluaranBulanIni} />
              <AddExpenseButton onPress={() => setAddExpenseModalVisible(true)} />
              <SectionHeader title="Daftar Pengeluaran" />
            </>
          }
          ListEmptyComponent={
            <Text style={styles.emptyListText}>Belum ada pengeluaran</Text>
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
    backgroundColor: '#DC2626', // Red for expense
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
  },
  balanceCardLabel: {
    color: 'white',
    fontSize: 14,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
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
    backgroundColor: '#fef2f2',
    padding: 12,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#DC2626',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#DC2626',
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
  separator: {
    height: 1,
    backgroundColor: '#f3f4f6',
  },
});
