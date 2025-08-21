import { useState } from 'react';
import {
    View,
    Text,
    Modal,
    Pressable,
    TextInput,
    StyleSheet,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import { addKategori } from '../database/models/kategori';

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

const FormTextInput = ({ label, value, onChangeText, placeholder }) => (
    <>
        <Text style={styles.inputLabel}>{label}</Text>
        <TextInput
            style={styles.textInput}
            placeholder={placeholder}
            value={value}
            onChangeText={onChangeText}
        />
    </>
);

const TypePicker = ({ label, selectedValue, onValueChange }) => (
    <>
        <Text style={styles.inputLabel}>{label}</Text>
        <View style={styles.pickerWrapper}>
            <Picker
                selectedValue={selectedValue}
                onValueChange={onValueChange}
                style={styles.picker}
            >
                <Picker.Item label="Pemasukan" value={1} />
                <Picker.Item label="Pengeluaran" value={2} />
            </Picker>
        </View>
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
const TambahKategoriModal = ({ visible, onSuccess, onClose }) => {
    const [categoryName, setCategoryName] = useState('');
    const [categoryType, setCategoryType] = useState(1); // default: 1 for income

    const handleSaveCategory = () => {
        if (!categoryName.trim()) {
            alert('Harap isi nama kategori');
            return;
        }

        try {
            addKategori(categoryName, categoryType, () => {
                alert('Kategori berhasil ditambahkan');
                setCategoryName('');
                setCategoryType(1); // Reset to default
                onSuccess();
                onClose();
            });
        } catch (error) {
            alert(`Gagal menambahkan kategori: ${error}`);
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
                <ModalHeader title="Tambah Kategori" onClose={onClose} />
                <View style={styles.formContainer}>
                    <FormTextInput
                        label="Nama Kategori"
                        placeholder="Contoh: Makan, Gaji"
                        value={categoryName}
                        onChangeText={setCategoryName}
                    />
                    <TypePicker
                        label="Jenis"
                        selectedValue={categoryType}
                        onValueChange={(itemValue) => setCategoryType(itemValue)}
                    />
                    <ActionButtons onCancel={onClose} onSave={handleSaveCategory} />
                </View>
            </SafeAreaView>
        </Modal>
    );
};

export default TambahKategoriModal;

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
    pickerWrapper: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 12,
        backgroundColor: '#fff',
        marginBottom: 16,
        overflow: 'hidden',
    },
    picker: {
        height: 50,
        width: '100%',
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
        backgroundColor: '#2563EB',
    },
    buttonText: {
        fontSize: 14,
        fontWeight: '600',
    },
});