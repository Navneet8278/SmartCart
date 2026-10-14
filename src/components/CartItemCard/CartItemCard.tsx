import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { styles } from './CartItemCard.styles';

interface CartItemCardProps {
  item: any;
  onIncrement: () => void;
  onDecrement: () => void;
  onRemove: () => void;
}

export const CartItemCard = React.memo(
  ({ item, onIncrement, onDecrement, onRemove }: CartItemCardProps) => {
    return (
      <View style={styles.card}>
        {item?.thumbnail ? (
          <Image
            source={{ uri: item.thumbnail }}
            style={styles.thumbnail}
            resizeMode="contain"
          />
        ) : (
          <View style={styles.thumbnail} />
        )}
        <View style={styles.details}>
          <Text style={styles.title} numberOfLines={1}>
            {item?.title || 'Product'}
          </Text>
          <Text style={styles.price}>
            ${Number(item?.price || 0).toFixed(2)}
          </Text>

          <View style={styles.actions}>
            <View style={styles.stepper}>
              <TouchableOpacity
                style={styles.stepBtn}
                onPress={onDecrement}
                activeOpacity={0.6}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={styles.stepBtnText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.quantity}>{item?.quantity ?? 1}</Text>
              <TouchableOpacity
                style={styles.stepBtn}
                onPress={onIncrement}
                activeOpacity={0.6}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={styles.stepBtnText}>+</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.removeBtn}
              onPress={onRemove}
              activeOpacity={0.6}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.removeText}>Remove</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  },
);

export default CartItemCard;
