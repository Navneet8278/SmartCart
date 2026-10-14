import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cartItems: [] as any[],
  wishlistItems: [] as any[],
  orders: [] as any[],
  subtotal: 0,
  shipping: 0,
  total: 0,
};

// Calculate bill totals rounded to 2 decimal places
const calculateTotals = (items: any[]) => {
  const safeItems = Array.isArray(items) ? items : [];
  const rawSubtotal = safeItems.reduce(
    (acc, it) => acc + (Number(it?.price) || 0) * (Number(it?.quantity) || 1),
    0,
  );
  const subtotal = Number(rawSubtotal.toFixed(2));
  const shipping = subtotal > 0 ? 15 : 0;
  const total = Number((subtotal + shipping).toFixed(2));
  return { subtotal, shipping, total };
};

const updateBill = (state: any) => {
  const { subtotal, shipping, total } = calculateTotals(state?.cartItems);
  state.subtotal = subtotal;
  state.shipping = shipping;
  state.total = total;
};

export const persistedSlice = createSlice({
  name: 'persisted',
  initialState,
  reducers: {
    // Cart actions
    addToCart: (state, action) => {
      const p = action?.payload;
      if (!p || p.id === undefined) return;
      if (!Array.isArray(state.cartItems)) {
        state.cartItems = [];
      }
      const item = state.cartItems.find(it => it?.id === p.id);
      if (item) {
        item.quantity = (item.quantity || 1) + 1;
      } else {
        state.cartItems.push({
          id: p.id,
          title: p.title || 'Product',
          price: Number(p.price || 0),
          thumbnail: p.thumbnail || '',
          quantity: 1,
          category: p.category || '',
          stock: p.stock ?? 10,
          discountPercentage: p.discountPercentage ?? 0,
        });
      }
      updateBill(state);
    },

    removeFromCart: (state, action) => {
      if (!Array.isArray(state.cartItems)) {
        state.cartItems = [];
      }
      state.cartItems = state.cartItems.filter(it => it?.id !== action.payload);
      updateBill(state);
    },

    updateQuantity: (state, action) => {
      const { id, delta } = action?.payload || {};
      if (!Array.isArray(state.cartItems)) {
        state.cartItems = [];
      }
      const item = state.cartItems.find(it => it?.id === id);
      if (item) {
        item.quantity = (item.quantity || 1) + (delta || 0);
        if (item.quantity <= 0) {
          state.cartItems = state.cartItems.filter(it => it?.id !== id);
        }
      }
      updateBill(state);
    },

    clearCart: state => {
      state.cartItems = [];
      state.subtotal = 0;
      state.shipping = 0;
      state.total = 0;
    },

    // Wishlist actions
    toggleWishlist: (state, action) => {
      const p = action?.payload;
      if (!p || p.id === undefined) return;
      if (!Array.isArray(state.wishlistItems)) {
        state.wishlistItems = [];
      }
      const index = state.wishlistItems.findIndex(
        it => it?.id === p.id,
      );
      if (index > -1) {
        state.wishlistItems.splice(index, 1);
      } else {
        state.wishlistItems.push(p);
      }
    },

    // Orders actions
    addOrder: (state, action) => {
      if (!action?.payload) return;
      if (!Array.isArray(state.orders)) {
        state.orders = [];
      }
      state.orders.unshift(action.payload);
      // Automatically clear active cart upon order placement
      state.cartItems = [];
      state.subtotal = 0;
      state.shipping = 0;
      state.total = 0;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  toggleWishlist,
  addOrder,
} = persistedSlice.actions;

export default persistedSlice.reducer;
