import React from 'react';
import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import BottomTabs from './BottomTabs';
import { COLORS } from '../constants/theme';
import { AppRoutes } from '../constants/routes';
import SplashScreen from '../screens/splash/SplashScreen';
import ProductDetailsScreen from '../screens/details/ProductDetailsScreen';
import CheckoutScreen from '../screens/checkout/CheckoutScreen';
import OrderSuccessScreen from '../screens/orderSuccess/OrderSuccessScreen';
import { useAbandonedCartReminder } from '../hooks/useAbandonedCartReminder';

const Stack = createNativeStackNavigator();

export const AppNavigator = () => {
  const navigationRef = useNavigationContainerRef();
  useAbandonedCartReminder(navigationRef);

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        initialRouteName={AppRoutes.Splash}
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: COLORS.background },
        }}
      >
        <Stack.Screen name={AppRoutes.Splash} component={SplashScreen} />
        <Stack.Screen name={AppRoutes.MainTabs} component={BottomTabs} />
        <Stack.Screen
          name={AppRoutes.ProductDetails}
          component={ProductDetailsScreen}
          options={{
            headerShown: true,
            title: 'Product Details',
            headerTintColor: COLORS.textPrimary,
            headerStyle: { backgroundColor: COLORS.surface },
            headerShadowVisible: false,
          }}
        />
        <Stack.Screen
          name={AppRoutes.Checkout}
          component={CheckoutScreen}
          options={{
            headerShown: true,
            title: 'Checkout',
            headerTintColor: COLORS.textPrimary,
            headerStyle: { backgroundColor: COLORS.surface },
            headerShadowVisible: false,
          }}
        />
        <Stack.Screen
          name={AppRoutes.OrderSuccess}
          component={OrderSuccessScreen}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
