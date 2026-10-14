import React from 'react';
import { View, TextInput, Image } from 'react-native';
import { styles } from './SearchBar.styles';
import { COLORS } from '../../constants/theme';
import { IMAGES } from '../../constants/images';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export const SearchBar = ({
  value,
  onChangeText,
  placeholder,
}: SearchBarProps) => {
  return (
    <View style={styles.wrapper}>
      <View style={styles.bar}>
        <Image
          source={IMAGES.search}
          style={styles.icon}
          resizeMode="contain"
        />
        <TextInput
          style={styles.input}
          placeholder={placeholder || 'Search products, brands...'}
          placeholderTextColor={COLORS.textLight}
          value={value}
          onChangeText={onChangeText}
        />
      </View>
    </View>
  );
};

export default SearchBar;
