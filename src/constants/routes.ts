export const AppRoutes = {
  Splash: 'Splash',
  MainTabs: 'MainTabs',
  HomeTab: 'HomeTab',
  WishlistTab: 'WishlistTab',
  CartTab: 'CartTab',
  OrdersTab: 'OrdersTab',
  ProductDetails: 'ProductDetails',
  Checkout: 'Checkout',
  OrderSuccess: 'OrderSuccess',
} as const;

export type AppRouteType = (typeof AppRoutes)[keyof typeof AppRoutes];

// Alias for convenience
export const APP_ROUTES = AppRoutes;
