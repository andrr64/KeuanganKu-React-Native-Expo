import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { formatUang } from '../utils/format';

// --- Sub-Components for UI ---
const CardHeader = () => (
  <View style={styles.cardHeaderContainer}>
    <FontAwesome5
      name="credit-card"
      size={24}
      color="rgba(255,255,255,0.7)"
    />
    <Text style={styles.cardHeaderLabel}>Wallet</Text>
  </View>
);

const CardDetails = ({ name, balance }) => (
  <View style={styles.cardDetailsContainer}>
    <View>
      <Text style={styles.walletNameText}>{name}</Text>
      <Text style={styles.walletBalanceText}>{formatUang(balance)}</Text>
    </View>
  </View>
);

// --- Main Component ---
const WalletCard = ({ wallet, onClick }) => {
  // A handler to ensure onClick is only called if it's a valid function.
  const handlePress = () => {
    if (onClick && typeof onClick === 'function') {
      onClick();
    }
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <View style={styles.cardContainer}>
        <CardHeader />
        <CardDetails name={wallet.nama} balance={wallet.saldo} />
      </View>
    </TouchableOpacity>
  );
};

export default WalletCard;

// === STYLES ===
const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#1F2937', // Dark Gray Blue
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  // Header Styles
  cardHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  cardHeaderLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  // Details Styles
  cardDetailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  walletNameText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  walletBalanceText: {
    color: '#4ADE80', // Bright Green
    fontSize: 14,
    fontWeight: '500',
    marginTop: 4,
  },
});
