describe('Search & Product Sorting Logic', () => {
  const sampleProducts = [
    { id: 1, title: 'Apple iPhone 15', price: 999.99, rating: 4.8, category: 'smartphones' },
    { id: 2, title: 'Samsung Galaxy S24', price: 899.99, rating: 4.6, category: 'smartphones' },
    { id: 3, title: 'Google Pixel 8', price: 699.99, rating: 4.9, category: 'smartphones' },
    { id: 4, title: 'Budget Feature Phone', price: 49.99, rating: 3.5, category: 'smartphones' },
  ];

  it('filters products correctly by search query (case-insensitive)', () => {
    const query = 'galaxy';
    const filtered = sampleProducts.filter(p =>
      p.title.toLowerCase().includes(query.toLowerCase()),
    );

    expect(filtered.length).toBe(1);
    expect(filtered[0].title).toBe('Samsung Galaxy S24');
  });

  it('returns all products when search query is empty', () => {
    const query = '';
    const filtered = sampleProducts.filter(p =>
      p.title.toLowerCase().includes(query.toLowerCase()),
    );

    expect(filtered.length).toBe(sampleProducts.length);
  });

  it('returns empty list for non-matching search query', () => {
    const query = 'NonExistentLaptopXYZ';
    const filtered = sampleProducts.filter(p =>
      p.title.toLowerCase().includes(query.toLowerCase()),
    );

    expect(filtered.length).toBe(0);
  });

  it('sorts products by price: low to high', () => {
    const sorted = [...sampleProducts].sort((a, b) => a.price - b.price);

    expect(sorted[0].price).toBe(49.99);
    expect(sorted[sorted.length - 1].price).toBe(999.99);
    expect(sorted.map(p => p.id)).toEqual([4, 3, 2, 1]);
  });

  it('sorts products by price: high to low', () => {
    const sorted = [...sampleProducts].sort((a, b) => b.price - a.price);

    expect(sorted[0].price).toBe(999.99);
    expect(sorted[sorted.length - 1].price).toBe(49.99);
    expect(sorted.map(p => p.id)).toEqual([1, 2, 3, 4]);
  });

  it('sorts products by customer rating: high to low', () => {
    const sorted = [...sampleProducts].sort((a, b) => b.rating - a.rating);

    expect(sorted[0].rating).toBe(4.9);
    expect(sorted[0].title).toBe('Google Pixel 8');
    expect(sorted[sorted.length - 1].rating).toBe(3.5);
  });
});
