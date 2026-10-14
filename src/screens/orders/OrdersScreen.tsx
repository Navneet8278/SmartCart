import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';

import { styles } from './OrdersScreen.styles';
import { EmptyState } from '../../components/EmptyState/EmptyState';
import { AppRoutes } from '../../constants/routes';

export const OrdersScreen = ({ navigation }: any) => {
  const { orders } = useSelector((state: any) => state.persisted);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          Order History ({orders?.length || 0})
        </Text>
      </View>

      {(orders?.length || 0) === 0 ? (
        <EmptyState
          icon="📦"
          title="No Orders Yet"
          subtitle="You haven't placed any orders yet. Shop from our catalog and your completed orders will appear here!"
          buttonText="Start Shopping"
          onButtonPress={() => navigation.navigate(AppRoutes.HomeTab)}
        />
      ) : (
        <FlatList
          data={orders || []}
          keyExtractor={(item, index) =>
            item?.id ? String(item.id) : String(index)
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View>
                  <Text style={styles.orderId}>
                    Order #{item?.id || 'SC-00000'}
                  </Text>
                  <Text style={styles.date}>{item?.date || ''}</Text>
                </View>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>
                    {item?.status || 'Confirmed'}
                  </Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.cardFooter}>
                <Text style={styles.itemCount}>
                  {item?.items?.length || 1} items purchased
                </Text>
                <Text style={styles.total}>
                  Total: ${Number(item?.totalAmount || 0).toFixed(2)}
                </Text>
              </View>
            </View>
          )}
          contentContainerStyle={styles.list}
        />
      )}
    </SafeAreaView>
  );
};

export default OrdersScreen;
