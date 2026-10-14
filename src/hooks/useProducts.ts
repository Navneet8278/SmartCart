import { useState, useEffect, useRef } from 'react';
import { apiClient } from '../api/client';

export const useProducts = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const skipRef = useRef(0);
  const isFetchingRef = useRef(false);
  const debounceTimer = useRef<any>(null);

  // Fetch dynamic categories from API
  const fetchCategories = async () => {
    try {
      const res = await apiClient.get('/products/categories');
      const data = Array.isArray(res?.data) ? res.data : [];

      const categoryNames = data.map((c: any) =>
        typeof c === 'string' ? c : c?.name || c?.slug || '',
      ).filter(Boolean);

      setCategories(['All', ...categoryNames]);
    } catch (_err) {
      // Gracefully handle network or parsing failures
    }
  };

  // Fetch paginated products with search and category filtering
  const fetchProductsList = async (isNewQuery = false) => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    if (isNewQuery) {
      skipRef.current = 0;
      setIsLoading(true);
    } else {
      setIsLoadingMore(true);
    }

    const PAGE_SIZE = 16;
    try {
      let endpoint = `/products?limit=${PAGE_SIZE}&skip=${skipRef.current}`;

      if (searchQuery.trim().length > 0) {
        endpoint = `/products/search?q=${encodeURIComponent(
          searchQuery,
        )}&limit=${PAGE_SIZE}&skip=${skipRef.current}`;
      } else if (selectedCategory !== 'All') {
        endpoint = `/products/category/${encodeURIComponent(
          selectedCategory,
        )}?limit=${PAGE_SIZE}&skip=${skipRef.current}`;
      }

      const res = await apiClient.get(endpoint);

      const newItems = Array.isArray(res?.data?.products)
        ? res.data.products
        : [];
      const total = Number(res?.data?.total || 0);

      if (isNewQuery) {
        setProducts(newItems);
      } else {
        setProducts(prev => {
          const safePrev = Array.isArray(prev) ? prev : [];
          const existingIds = new Set(
            safePrev.map(p => p?.id).filter(id => id !== undefined),
          );
          const uniqueNewItems = newItems.filter(
            (p: any) => p?.id !== undefined && !existingIds.has(p.id),
          );
          return [...safePrev, ...uniqueNewItems];
        });
      }

      skipRef.current += newItems.length;
      setHasMore(skipRef.current < total);
    } catch (_err) {
      // Gracefully handle network or pagination failures
    } finally {
      isFetchingRef.current = false;
      setIsLoading(false);
      setIsRefreshing(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProductsList(true);
  }, [selectedCategory]);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      skipRef.current = 0;
      fetchProductsList(true);
    }, 400);
  };

  const refresh = () => {
    setIsRefreshing(true);
    skipRef.current = 0;
    fetchProductsList(true);
  };

  const loadMore = () => {
    if (isFetchingRef.current || isLoading || isLoadingMore || !hasMore) {
      return;
    }
    fetchProductsList(false);
  };

  return {
    products,
    categories,
    selectedCategory,
    searchQuery,
    isLoading,
    isRefreshing,
    isLoadingMore,
    hasMore,
    selectCategory: (cat: string) => {
      setSelectedCategory(cat);
      setSearchQuery('');
      skipRef.current = 0;
    },
    handleSearch,
    refresh,
    loadMore,
  };
};
