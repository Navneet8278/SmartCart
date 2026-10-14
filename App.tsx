// App.tsx
import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './src/store/store';
import { AppNavigator } from './src/navigation/AppNavigator';
import { ErrorBoundary } from './src/components/ErrorBoundary/ErrorBoundary';

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaProvider>
          <StatusBar barStyle="dark-content" />
          <ErrorBoundary>
            <AppNavigator />
          </ErrorBoundary>
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
