describe('Similar Products Logic', () => {
  const currentProduct = {
    id: 101,
    title: 'Running Shoes Pro',
    category: 'footwear',
    price: 120,
  };

  const categoryProductsFromApi = [
    { id: 101, title: 'Running Shoes Pro', category: 'footwear', price: 120 },
    { id: 102, title: 'Trail Hiking Boots', category: 'footwear', price: 150 },
    { id: 103, title: 'Casual Canvas Sneakers', category: 'footwear', price: 65 },
    { id: 104, title: 'Leather Loafers', category: 'footwear', price: 110 },
  ];

  it('filters out the active product so it does not appear in similar products', () => {
    const similar = categoryProductsFromApi.filter(
      item => item.id !== currentProduct.id,
    );

    expect(similar.length).toBe(3);
    expect(similar.some(item => item.id === currentProduct.id)).toBe(false);
  });

  it('keeps all products strictly belonging to the same category', () => {
    const mixedProducts = [
      ...categoryProductsFromApi,
      { id: 201, title: 'Wrist Watch', category: 'accessories', price: 200 },
    ];

    const similar = mixedProducts
      .filter(item => item.id !== currentProduct.id)
      .filter(item => item.category === currentProduct.category);

    expect(similar.length).toBe(3);
    expect(similar.every(item => item.category === 'footwear')).toBe(true);
  });

  it('handles empty category products list gracefully', () => {
    const emptyList: any[] = [];
    const similar = emptyList.filter(item => item.id !== currentProduct.id);

    expect(similar).toEqual([]);
  });
});
