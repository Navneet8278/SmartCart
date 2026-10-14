import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

import persistedReducer from './slices/persistedSlice';
import tempReducer from './slices/tempSlice';

// Redux Persist configuration
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['persisted'], // Persist only persistedSlice to AsyncStorage
};

const rootReducer = combineReducers({
  persisted: persistedReducer,
  temp: tempReducer,
});

const persistedRootReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedRootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      // Disabled in dev mode to eliminate deep object clone overhead and ensure instant UI updates
      immutableCheck: false,
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export default store;
