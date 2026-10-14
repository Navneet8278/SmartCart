import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';

import { styles } from './WishlistScreen.styles';
import { EmptyState } from '../../components/EmptyState/EmptyState';
import { addToCart, toggleWishlist } from '../../store/slices/persistedSlice';
import { AppRoutes } from '../../constants/routes';

export const WishlistScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const { wishlistItems } = useSelector((state: any) => state.persisted);

  const handleMoveToCart = (item: any) => {
    if (!item) return;
    dispatch(addToCart(item));
    dispatch(toggleWishlist(item)); // Remove from wishlist after moving to cart
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          My Wishlist ({wishlistItems?.length || 0})
        </Text>
      </View>

      {(wishlistItems?.length || 0) === 0 ? (
        <EmptyState
          icon="🤍"
          title="Your Wishlist is Empty"
          subtitle="You haven't saved any items yet. Tap the heart icon on any product to save it here!"
          buttonText="Explore Products"
          onButtonPress={() => navigation.navigate(AppRoutes.HomeTab)}
        />
      ) : (
        <FlatList
          data={wishlistItems || []}
          keyExtractor={(item, index) =>
            item?.id ? item.id.toString() : String(index)
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
              {item?.thumbnail ? (
                <Image
                  source={{ uri: item.thumbnail }}
                  style={styles.image}
                  resizeMode="contain"
                />
              ) : (
                <View style={styles.image} />
              )}
              <View style={styles.details}>
                <Text style={styles.title} numberOfLines={1}>
                  {item?.title || 'Product'}
                </Text>
                <Text style={styles.price}>
                  ${Number(item?.price || 0).toFixed(2)}
                </Text>

                <View style={styles.actionRow}>
                  <TouchableOpacity
                    style={styles.moveBtn}
                    onPress={() => handleMoveToCart(item)}
                  >
                    <Text style={styles.moveBtnText}>Move to Cart</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={() => item && dispatch(toggleWishlist(item))}
                  >
                    <Text style={styles.deleteText}>Remove</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
          contentContainerStyle={styles.list}
        />
      )}
    </SafeAreaView>
  );
};

export default WishlistScreen;
