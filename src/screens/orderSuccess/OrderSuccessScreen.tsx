import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './OrderSuccessScreen.styles';
import { AppRoutes } from '../../constants/routes';

export const OrderSuccessScreen = ({ navigation, route }: any) => {
  const orderId = route?.params?.orderId || 'SC-89210';
  const totalAmount = route?.params?.totalAmount || 2298;

  const handleViewOrders = () => {
    navigation.reset({
      index: 0,
      routes: [
        {
          name: AppRoutes.MainTabs,
          state: {
            routes: [{ name: AppRoutes.OrdersTab }],
            index: 3,
          },
        },
      ],
    });
  };

  const handleContinueShopping = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: AppRoutes.MainTabs }],
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <View style={styles.checkCircle}>
          <Text style={styles.checkMark}>✓</Text>
        </View>

        <Text style={styles.title}>Order Confirmed!</Text>
        <Text style={styles.subtitle}>
          Your order has been placed successfully and is being prepared.
        </Text>

        <View style={styles.infoBox}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Order ID:</Text>
            <Text style={styles.infoValue}>#{orderId}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Estimated Delivery:</Text>
            <Text style={styles.infoValue}>3 - 5 Business Days</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Total Paid:</Text>
            <Text style={styles.infoValue}>
              ${Number(totalAmount || 0).toFixed(2)}
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.viewOrderBtn} onPress={handleViewOrders}>
          <Text style={styles.viewOrderText}>View My Orders →</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.continueBtn}
          onPress={handleContinueShopping}
        >
          <Text style={styles.continueText}>Continue Shopping</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default OrderSuccessScreen;
