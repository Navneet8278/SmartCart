export const IMAGES = {
  shop: require('../assets/images/shop.png'),
  wishlist: require('../assets/images/wishlist.png'),
  cart: require('../assets/images/cart.png'),
  order: require('../assets/images/order.png'),
  search: require('../assets/images/search.png'),
} as const;

export type ImageKey = keyof typeof IMAGES;
