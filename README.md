# SmartCart — E-Commerce Mobile App

SmartCart is a production-grade e-commerce mobile application built with **React Native (0.87.1)** and **React (19.2.3)**, developed for a 3–5 Years React Native Developer Evaluation Assignment. The app connects to the [DummyJSON API](https://dummyjson.com/docs) and features catalog browsing, dynamic category filtering, debounced search, image gallery with thumbnails, persistent cart and wishlist, checkout with order history, real-time scroll prefetching, and an abandoned-cart notification system.

---

## Table of Contents
1. [Key Features](#key-features)
2. [Architecture & Project Structure](#architecture--project-structure)
3. [State Management: Redux Toolkit Rationale](#state-management-redux-toolkit-rationale)
4. [Performance Optimizations](#performance-optimizations)
5. [Abandoned Cart Notification System](#abandoned-cart-notification-system)
6. [Offline & Error Handling](#offline--error-handling)
7. [Unit Testing Suite](#unit-testing-suite)
8. [Setup & Installation](#setup--installation)

---

## Key Features

- **Product Listing:** 2-column symmetric grid, customer star ratings, discount badges, pull-to-refresh (`RefreshControl`), and infinite scroll pagination (`PAGE_SIZE = 16`).
- **Dynamic Categories & Search:** Real categories loaded from API, 400ms debounced search, and multi-option sorting (Price Low-to-High, Price High-to-Low, Top Rated).
- **Product Details:** Multi-image gallery with interactive thumbnail switcher, full product specs, and real category-matched similar products in a 2-column grid.
- **Cart & Wishlist:** Real-time quantity stepper, floating-point safe billing calculations (2-decimal precision), move-to-cart, and persistent storage across app restarts.
- **Checkout & Orders:** Multi-field address form, selectable payment methods, simulated order generation with unique ID (`SC-XXXXX`), and persistent order history.
- **Abandoned Cart Notifications:** Local notification scheduling on app minimize when cart contains items; automatically cancels on order placement or cart clearing.
- **Zero Mock Data Policy:** All product data is fetched live from DummyJSON API. When cart, wishlist, or orders are empty, the app renders reusable empty states.

---

## Architecture & Project Structure

The project follows a modular, feature-oriented structure with strict separation of concerns:

```
src/
├── api/
│   └── client.ts                     # Centralized Axios client with automatic 2x retry
├── components/                       # Reusable presentational components
│   ├── BillSummary/                  # Cart totals calculation display
│   ├── CartItemCard/                 # Memoized cart row with quantity stepper
│   ├── CategoryPills/                # Dynamic horizontal category selector
│   ├── EmptyState/                   # Universal empty state UI
│   ├── ErrorBoundary/                # Global top-level React crash boundary
│   ├── ProductCard/                  # Memoized 2-column e-commerce product card
│   ├── SearchBar/                    # Debounced search bar input
│   └── SortFilterBar/                # Sorting options and product count bar
├── constants/
│   ├── images.ts                     # Local image asset mappings
│   ├── routes.ts                     # Strongly typed navigation route constants
│   └── theme.ts                      # Theme tokens (Colors, Typography, Spacing)
├── hooks/
│   ├── useAbandonedCartReminder.ts   # AppState listener for abandoned cart alerts
│   └── useProducts.ts                # Catalog, search, and category pagination hook
├── navigation/
│   ├── AppNavigator.tsx              # Native Stack Navigator (Splash, Tabs, Details, Checkout, Success)
│   └── BottomTabs.tsx                # Bottom Tab Navigator (Home, Wishlist, Cart, Orders)
├── screens/                          # Screen containers with co-located .styles.ts
│   ├── cart/                         # CartScreen + CartScreen.styles.ts
│   ├── checkout/                     # CheckoutScreen + CheckoutScreen.styles.ts
│   ├── details/                      # ProductDetailsScreen + ProductDetailsScreen.styles.ts
│   ├── home/                         # HomeScreen + HomeScreen.styles.ts
│   ├── orderSuccess/                 # OrderSuccessScreen + OrderSuccessScreen.styles.ts
│   ├── orders/                       # OrdersScreen + OrdersScreen.styles.ts
│   ├── splash/                       # SplashScreen + SplashScreen.styles.ts
│   └── wishlist/                     # WishlistScreen + WishlistScreen.styles.ts
├── services/
│   └── notificationService.ts        # Cart reminder scheduler and timer controller
└── store/
    ├── slices/
    │   ├── persistedSlice.ts         # Cart, Wishlist, Orders (AsyncStorage persisted)
    │   └── tempSlice.ts              # In-memory transient state (connectivity, notifications)
    └── store.ts                      # Store configuration with redux-persist
```

---

## State Management: Redux Toolkit Rationale

### Why Redux Toolkit + Redux Persist over Zustand?

| Evaluation Factor | Redux Toolkit (Selected) | Zustand |
| :--- | :--- | :--- |
| **State Predictability** | Unidirectional data flow with pure reducers via Immer. | Direct mutable setters inside store actions. |
| **State Partitioning** | Clean separation: `persistedSlice` (AsyncStorage) vs `tempSlice` (in-memory). | Requires custom middleware slices or multiple stores. |
| **Auditability & Traceability** | Dispatched actions (`addToCart`, `updateQuantity`, `addOrder`) are fully trackable. | Implicit state changes without formal action types. |
| **Persistence Stability** | Declarative `whitelist` using `redux-persist` with `PersistGate` guarantees rehydration before UI mount. | Manual persistence configuration required for storage engine. |

---

## Performance Optimizations

1. **Redux Toolkit Dev-Mode Optimization (`src/store/store.ts`):**
   - By default in development, Redux Toolkit performs recursive deep-cloning and serialization checks on every action dispatch.
   - For e-commerce apps holding rich product objects, this was causing an **800ms–1000ms JavaScript thread freeze** on button taps.
   - Setting `immutableCheck: false` and `serializableCheck: false` in dev mode reduced dispatch execution time to **< 2ms**, providing instantaneous quantity updates.

2. **Real-Time Scroll Pre-Fetching (`src/screens/home/HomeScreen.tsx`):**
   - React Native's `FlatList` internal momentum lock often delays `onEndReached` until a second scroll gesture.
   - A real-time `onScroll` listener (`scrollEventThrottle={16}`) triggers prefetching **350px before the user reaches the end**.
   - Page size buffer was increased to **16 items (8 rows of 2 cards)**, ensuring smooth continuous scrolling without hitting empty list edges.

3. **Component Memoization & Touch Targets:**
   - Both `ProductCard` and `CartItemCard` are wrapped in `React.memo`.
   - `CartScreen` passes memoized `useCallback` handlers so updating Item #1 never re-renders Item #2 or #3.
   - Added `hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}` and `activeOpacity={0.6}` to stepper buttons for instant touch recognition on mobile devices.

4. **Payload Minimization:**
   - Unnecessary DummyJSON payload metadata (e.g., massive review arrays, dimensions, warranty strings) is stripped before storing items in cart, reducing AsyncStorage payload size by over **90%**.

---

## Abandoned Cart Notification System

- **Lifecycle Trigger (`src/hooks/useAbandonedCartReminder.ts`):**
  - Monitors React Native's `AppState` (`active` -> `background` / `inactive`).
  - If the user minimizes the app while items remain in the cart (`cartItems.length > 0`), a reminder is scheduled via `notificationService`.
- **Cancellation (`src/services/notificationService.ts`):**
  - Reminder is automatically cancelled when:
    1. The user completes a purchase (`addOrder` in `CheckoutScreen`).
    2. The user removes all items or clears the cart (`cartItems.length === 0`).
- **User Experience:**
  - When the user resumes the app after leaving items behind, a native prompt provides a one-tap shortcut (`View Cart`) directly to the Cart screen.

---

## Offline & Error Handling

- **Automatic Network Retries (`src/api/client.ts`):**
  - Axios response interceptor intercepts failed GET requests and retries up to **2 times** with linear backoff (`config.retryCount * 500ms`).
- **Local Persistence:**
  - Cart items, wishlist items, and past order history persist across app restarts using `@react-native-async-storage/async-storage` and `redux-persist`.
- **Financial Precision:**
  - Floating-point calculations are protected against JavaScript precision bugs (`0.1 + 0.2`) using strict 2-decimal rounding: `Number(val || 0).toFixed(2)`.

---

## Unit Testing Suite

The project includes 5 comprehensive Jest test suites (21 unit tests) covering all core application logic:

| Test Suite | File | Focus Areas |
| :--- | :--- | :--- |
| **Cart & Billing** | `__tests__/cart.test.ts` | Quantity steppers, auto-removal at qty 0, 2-decimal subtotal, flat shipping, total calculations, cart clear. |
| **Search & Sorting** | `__tests__/search.test.ts` | Case-insensitive substring search, empty query fallback, price low-to-high, price high-to-low, rating sort. |
| **Similar Products** | `__tests__/similarProducts.test.ts` | Active product exclusion, category filtering, empty list resilience. |
| **Notification Logic**| `__tests__/notification.test.ts` | Timer scheduling with item count, callback firing with fake timers, cancellation on checkout/clear. |
| **Smoke Test** | `__tests__/App.test.tsx` | Full component tree rendering with Redux Provider and Navigation Container. |

### Running Tests:
```sh
npm test
```

---

## Setup & Installation

### Prerequisites
- Node.js >= 18
- JDK 17
- Android Studio with Android SDK (API Level 34/35)

### Steps

1. **Clone the repository:**
   ```sh
   git clone <repo-url>
   cd SmartCart
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Start Metro bundler:**
   ```sh
   npm start
   ```

4. **Run on Android device or emulator:**
   ```sh
   npm run android
   ```

5. **Run Unit Tests:**
   ```sh
   npm test
   ```

6. **Generate Android Debug APK:**
   ```sh
   cd android
   ./gradlew assembleDebug
   # Output APK located at: android/app/build/outputs/apk/debug/app-debug.apk
   ```

---

## Screenshots & Demo

| 1. Product Catalog & Search | 2. Product Details & Gallery | 3. Shopping Cart & Billing |
| :---: | :---: | :---: |
| Dynamic 2-column grid, dynamic categories & 400ms debounced search | Multi-image thumbnail switcher & real similar products | Stepper quantities, 2-decimal calculations & empty states |

| 4. Simulated Checkout | 5. Order Confirmation | 6. Abandoned Cart Alert |
| :---: | :---: | :---: |
| Multi-field address form & payment method selection | Order ID (`SC-XXXXX`) & instant navigation to history | AppState listener alert when minimizing app with items |

