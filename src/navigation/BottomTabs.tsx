import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeScreen from '../screens/home/HomeScreen';
import WishlistScreen from '../screens/wishlist/WishlistScreen';
import CartScreen from '../screens/cart/CartScreen';
import OrdersScreen from '../screens/orders/OrdersScreen';
import { COLORS, FONT_SIZE } from '../constants/theme';
import { IMAGES } from '../constants/images';
import { AppRoutes } from '../constants/routes';

const Tab = createBottomTabNavigator();

export const BottomTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.textPrimary,
        tabBarInactiveTintColor: COLORS.textLight,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tab.Screen
        name={AppRoutes.HomeTab}
        component={HomeScreen}
        options={{
          tabBarLabel: 'Shop',
          tabBarIcon: ({ color }) => (
            <Image
              source={IMAGES.shop}
              style={[styles.tabIcon, { tintColor: color }]}
              resizeMode="contain"
            />
          ),
        }}
      />
      <Tab.Screen
        name={AppRoutes.WishlistTab}
        component={WishlistScreen}
        options={{
          tabBarLabel: 'Wishlist',
          tabBarIcon: ({ color }) => (
            <Image
              source={IMAGES.wishlist}
              style={[styles.tabIcon, { tintColor: color }]}
              resizeMode="contain"
            />
          ),
        }}
      />
      <Tab.Screen
        name={AppRoutes.CartTab}
        component={CartScreen}
        options={{
          tabBarLabel: 'Cart',
          tabBarIcon: ({ color }) => (
            <Image
              source={IMAGES.cart}
              style={[styles.tabIcon, { tintColor: color }]}
              resizeMode="contain"
            />
          ),
        }}
      />
      <Tab.Screen
        name={AppRoutes.OrdersTab}
        component={OrdersScreen}
        options={{
          tabBarLabel: 'Orders',
          tabBarIcon: ({ color }) => (
            <Image
              source={IMAGES.order}
              style={[styles.tabIcon, { tintColor: color }]}
              resizeMode="contain"
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabs;

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: COLORS.surface,
    borderTopColor: COLORS.border,
    height: 60,
    paddingBottom: 8,
    paddingTop: 6,
  },
  tabLabel: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '600',
  },
  tabIcon: {
    width: 22,
    height: 22,
  },
});
