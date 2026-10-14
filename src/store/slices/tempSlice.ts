// Transient in-memory state slice (not persisted to storage)
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isOffline: false,
  notificationScheduled: false,
  lastNotificationMessage: null as string | null,
};

export const tempSlice = createSlice({
  name: 'temp',
  initialState,
  reducers: {
    setOfflineStatus: (state, action) => {
      state.isOffline = action.payload;
    },
    setNotificationScheduled: (state, action) => {
      state.notificationScheduled = action.payload;
    },
    setNotificationMessage: (state, action) => {
      state.lastNotificationMessage = action.payload;
    },
    clearNotification: state => {
      state.notificationScheduled = false;
      state.lastNotificationMessage = null;
    },
  },
});

export const {
  setOfflineStatus,
  setNotificationScheduled,
  setNotificationMessage,
  clearNotification,
} = tempSlice.actions;

export default tempSlice.reducer;
