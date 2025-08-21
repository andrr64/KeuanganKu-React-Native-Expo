import { useState, useCallback } from 'react';
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
import WalletCard from '../components/WalletCard';

// --- Modal Imports ---
import TambahPengeluaranModal from '../modals/TambahPengeluaranModal';
import TambahPemasukanModal from '../modals/TambahPemasukanModal';
import TambahWalletModal from '../modals/TambahWalletModal';
import TambahKategoriModal from '../modals/TambahKategoriModal';
import EditPemasukanModal from '../modals/EditPemasukanModal';
import EditPengeluaranModal from '../modals/EditPengeluaranModal';
import EditWalletModal from '../modals/EditWalletModal';

// --- Database & Utility Imports ---
import { getAllTransaksi } from '../database/models/transaksi';
import { getAllWallet, getTotalSaldo } from '../database/models/wallet';
import { formatUang } from '../utils/format';


// --- Sub-Components for UI ---
const Header = () => (
  <View style={styles.headerContainer}>
    <Text style={styles.headerTitle}>Beranda</Text>
    <Text style={styles.headerSubtitle}>Selamat datang di aplikasi keuangan Anda</Text>
  </View>
);

const BalanceCard = ({ totalBalance }) => (
  <View style={styles.balanceCardContainer}>
    <Text style={styles.balanceCardLabel}>Total Saldo</Text>
    <Text style={styles.balanceCardValue}>{formatUang(totalBalance)}</Text>
  </View>
);

const ActionButtons = ({ onAddIncome, onAddExpense }) => (
  <View style={styles.actionButtonsContainer}>
    <TouchableOpacity style={styles.actionButton} onPress={onAddIncome}>
      <FontAwesome5 name="arrow-up" size={16} color="#2563EB" />
      <Text style={styles.actionButtonText}>Add Pemasukan</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.actionButton} onPress={onAddExpense}>
      <FontAwesome5 name="arrow-down" size={16} color="#DC2626" />
      <Text style={styles.actionButtonText}>Add Pengeluaran</Text>
    </TouchableOpacity>
  </View>
);

const WalletList = ({ wallets, onEditWallet }) => (
  <FlatList
    data={wallets}
    keyExtractor={(item) => item.id.toString()}
    renderItem={({ item }) => (
      <WalletCard
        wallet={item}
        onClick={() => onEditWallet(item)}
      />
    )}
    ListEmptyComponent={<Text style={styles.emptyListText}>Belum ada wallet</Text>}
    ItemSeparatorComponent={() => <View style={styles.separator} />}
    scrollEnabled={false}
  />
);

const AddButtons = ({ onAddWallet, onAddCategory }) => (
  <View style={styles.actionButtonsContainer}>
    <TouchableOpacity style={styles.actionButton} onPress={onAddWallet}>
      <FontAwesome5 name="plus" size={16} color="#2563EB" />
      <Text style={styles.actionButtonText}>Add Wallet</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.actionButton} onPress={onAddCategory}>
      <FontAwesome5 name="plus" size={16} color="#2563EB" />
      <Text style={styles.actionButtonText}>Add Kategori</Text>
    </TouchableOpacity>
  </View>
);

const SectionHeader = ({ title }) => (
  <View style={styles.sectionHeaderContainer}>
    <Text style={styles.sectionHeaderTitle}>{title}</Text>
  </View>
);


// --- Main Component ---

export default function Homepage() {
  // --- State Management ---
  const [isAddExpenseModalVisible, setAddExpenseModalVisible] = useState(false);
  const [isAddIncomeModalVisible, setAddIncomeModalVisible] = useState(false);
  const [isAddWalletModalVisible, setAddWalletModalVisible] = useState(false);
  const [isAddCategoryModalVisible, setAddCategoryModalVisible] = useState(false);

  const [isEditIncomeModalVisible, setEditIncomeModalVisible] = useState(false);
  const [isEditExpenseModalVisible, setEditExpenseModalVisible] = useState(false);
  const [isEditWalletModalVisible, setEditWalletModalVisible] = useState(false);

  const [selectedWallet, setSelectedWallet] = useState(null);
  const [selectedIncome, setSelectedIncome] = useState(null);
  const [selectedExpense, setSelectedExpense] = useState(null);

  const [wallets, setWallets] = useState([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);

  // --- Data Fetching ---
  const fetchAllData = useCallback(() => {
    setTotalBalance(getTotalSaldo());
    setWallets(getAllWallet());
    setTransactions(getAllTransaksi(20));
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchAllData();
    }, [fetchAllData])
  );

  // --- Event Handlers ---
  const handleEditWallet = (wallet) => {
    setSelectedWallet(wallet);
    setEditWalletModalVisible(true);
  };

  const handleEditTransaction = (transaction) => {
    if (transaction.tipe === 1) { // Income
      setSelectedIncome(transaction);
      setEditIncomeModalVisible(true);
    } else { // Expense
      setSelectedExpense(transaction);
      setEditExpenseModalVisible(true);
    }
  };

  // --- Render ---
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }} edges={['top']}>
      {/* Modals */}
      <EditWalletModal
        visible={isEditWalletModalVisible}
        data={selectedWallet}
        onSuccess={() => {
          fetchAllData();
          setEditWalletModalVisible(false);
          setSelectedWallet(null);
        }}
        onClose={() => {
          setEditWalletModalVisible(false);
          setSelectedWallet(null);
        }}
      />
      <TambahPengeluaranModal
        visible={isAddExpenseModalVisible}
        onSuccess={fetchAllData}
        onClose={() => setAddExpenseModalVisible(false)}
      />
      <EditPemasukanModal
        visible={isEditIncomeModalVisible}
        data={selectedIncome}
        onSuccess={() => {
          fetchAllData();
          setEditIncomeModalVisible(false);
          setSelectedIncome(null);
        }}
        onClose={() => {
          setEditIncomeModalVisible(false);
          setSelectedIncome(null);
        }}
      />
      <EditPengeluaranModal
        visible={isEditExpenseModalVisible}
        data={selectedExpense}
        onSuccess={() => {
          fetchAllData();
          setEditExpenseModalVisible(false);
          setSelectedExpense(null);
        }}
        onClose={() => {
          setEditExpenseModalVisible(false);
          setSelectedExpense(null);
        }}
      />
      <TambahPemasukanModal
        visible={isAddIncomeModalVisible}
        onSuccess={fetchAllData}
        onClose={() => setAddIncomeModalVisible(false)}
      />
      <TambahWalletModal
        visible={isAddWalletModalVisible}
        onSuccess={fetchAllData}
        onClose={() => setAddWalletModalVisible(false)}
      />
      <TambahKategoriModal
        visible={isAddCategoryModalVisible}
        onSuccess={() => { }}
        onClose={() => setAddCategoryModalVisible(false)}
      />

      {/* Main Content */}
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TransactionItem data={item} onClick={() => handleEditTransaction(item)} />
        )}
        ListHeaderComponent={
          <>
            <Header />
            <BalanceCard totalBalance={totalBalance} />
            <ActionButtons
              onAddIncome={() => setAddIncomeModalVisible(true)}
              onAddExpense={() => setAddExpenseModalVisible(true)}
            />
            <WalletList wallets={wallets} onEditWallet={handleEditWallet} />
            <AddButtons
              onAddWallet={() => setAddWalletModalVisible(true)}
              onAddCategory={() => setAddCategoryModalVisible(true)}
            />
            <SectionHeader title="Transaksi Terbaru" />
          </>
        }
        ListEmptyComponent={<Text style={styles.emptyListText}>Belum ada transaksi</Text>}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16 }}
      />
    </SafeAreaView>
  );
}

// === STYLES ===
const styles = StyleSheet.create({
  headerContainer: {
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827"
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  balanceCardContainer: {
    backgroundColor: '#2563EB',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
  },
  balanceCardLabel: {
    color: 'white',
    fontSize: 14
  },
  balanceCardValue: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    marginHorizontal: 4,
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600'
  },
  sectionHeaderContainer: {
    marginTop: 8,
    marginBottom: 12,
  },
  sectionHeaderTitle: {
    fontSize: 18,
    fontWeight: '600'
  },
  emptyListText: {
    textAlign: "center",
    paddingVertical: 16
  },
  separator: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 8,
  },
});