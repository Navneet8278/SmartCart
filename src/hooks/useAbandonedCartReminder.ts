import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { notificationService } from '../services/notificationService';
import {
  setNotificationScheduled,
  setNotificationMessage,
  clearNotification,
} from '../store/slices/tempSlice';
import { AppRoutes } from '../constants/routes';

export const useAbandonedCartReminder = (navigationRef?: any) => {
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state: any) => state.persisted);
  const { notificationScheduled } = useSelector((state: any) => state.temp);

  const cartLength = cartItems?.length || 0;
  const cartLengthRef = useRef(cartLength);
  cartLengthRef.current = cartLength;

  const triggeredRef = useRef(false);

  useEffect(() => {
    // Automatically cancel reminder when cart becomes empty
    if ((cartItems?.length || 0) === 0 && notificationScheduled) {
      notificationService?.cancelReminder?.();
      dispatch(clearNotification());
      triggeredRef.current = false;
    }
  }, [cartItems?.length, notificationScheduled, dispatch]);

  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      // 1. App goes to background or becomes inactive
      if (nextAppState === 'background' || nextAppState === 'inactive') {
        if (cartLengthRef.current > 0) {
          const msg = `You left ${cartLengthRef.current} item(s) in your cart! Complete your purchase before items sell out.`;
          dispatch(setNotificationScheduled(true));
          dispatch(setNotificationMessage(msg));

          notificationService.scheduleReminder(cartLengthRef.current, 6000, () => {
            triggeredRef.current = true;
          });
        }
      }

      // 2. User returns to the active app
      if (nextAppState === 'active') {
        if (triggeredRef.current && cartLengthRef.current > 0) {
          triggeredRef.current = false;
          dispatch(clearNotification());

          Alert.alert(
            '🛒 Cart Reminder',
            `You still have ${cartLengthRef.current} item(s) in your cart. Would you like to complete your order now?`,
            [
              { text: 'Later', style: 'cancel' },
              {
                text: 'View Cart',
                onPress: () => {
                  if (navigationRef?.current) {
                    navigationRef.current.navigate(AppRoutes.MainTabs, {
                      screen: AppRoutes.CartTab,
                    });
                  }
                },
              },
            ],
          );
        }
      }
    };

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => {
      subscription?.remove?.();
    };
  }, [dispatch, navigationRef]);
};

export default useAbandonedCartReminder;
