import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';

import { styles } from './ProductDetailsScreen.styles';
import { ProductCard } from '../../components/ProductCard/ProductCard';
import { addToCart, toggleWishlist } from '../../store/slices/persistedSlice';
import { apiClient } from '../../api/client';
import { SPACING, COLORS } from '../../constants/theme';
import { AppRoutes } from '../../constants/routes';

export const ProductDetailsScreen = ({ route, navigation }: any) => {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const { wishlistItems } = useSelector((state: any) => state.persisted);

  const product = route?.params?.product;

  const imagesList =
    product?.images && product.images.length > 0
      ? product.images
      : product?.thumbnail
      ? [product.thumbnail]
      : [];

  const [activeImage, setActiveImage] = useState(
    imagesList[0] || product?.thumbnail,
  );
  const [similarProducts, setSimilarProducts] = useState<any[]>([]);
  const [loadingSimilar, setLoadingSimilar] = useState(false);

  const isWishlisted = (wishlistItems || []).some(
    (item: any) => item?.id === product?.id,
  );

  // Reset active image when product changes
  useEffect(() => {
    setActiveImage(imagesList[0] || product?.thumbnail);
  }, [product?.id]);

  // Fetch real similar products from the same category
  useEffect(() => {
    if (product?.category) {
      setLoadingSimilar(true);
      apiClient
        .get(
          `/products/category/${encodeURIComponent(product.category)}?limit=6`,
        )
        .then(res => {
          const filtered = (res?.data?.products || []).filter(
            (p: any) => p?.id !== product?.id,
          );
          setSimilarProducts(filtered);
        })
        .catch(() => {})
        .finally(() => setLoadingSimilar(false));
    }
  }, [product?.id, product?.category]);

  if (!product) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: COLORS.textSecondary }}>
          No product details found.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: 110 + insets.bottom },
        ]}
      >
        {/* Image Gallery */}
        <View style={styles.galleryContainer}>
          <TouchableOpacity
            style={styles.wishlistBtn}
            onPress={() => dispatch(toggleWishlist(product))}
          >
            <Text style={styles.wishlistIcon}>
              {isWishlisted ? '❤️' : '🤍'}
            </Text>
          </TouchableOpacity>

          <View style={styles.imageBox}>
            {activeImage ? (
              <Image
                source={{ uri: activeImage }}
                style={styles.mainImage}
                resizeMode="contain"
              />
            ) : (
              <View style={styles.mainImage} />
            )}
          </View>

          {imagesList?.length > 1 ? (
            <View style={styles.thumbnailStrip}>
              {imagesList.map((imgUri: string, index: number) => {
                const isActive = activeImage === imgUri;
                return (
                  <TouchableOpacity
                    key={`${imgUri}-${index}`}
                    style={[styles.thumbItem, isActive && styles.thumbActive]}
                    onPress={() => setActiveImage(imgUri)}
                  >
                    <Image
                      source={{ uri: imgUri }}
                      style={styles.thumbImage}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : null}
        </View>

        {/* Info */}
        <View style={styles.infoSection}>
          <Text style={styles.category}>{product?.category || ''}</Text>
          <Text style={styles.title}>{product?.title || 'Product Details'}</Text>

          <View style={styles.ratingBadge}>
            <Text style={styles.star}>★ {product?.rating ?? '4.5'}</Text>
            {product?.stock ? (
              <Text
                style={{ fontSize: 12, color: COLORS.success, marginLeft: 8 }}
              >
                • In Stock ({product.stock})
              </Text>
            ) : null}
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.price}>
              ${Number(product?.price || 0).toFixed(2)}
            </Text>
            {product?.discountPercentage ? (
              <View style={styles.discountChip}>
                <Text style={styles.discountText}>
                  {Math.round(product.discountPercentage)}% OFF
                </Text>
              </View>
            ) : null}
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionHeader}>Description</Text>
          <Text style={styles.description}>
            {product?.description || 'No description available for this item.'}
          </Text>
        </View>

        {/* Real Similar Products Section */}
        {(similarProducts?.length || 0) > 0 ? (
          <View style={styles.similarSection}>
            <Text style={styles.similarHeader}>Similar Products</Text>
            <FlatList
              data={similarProducts || []}
              keyExtractor={item => item?.id ? item.id.toString() : Math.random().toString()}
              numColumns={2}
              scrollEnabled={false}
              contentContainerStyle={styles.similarList}
              columnWrapperStyle={styles.rowWrapper}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <ProductCard
                  item={item}
                  onPress={() =>
                    navigation.push(AppRoutes.ProductDetails, {
                      product: item,
                    })
                  }
                  onAddToCart={() => dispatch(addToCart(item))}
                />
              )}
            />
          </View>
        ) : loadingSimilar ? (
          <View style={{ padding: 20 }}>
            <ActivityIndicator size="small" color={COLORS.primary} />
          </View>
        ) : null}
      </ScrollView>

      {/* Sticky Bottom Bar */}
      <View
        style={[
          styles.bottomBar,
          { paddingBottom: Math.max(insets.bottom, SPACING.md) },
        ]}
      >
        <View>
          <Text style={styles.bottomPriceLabel}>Price</Text>
          <Text style={styles.bottomPrice}>
            ${Number(product.price || 0).toFixed(2)}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.addToCartBtn}
          onPress={() => {
            dispatch(addToCart(product));
            navigation.navigate(AppRoutes.MainTabs, {
              screen: AppRoutes.CartTab,
            });
          }}
        >
          <Text style={styles.addToCartText}>Add to Cart 🛒</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProductDetailsScreen;
