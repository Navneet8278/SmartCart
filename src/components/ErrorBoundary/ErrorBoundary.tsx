import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { styles } from './ErrorBoundary.styles';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      errorMessage: '',
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      errorMessage: error?.message || 'An unexpected error occurred.',
    };
  }

  componentDidCatch(_error: Error, _errorInfo: ErrorInfo) {
    // Errors are gracefully caught to prevent application crashes
  }

  handleRestart = () => {
    this.setState({
      hasError: false,
      errorMessage: '',
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <SafeAreaView style={styles.container}>
          <View style={styles.card}>
            <View style={styles.iconBox}>
              <Text style={styles.iconText}>⚠️</Text>
            </View>
            <Text style={styles.title}>Something went wrong</Text>
            <Text style={styles.subtitle}>
              An unexpected error occurred, but your cart and saved data remain safe.
            </Text>
            <TouchableOpacity
              style={styles.retryButton}
              activeOpacity={0.8}
              onPress={this.handleRestart}
            >
              <Text style={styles.retryButtonText}>Reload App</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
