import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';

import { styles } from './CheckoutScreen.styles';
import { addOrder } from '../../store/slices/persistedSlice';
import { clearNotification } from '../../store/slices/tempSlice';
import { notificationService } from '../../services/notificationService';
import { COLORS, SPACING } from '../../constants/theme';
import { AppRoutes } from '../../constants/routes';

const PAYMENT_METHODS = [
  'Cash on Delivery',
  'Credit / Debit Card',
  'UPI / Net Banking',
];

export const CheckoutScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const { cartItems, total } = useSelector((state: any) => state.persisted);

  const [fullName, setFullName] = useState('Navneet Sharma');
  const [address, setAddress] = useState('Flat 204, Green Avenue');
  const [city, setCity] = useState('New Delhi - 110001');
  const [selectedPayment, setSelectedPayment] = useState('Cash on Delivery');

  const handlePlaceOrder = () => {
    if ((cartItems?.length || 0) === 0) {
      Alert.alert('Empty Cart', 'Your cart is empty.');
      return;
    }

    const orderId = `SC-${Math.floor(10000 + Math.random() * 90000)}`;

    const newOrder = {
      id: orderId,
      date: new Date().toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      itemCount: cartItems?.length || 0,
      items: cartItems || [],
      totalAmount: total ?? 0,
      status: 'Confirmed',
      shippingAddress: {
        fullName: fullName || 'Valued Customer',
        street: address || 'Default Address',
        city: city || 'City',
      },
    };

    // Save order & clear cart in Redux + Storage
    dispatch(addOrder(newOrder));
    notificationService?.cancelReminder?.();
    dispatch(clearNotification());

    // Navigate to Order Confirmation
    navigation.navigate(AppRoutes.OrderSuccess, {
      orderId,
      totalAmount: total ?? 0,
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Shipping Address</Text>
        <View style={styles.card}>
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            placeholderTextColor={COLORS.textLight}
            value={fullName}
            onChangeText={setFullName}
          />
          <TextInput
            style={styles.input}
            placeholder="Street Address"
            placeholderTextColor={COLORS.textLight}
            value={address}
            onChangeText={setAddress}
          />
          <TextInput
            style={styles.input}
            placeholder="City & Postal Code"
            placeholderTextColor={COLORS.textLight}
            value={city}
            onChangeText={setCity}
          />
        </View>

        <Text style={styles.sectionTitle}>Payment Method</Text>
        <View style={styles.card}>
          {PAYMENT_METHODS.map(method => {
            const isSelected = selectedPayment === method;
            return (
              <TouchableOpacity
                key={method}
                style={[
                  styles.paymentOption,
                  isSelected && styles.activePayment,
                ]}
                onPress={() => setSelectedPayment(method)}
              >
                <View
                  style={[styles.radioCircle, isSelected && styles.activeRadio]}
                />
                <Text style={styles.paymentText}>{method}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View
        style={[
          styles.bottomBar,
          { paddingBottom: Math.max(insets.bottom, SPACING.md) },
        ]}
      >
        <TouchableOpacity
          style={styles.placeOrderBtn}
          onPress={handlePlaceOrder}
        >
          <Text style={styles.placeOrderText}>
            Confirm & Place Order (${Number(total || 0).toFixed(2)})
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CheckoutScreen;
