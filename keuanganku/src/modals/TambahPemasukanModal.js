import { useEffect, useState } from 'react';
import {
  View,
  Text,
  Modal,
  Pressable,
  TextInput,
  StyleSheet,
  Platform,
  Alert,
  ScrollView,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';

// --- Database & Utility Imports ---
import { addTransaksi } from '../database/models/transaksi';
import { getAllKategoriPemasukan } from '../database/models/kategori';
import { getAllWallet } from '../database/models/wallet';
import { formatDatetimeToSQLite } from '../utils/format';

// --- Sub-Components for UI ---

const ModalHeader = ({ title, onClose }) => (
  <View style={styles.headerContainer}>
    <Pressable onPress={onClose}>
      <FontAwesome5 name="times" size={20} color="#000" />
    </Pressable>
    <Text style={styles.headerTitle}>{title}</Text>
    <View style={{ width: 20 }} />
  </View>
);

const FormTextInput = ({ label, value, onChangeText, placeholder, keyboardType = 'default' }) => (
  <>
    <Text style={styles.inputLabel}>{label}</Text>
    <TextInput
      style={styles.textInput}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
    />
  </>
);

const OptionSelector = ({ label, options, selectedId, onSelect }) => (
  <>
    <Text style={styles.inputLabel}>{label}</Text>
    <View style={styles.optionSelectorContainer}>
      {options.map((option) => (
        <Pressable
          key={option.id}
          style={[
            styles.optionButton,
            selectedId === option.id && styles.optionButtonSelected,
          ]}
          onPress={() => onSelect(option.id)}
        >
          <Text
            style={[
              styles.optionButtonText,
              selectedId === option.id && styles.optionButtonTextSelected,
            ]}
          >
            {option.nama}
          </Text>
        </Pressable>
      ))}
    </View>
  </>
);

const DateTimeInput = ({ onShowDatepicker, date }) => (
  <>
    <Text style={styles.inputLabel}>Tanggal dan Waktu</Text>
    <Pressable style={styles.dateInputButton} onPress={onShowDatepicker}>
      <Text style={styles.dateInputText}>
        {date.toLocaleDateString('id-ID')} {' '}
        {date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
      </Text>
    </Pressable>
  </>
);

const ActionButtons = ({ onCancel, onSave }) => (
  <View style={styles.actionButtonsContainer}>
    <Pressable style={[styles.button, styles.cancelButton]} onPress={onCancel}>
      <Text style={styles.buttonText}>Batal</Text>
    </Pressable>
    <Pressable style={[styles.button, styles.saveButton]} onPress={onSave}>
      <Text style={[styles.buttonText, { color: '#fff' }]}>Simpan</Text>
    </Pressable>
  </View>
);


// --- Main Component ---

const TambahPemasukanModal = ({ visible, onClose, onSuccess }) => {
  // --- State Management ---
  const [transactionName, setTransactionName] = useState('');
  const [transactionAmount, setTransactionAmount] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedWalletId, setSelectedWalletId] = useState(null);
  const [dateTime, setDateTime] = useState(new Date());
  const [isPickerVisible, setPickerVisible] = useState(false);
  const [pickerMode, setPickerMode] = useState('date');
  const [categories, setCategories] = useState([]);
  const [wallets, setWallets] = useState([]);

  // --- Effects & Data Handling ---
  const resetForm = (cats, wals) => {
    setTransactionName('');
    setTransactionAmount('');
    setDateTime(new Date());
    setSelectedCategoryId(cats[0]?.id || null);
    setSelectedWalletId(wals[0]?.id || null);
  };

  useEffect(() => {
    if (visible) {
      const fetchedCategories = getAllKategoriPemasukan();
      const fetchedWallets = getAllWallet();
      setCategories(fetchedCategories);
      setWallets(fetchedWallets);
      resetForm(fetchedCategories, fetchedWallets);
    }
  }, [visible]);

  // --- Handlers ---
  const handleDateTimeChange = (event, selectedDate) => {
    const currentDate = selectedDate || dateTime;
    setPickerVisible(Platform.OS === 'ios');
    setDateTime(currentDate);

    if (Platform.OS === 'android' && pickerMode === 'date') {
      showDateTimePicker('time');
    }
  };

  const showDateTimePicker = (mode) => {
    setPickerMode(mode);
    setPickerVisible(true);
  };

  const handleSaveTransaction = () => {
    if (!transactionName.trim() || !transactionAmount || !selectedCategoryId || !selectedWalletId) {
      Alert.alert('Error', 'Harap isi semua field yang diperlukan.');
      return;
    }

    addTransaksi(
      transactionName,
      parseFloat(transactionAmount),
      1, // Type 1 for income
      selectedCategoryId,
      selectedWalletId,
      formatDatetimeToSQLite(dateTime),
      () => {
        Alert.alert("Sukses", "Transaksi berhasil disimpan");
        onSuccess();
        onClose();
      }
    );
  };

  return (
    <Modal animationType="slide" transparent={false} visible={visible} onRequestClose={onClose}>
      <SafeAreaView style={styles.modalContainer}>
        <ModalHeader title="Tambah Pemasukan" onClose={onClose} />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.formContainer}>
            <FormTextInput
              label="Nama Transaksi"
              placeholder="Contoh: Gaji Bulanan"
              value={transactionName}
              onChangeText={setTransactionName}
            />
            <OptionSelector
              label="Kategori"
              options={categories}
              selectedId={selectedCategoryId}
              onSelect={setSelectedCategoryId}
            />
            <OptionSelector
              label="Wallet"
              options={wallets}
              selectedId={selectedWalletId}
              onSelect={setSelectedWalletId}
            />
            <FormTextInput
              label="Jumlah (Rp)"
              placeholder="0"
              value={transactionAmount}
              onChangeText={setTransactionAmount}
              keyboardType="numeric"
            />
            <DateTimeInput
              date={dateTime}
              onShowDatepicker={() => showDateTimePicker('date')}
            />
            {isPickerVisible && (
              <DateTimePicker
                value={dateTime}
                mode={pickerMode}
                display="default"
                onChange={handleDateTimeChange}
                locale="id"
              />
            )}
            <ActionButtons onCancel={onClose} onSave={handleSaveTransaction} />
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

export default TambahPemasukanModal;

// === STYLES ===
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  formContainer: {
    paddingTop: 20,
    paddingBottom: 40,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  dateInputButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 12,
    backgroundColor: '#fff',
    marginBottom: 16,
    justifyContent: 'center',
  },
  dateInputText: {
    fontSize: 16,
    color: '#000',
  },
  optionSelectorContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  optionButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#f1f3f5',
  },
  optionButtonSelected: {
    backgroundColor: '#16A34A', // Green for income
  },
  optionButtonText: {
    fontSize: 14,
    color: '#495057',
  },
  optionButtonTextSelected: {
    color: '#fff',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 20,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  cancelButton: {
    backgroundColor: '#f1f3f5',
  },
  saveButton: {
    backgroundColor: '#16A34A', // Green for income
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});