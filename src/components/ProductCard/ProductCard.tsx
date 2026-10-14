import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { styles } from './ProductCard.styles';

interface ProductCardProps {
  item: any;
  onPress: () => void;
  onAddToCart?: () => void;
}

export const ProductCard = React.memo(
  ({ item, onPress, onAddToCart }: ProductCardProps) => {
    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.8}
        onPress={onPress}
      >
        <View style={styles.imageContainer}>
          {item?.thumbnail ? (
            <Image
              source={{ uri: item.thumbnail }}
              style={styles.productImage}
              resizeMode="contain"
            />
          ) : null}
          {item?.discountPercentage ? (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>
                {Math.round(item.discountPercentage)}% OFF
              </Text>
            </View>
          ) : null}
        </View>

        <View style={styles.cardInfo}>
          <Text style={styles.categoryBadge}>{item?.category || 'General'}</Text>
          <Text style={styles.productTitle} numberOfLines={1}>
            {item?.title || 'Product'}
          </Text>

          <View style={styles.ratingRow}>
            <Text style={styles.star}>★</Text>
            <Text style={styles.ratingText}>{item?.rating ?? 0}</Text>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.price}>
              ${Number(item?.price || 0).toFixed(2)}
            </Text>
            <TouchableOpacity style={styles.addBtn} onPress={onAddToCart}>
              <Text style={styles.addBtnText}>+ Add</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  },
);

export default ProductCard;
