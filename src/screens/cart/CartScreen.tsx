import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';

import { styles } from './CartScreen.styles';
import { CartItemCard } from '../../components/CartItemCard/CartItemCard';
import { BillSummary } from '../../components/BillSummary/BillSummary';
import { EmptyState } from '../../components/EmptyState/EmptyState';
import {
  removeFromCart,
  updateQuantity,
} from '../../store/slices/persistedSlice';
import { AppRoutes } from '../../constants/routes';

export const CartScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const { cartItems, subtotal, shipping, total } = useSelector(
    (state: any) => state.persisted,
  );

  const handleIncrement = React.useCallback(
    (id: number) => {
      dispatch(updateQuantity({ id, delta: 1 }));
    },
    [dispatch],
  );

  const handleDecrement = React.useCallback(
    (id: number) => {
      dispatch(updateQuantity({ id, delta: -1 }));
    },
    [dispatch],
  );

  const handleRemove = React.useCallback(
    (id: number) => {
      dispatch(removeFromCart(id));
    },
    [dispatch],
  );

  const renderCartItem = React.useCallback(
    ({ item }: any) => (
      <CartItemCard
        item={item}
        onIncrement={() => item?.id && handleIncrement(item.id)}
        onDecrement={() => item?.id && handleDecrement(item.id)}
        onRemove={() => item?.id && handleRemove(item.id)}
      />
    ),
    [handleIncrement, handleDecrement, handleRemove],
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          Shopping Cart ({cartItems?.length || 0})
        </Text>
      </View>

      {(cartItems?.length || 0) === 0 ? (
        <EmptyState
          icon="🛒"
          title="Your Cart is Empty"
          subtitle="You haven't added any products to your cart yet. Explore our collection and add your favorite items!"
          buttonText="Start Shopping"
          onButtonPress={() => navigation.navigate(AppRoutes.HomeTab)}
        />
      ) : (
        <>
          <FlatList
            data={cartItems || []}
            keyExtractor={(item, index) =>
              item?.id ? item.id.toString() : String(index)
            }
            renderItem={renderCartItem}
            contentContainerStyle={styles.list}
          />

          <BillSummary
            subtotal={subtotal ?? 0}
            shipping={shipping ?? 0}
            total={total ?? 0}
            onCheckout={() => navigation.navigate(AppRoutes.Checkout)}
          />
        </>
      )}
    </SafeAreaView>
  );
};

export default CartScreen;
