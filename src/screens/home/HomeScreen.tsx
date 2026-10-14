import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  RefreshControl,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';

import { styles } from './HomeScreen.styles';
import { SearchBar } from '../../components/SearchBar/SearchBar';
import { CategoryPills } from '../../components/CategoryPills/CategoryPills';
import { ProductCard } from '../../components/ProductCard/ProductCard';
import {
  SortFilterBar,
  SortType,
} from '../../components/SortFilterBar/SortFilterBar';
import { useProducts } from '../../hooks/useProducts';
import { addToCart } from '../../store/slices/persistedSlice';
import { IMAGES } from '../../constants/images';
import { AppRoutes } from '../../constants/routes';
import { COLORS } from '../../constants/theme';

export const HomeScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state: any) => state.persisted);

  const {
    products,
    categories,
    selectedCategory,
    searchQuery,
    isLoading,
    isRefreshing,
    isLoadingMore,
    selectCategory,
    handleSearch,
    refresh,
    loadMore,
  } = useProducts();

  const [selectedSort, setSelectedSort] = useState<SortType>('default');

  // Sort products based on user selection
  const sortedProducts = useMemo(() => {
    const list = [...(products || [])];
    if (selectedSort === 'price-low-high') {
      list.sort((a, b) => (Number(a?.price) || 0) - (Number(b?.price) || 0));
    } else if (selectedSort === 'price-high-low') {
      list.sort((a, b) => (Number(b?.price) || 0) - (Number(a?.price) || 0));
    } else if (selectedSort === 'rating-high-low') {
      list.sort((a, b) => (Number(b?.rating) || 0) - (Number(a?.rating) || 0));
    }
    return list;
  }, [products, selectedSort]);

  // Pagination footer indicator
  const renderFooter = () => {
    if (!isLoadingMore) return null;
    return (
      <View style={{ paddingVertical: 20, alignItems: 'center' }}>
        <ActivityIndicator size="small" color={COLORS.primary} />
      </View>
    );
  };

  // Prefetch next page 350px before reaching the end of the list
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    if (contentOffset.y <= 20) return;

    const isCloseToBottom =
      layoutMeasurement.height + contentOffset.y >= contentSize.height - 350;

    if (isCloseToBottom) {
      loadMore();
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header with Cart Count Badge */}
      <View style={styles.header}>
        <View>
          <Text style={styles.brandTitle}>SmartCart</Text>
          <Text style={styles.brandSubtitle}>Explore curated collection</Text>
        </View>
        <TouchableOpacity
          style={styles.headerBtn}
          onPress={() => navigation.navigate(AppRoutes.CartTab)}
        >
          <Image
            source={IMAGES.cart}
            style={styles.headerBtnImage}
            resizeMode="contain"
          />
          {(cartItems?.length || 0) > 0 ? (
            <View
              style={{
                position: 'absolute',
                top: -4,
                right: -4,
                backgroundColor: COLORS.error,
                borderRadius: 10,
                width: 18,
                height: 18,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text style={{ color: '#fff', fontSize: 10, fontWeight: '700' }}>
                {cartItems?.length || 0}
              </Text>
            </View>
          ) : null}
        </TouchableOpacity>
      </View>

      {/* Debounced Search Bar */}
      <SearchBar
        value={searchQuery}
        onChangeText={handleSearch}
        placeholder="Search phones, laptops, perfumes..."
      />

      {/* Dynamic API Categories */}
      <CategoryPills
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={selectCategory}
      />

      {/* Sorting Bar */}
      <SortFilterBar
        itemCount={sortedProducts?.length || 0}
        selectedSort={selectedSort}
        onSelectSort={setSelectedSort}
      />

      {/* Loading Spinner for first load */}
      {isLoading ? (
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <FlatList
          data={sortedProducts || []}
          keyExtractor={item => item?.id?.toString() || Math.random().toString()}
          renderItem={({ item }) => (
            <ProductCard
              item={item}
              onPress={() =>
                navigation.navigate(AppRoutes.ProductDetails, { product: item })
              }
              onAddToCart={() => dispatch(addToCart(item))}
            />
          )}
          numColumns={2}
          contentContainerStyle={styles.productList}
          columnWrapperStyle={styles.rowWrapper}
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          onMomentumScrollEnd={handleScroll}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          initialNumToRender={8}
          maxToRenderPerBatch={10}
          windowSize={11}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={refresh} />
          }
          ListFooterComponent={renderFooter}
        />
      )}
    </SafeAreaView>
  );
};

export default HomeScreen;
