import { useState } from 'react';
import {
  View,
  Text,
  Modal,
  Pressable,
  TextInput,
  StyleSheet,
  Alert,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { addWallet } from '../database/models/wallet';

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

const TambahWalletModal = ({ visible, onSuccess, onClose }) => {
  const [walletName, setWalletName] = useState('');
  const [initialBalance, setInitialBalance] = useState('');

  const handleSaveWallet = () => {
    if (!walletName.trim()) {
      Alert.alert('Error', 'Harap isi nama wallet.');
      return;
    }

    const balanceNumber = parseFloat(initialBalance) || 0;

    try {
      addWallet(walletName, balanceNumber, () => {
        Alert.alert('Sukses', 'Wallet berhasil ditambahkan');
        setWalletName('');
        setInitialBalance('');
        onSuccess();
        onClose();
      });
    } catch (error) {
      Alert.alert('Gagal', `Gagal menambahkan wallet: ${error}`);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={visible}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.modalContainer}>
        <ModalHeader title="Tambah Wallet" onClose={onClose} />
        <View style={styles.formContainer}>
          <FormTextInput
            label="Nama Wallet"
            placeholder="Contoh: Dompet Utama"
            value={walletName}
            onChangeText={setWalletName}
          />
          <FormTextInput
            label="Saldo Awal"
            placeholder="0"
            value={initialBalance}
            onChangeText={setInitialBalance}
            keyboardType="numeric"
          />
          <ActionButtons onCancel={onClose} onSave={handleSaveWallet} />
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default TambahWalletModal;

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
    marginTop: 20,
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
    backgroundColor: '#2563EB', // solid blue
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});