import React from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
} from 'react-native';
import { styles } from './CategoryPills.styles';

interface CategoryPillsProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export const CategoryPills = ({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryPillsProps) => {
  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
      >
        {(categories || []).map(cat => {
          const isActive = selectedCategory === cat;
          return (
            <TouchableOpacity
              key={cat || Math.random().toString()}
              style={[styles.chip, isActive && styles.activeChip]}
              onPress={() => onSelectCategory(cat)}
            >
              <Text style={[styles.text, isActive && styles.activeText]}>
                {cat}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default CategoryPills;
