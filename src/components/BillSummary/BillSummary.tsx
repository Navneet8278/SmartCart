import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from './BillSummary.styles';

interface BillSummaryProps {
  subtotal: number;
  shipping: number;
  total: number;
  onCheckout: () => void;
}

export const BillSummary = ({
  subtotal,
  shipping,
  total,
  onCheckout,
}: BillSummaryProps) => {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.label}>Subtotal</Text>
        <Text style={styles.value}>${Number(subtotal || 0).toFixed(2)}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Shipping</Text>
        <Text style={styles.value}>${Number(shipping || 0).toFixed(2)}</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.row}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalValue}>${Number(total || 0).toFixed(2)}</Text>
      </View>

      <TouchableOpacity style={styles.checkoutBtn} onPress={onCheckout}>
        <Text style={styles.checkoutText}>Proceed to Checkout →</Text>
      </TouchableOpacity>
    </View>
  );
};

export default BillSummary;
