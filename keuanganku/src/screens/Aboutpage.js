import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// --- Sub-Components for UI ---

const Header = ({ title }) => (
    <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>{title}</Text>
    </View>
);

const ProfileSection = ({ imageUrl, name, description }) => (
    <View style={styles.profileContainer}>
        <Image
            source={{ uri: imageUrl }}
            style={styles.profileImage}
            // Fallback in case the image fails to load
            onError={(e) => console.log('Failed to load image:', e.nativeEvent.error)}
        />
        <Text style={styles.profileName}>{name}</Text>
        <Text style={styles.profileDescription}>{description}</Text>
    </View>
);


// --- Main Component ---

export default function AboutPage() {
    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <Header title="Tentang Aplikasi" />
            <View style={styles.content}>
                <ProfileSection
                    imageUrl="https://placehold.co/150x150/E2E8F0/4A5568?text=Foto+Profil"
                    name="Nama Pengembang"
                    description="Aplikasi ini dibuat untuk membantu Anda mengelola keuangan pribadi dengan lebih mudah dan efisien. Lacak setiap pemasukan dan pengeluaran untuk mencapai tujuan finansial Anda."
                />
            </View>
        </SafeAreaView>
    );
}

// === STYLES ===
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 16,
    },
    headerContainer: {
        marginBottom: 24,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#111827",
        textAlign: 'center',
    },
    content: {
        flex: 1,
        justifyContent: 'center', // Center content vertically
    },
    profileContainer: {
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f9fafb',
        borderRadius: 24,
    },
    profileImage: {
        width: 150,
        height: 150,
        borderRadius: 75, // Make it a circle
        marginBottom: 20,
        borderWidth: 3,
        borderColor: '#2563EB',
    },
    profileName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 8,
    },
    profileDescription: {
        fontSize: 16,
        color: '#4B5563',
        textAlign: 'center',
        lineHeight: 24, // Improve readability
    },
});
