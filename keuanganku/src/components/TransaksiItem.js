import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { formatUang } from '../utils/format';

// --- Sub-Components for UI ---
const TransactionIcon = ({ isIncome }) => {
  const iconName = isIncome ? 'arrow-up' : 'arrow-down';
  const backgroundColor = isIncome ? '#DCFCE7' : '#FEE2E2'; // Light Green / Light Red
  const iconColor = isIncome ? '#16A34A' : '#DC2626'; // Green / Red

  return (
    <View style={[styles.iconContainer, { backgroundColor }]}>
      <FontAwesome5 name={iconName} size={16} color={iconColor} />
    </View>
  );
};

const TransactionInfo = ({ title, time }) => (
  <View>
    <Text style={styles.transactionTitle}>{title}</Text>
    <Text style={styles.transactionTime}>{time}</Text>
  </View>
);

const TransactionAmount = ({ amount, isIncome }) => {
  const textColor = isIncome ? '#16A34A' : '#DC2626'; // Green / Red

  return (
    <Text style={[styles.amountText, { color: textColor }]}>
      {formatUang(amount)}
    </Text>
  );
};


// --- Main Component ---
const TransactionItem = ({ data, onClick }) => {
  const isIncome = data.tipe === 1;

  const handlePress = () => {
    if (onClick && typeof onClick === 'function') {
      onClick();
    }
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <View style={styles.itemContainer}>
        <View style={styles.leftSection}>
          <TransactionIcon isIncome={isIncome} />
          <TransactionInfo title={data.nama} time={data.waktu} />
        </View>
        <TransactionAmount amount={data.jumlah} isIncome={isIncome} />
      </View>
    </TouchableOpacity>
  );
};

export default TransactionItem;

// === STYLES ===
const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    padding: 10,
    borderRadius: 50, // Makes it a circle
  },
  transactionTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  transactionTime: {
    fontSize: 12,
    color: 'gray',
  },
  amountText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
