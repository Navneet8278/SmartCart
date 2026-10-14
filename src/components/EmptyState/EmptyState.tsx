import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from './EmptyState.styles';

interface EmptyStateProps {
  icon?: string;
  title: string;
  subtitle: string;
  buttonText?: string;
  onButtonPress?: () => void;
}

export const EmptyState = ({
  icon = '🛍️',
  title,
  subtitle,
  buttonText = 'Explore Products',
  onButtonPress,
}: EmptyStateProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconBox}>
        <Text style={styles.iconText}>{icon}</Text>
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
      {buttonText && onButtonPress ? (
        <TouchableOpacity style={styles.btn} onPress={onButtonPress}>
          <Text style={styles.btnText}>{buttonText}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

export default EmptyState;
