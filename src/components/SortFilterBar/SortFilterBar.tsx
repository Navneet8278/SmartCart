import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, Pressable } from 'react-native';
import { styles } from './SortFilterBar.styles';

export type SortType =
  | 'default'
  | 'price-low-high'
  | 'price-high-low'
  | 'rating-high-low';

interface SortOption {
  key: SortType;
  label: string;
}

const SORT_OPTIONS: SortOption[] = [
  { key: 'default', label: 'Featured (Default)' },
  { key: 'price-low-high', label: 'Price: Low to High' },
  { key: 'price-high-low', label: 'Price: High to Low' },
  { key: 'rating-high-low', label: 'Customer Rating' },
];

interface SortFilterBarProps {
  itemCount: number;
  selectedSort: SortType;
  onSelectSort: (sort: SortType) => void;
}

export const SortFilterBar = ({
  itemCount,
  selectedSort,
  onSelectSort,
}: SortFilterBarProps) => {
  const [modalVisible, setModalVisible] = useState(false);

  const activeLabel =
    SORT_OPTIONS.find(opt => opt.key === selectedSort)?.label || 'Sort';

  const handleSelect = (sort: SortType) => {
    onSelectSort(sort);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.resultsCount}>Showing {itemCount} items</Text>

      <TouchableOpacity
        style={styles.sortBtn}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.sortIcon}>⇅</Text>
        <Text style={styles.sortLabel}>{activeLabel}</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}
        >
          <Pressable style={styles.modalContent} onPress={e => e.stopPropagation()}>
            <Text style={styles.modalTitle}>Sort Products By</Text>

            {SORT_OPTIONS.map(option => {
              const isSelected = selectedSort === option.key;
              return (
                <TouchableOpacity
                  key={option.key}
                  style={styles.optionRow}
                  onPress={() => handleSelect(option.key)}
                >
                  <View
                    style={[
                      styles.radioOuter,
                      isSelected && styles.radioSelected,
                    ]}
                  >
                    {isSelected ? <View style={styles.radioInner} /> : null}
                  </View>
                  <Text
                    style={[
                      styles.optionLabel,
                      isSelected && styles.activeOptionLabel,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              );
            })}

            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeBtnText}>Done</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

export default SortFilterBar;
