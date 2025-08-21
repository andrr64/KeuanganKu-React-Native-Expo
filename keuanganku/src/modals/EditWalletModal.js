import { useState, useEffect } from 'react';
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
import { updateWallet } from '../database/models/wallet'; // Assuming you have an update function

// --- Sub-Components for UI ---
const ModalHeader = ({ onClose, title }) => (
    <View style={styles.headerContainer}>
        <Pressable onPress={onClose}>
            <FontAwesome5 name="times" size={20} color="#000" />
        </Pressable>
        <Text style={styles.headerTitle}>{title}</Text>
        <View style={{ width: 20 }} />
    </View>
);

const WalletNameInput = ({ value, onChangeText }) => (
    <View style={styles.formContainer}>
        <Text style={styles.inputLabel}>Nama Wallet</Text>
        <TextInput
            style={styles.textInput}
            placeholder="Contoh: Dompet Utama"
            value={value}
            onChangeText={onChangeText}
        />
    </View>
);

const ActionButtons = ({ onCancel, onSave }) => (
    <View style={styles.buttonGroupContainer}>
        <Pressable
            style={[styles.button, styles.cancelButton]}
            onPress={onCancel}>
            <Text style={styles.buttonText}>Batal</Text>
        </Pressable>
        <Pressable
            style={[styles.button, styles.saveButton]}
            onPress={onSave}>
            <Text style={[styles.buttonText, { color: '#fff' }]}>
                Simpan Perubahan
            </Text>
        </Pressable>
    </View>
);

// --- Main Component ---
const EditWalletModal = ({ visible, data: walletData, onSuccess, onClose }) => {
    const [walletName, setWalletName] = useState('');

    useEffect(() => {
        if (walletData) {
            setWalletName(walletData.nama || '');
        }
    }, [walletData, visible]);

    // Handles the logic for updating the wallet.
    const handleUpdateWallet = () => {
        if (!walletName.trim()) {
            Alert.alert('Error', 'Harap isi nama wallet.');
            return;
        }
        if (!walletData?.id) {
            Alert.alert('Error', 'ID Wallet tidak ditemukan.');
            return;
        }
        try {
            // Assumes 'updateWallet' function takes id, new name, original balance, and a callback.
            updateWallet(walletData.id, walletName, walletData.saldo, () => {
                Alert.alert('Sukses', 'Wallet berhasil diperbarui.');
                onSuccess(); // Callback to refresh the list or perform other actions.
                onClose();   // Close the modal.
            });
        } catch (error) {
            Alert.alert('Gagal', `Gagal memperbarui wallet: ${error}`);
        }
    };

    return (
        <Modal
            animationType="slide"
            transparent={false}
            visible={visible}
            onRequestClose={onClose}>
            <SafeAreaView style={styles.modalContainer}>
                <ModalHeader title="Edit Wallet" onClose={onClose} />
                <WalletNameInput value={walletName} onChangeText={setWalletName} />
                <ActionButtons onCancel={onClose} onSave={handleUpdateWallet} />
            </SafeAreaView>
        </Modal>
    );
};

export default EditWalletModal;

// === STYLES ===
const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: '#f8f9fa',
        paddingHorizontal: 16,
    },
    // Header Styles
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
    // Form Styles
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
    // Button Group Styles
    buttonGroupContainer: {
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