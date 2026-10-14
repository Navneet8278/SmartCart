import persistedReducer, {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
} from '../src/store/slices/persistedSlice';

describe('Cart Calculations & State Reducer', () => {
  const initialTestState = {
    cartItems: [],
    wishlistItems: [],
    orders: [],
    subtotal: 0,
    shipping: 0,
    total: 0,
  };

  const sampleProduct1 = {
    id: 1,
    title: 'Wireless Earbuds',
    price: 49.99,
    thumbnail: 'https://example.com/item1.jpg',
    category: 'electronics',
    stock: 25,
    discountPercentage: 10,
  };

  const sampleProduct2 = {
    id: 2,
    title: 'Smart Watch',
    price: 199.5,
    thumbnail: 'https://example.com/item2.jpg',
    category: 'electronics',
    stock: 12,
    discountPercentage: 5,
  };

  it('adds a new product to empty cart and calculates bill correctly', () => {
    const state = persistedReducer(initialTestState, addToCart(sampleProduct1));

    expect(state.cartItems.length).toBe(1);
    expect(state.cartItems[0].quantity).toBe(1);
    expect(state.subtotal).toBe(49.99);
    expect(state.shipping).toBe(15);
    expect(state.total).toBe(64.99);
  });

  it('increments quantity and updates subtotal when adding existing product', () => {
    let state = persistedReducer(initialTestState, addToCart(sampleProduct1));
    state = persistedReducer(state, addToCart(sampleProduct1));

    expect(state.cartItems.length).toBe(1);
    expect(state.cartItems[0].quantity).toBe(2);
    expect(state.subtotal).toBe(99.98);
    expect(state.total).toBe(114.98);
  });

  it('handles multiple distinct products with accurate 2-decimal precision', () => {
    let state = persistedReducer(initialTestState, addToCart(sampleProduct1));
    state = persistedReducer(state, addToCart(sampleProduct2));

    expect(state.cartItems.length).toBe(2);
    // 49.99 + 199.50 = 249.49
    expect(state.subtotal).toBe(249.49);
    expect(state.shipping).toBe(15);
    expect(state.total).toBe(264.49);
  });

  it('decrements item quantity via updateQuantity', () => {
    let state = persistedReducer(initialTestState, addToCart(sampleProduct1));
    state = persistedReducer(state, addToCart(sampleProduct1)); // qty: 2
    state = persistedReducer(state, updateQuantity({ id: 1, delta: -1 })); // qty: 1

    expect(state.cartItems[0].quantity).toBe(1);
    expect(state.subtotal).toBe(49.99);
  });

  it('removes item from cart when quantity reaches 0', () => {
    let state = persistedReducer(initialTestState, addToCart(sampleProduct1));
    state = persistedReducer(state, updateQuantity({ id: 1, delta: -1 }));

    expect(state.cartItems.length).toBe(0);
    expect(state.subtotal).toBe(0);
    expect(state.shipping).toBe(0);
    expect(state.total).toBe(0);
  });

  it('removes item directly via removeFromCart action', () => {
    let state = persistedReducer(initialTestState, addToCart(sampleProduct1));
    state = persistedReducer(state, addToCart(sampleProduct2));
    state = persistedReducer(state, removeFromCart(1));

    expect(state.cartItems.length).toBe(1);
    expect(state.cartItems[0].id).toBe(2);
    expect(state.subtotal).toBe(199.5);
    expect(state.total).toBe(214.5);
  });

  it('clears all items and resets totals via clearCart', () => {
    let state = persistedReducer(initialTestState, addToCart(sampleProduct1));
    state = persistedReducer(state, clearCart());

    expect(state.cartItems).toEqual([]);
    expect(state.subtotal).toBe(0);
    expect(state.shipping).toBe(0);
    expect(state.total).toBe(0);
  });
});
