'use client';

/**
 * Shop Page
 * 
 * Main product listing page with:
 * - Category filtering
 * - Price range filtering
 * - Sorting options
 * - Mobile-friendly filter panel
 * - Loading states
 */

import { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { fetchProducts } from '@/lib/products';
import { collections } from '@/data/collections';
import ProductCard from '@/components/product/ProductCard';
import Button from '@/components/ui/Button';
import styles from './page.module.css';

// Price range options
const priceRanges = [
  { label: 'Under ₹2,000', value: '0-2000', min: 0, max: 2000 },
  { label: '₹2,000 - ₹4,000', value: '2000-4000', min: 2000, max: 4000 },
  { label: '₹4,000 - ₹6,000', value: '4000-6000', min: 4000, max: 6000 },
  { label: 'Above ₹6,000', value: '6000-', min: 6000, max: Infinity },
];

// Sort options mapping to Supabase query params
const sortOptions = {
  popular: { field: 'review_count', order: 'desc' },
  newest: { field: 'created_at', order: 'desc' },
  'price-low': { field: 'price', order: 'asc' },
  'price-high': { field: 'price', order: 'desc' },
  rating: { field: 'rating', order: 'desc' },
};

function ShopPageContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');

  // State
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({
    category: categoryParam || '',
    priceRange: '',
    sortBy: 'popular',
  });

  // Load products from Supabase
  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      try {
        const sort = sortOptions[filters.sortBy] || sortOptions.popular;
        const data = await fetchProducts({
          category: filters.category || null,
          sortBy: sort.field,
          sortOrder: sort.order,
          limit: 50,
        });
        setProducts(data);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, [filters.category, filters.sortBy]);

  // Update category from URL params
  useEffect(() => {
    if (categoryParam !== filters.category) {
      setFilters(prev => ({ ...prev, category: categoryParam || '' }));
    }
  }, [categoryParam]);

  // Filter products by price range (client-side for performance)
  const filteredProducts = useMemo(() => {
    if (!filters.priceRange) return products;

    const range = priceRanges.find(r => r.value === filters.priceRange);
    if (!range) return products;

    return products.filter(p => p.price >= range.min && p.price < range.max);
  }, [products, filters.priceRange]);

  // Handlers
  const handleCategoryChange = (category) => {
    setFilters(prev => ({
      ...prev,
      category: prev.category === category ? '' : category,
    }));
  };

  const handlePriceChange = (range) => {
    setFilters(prev => ({
      ...prev,
      priceRange: prev.priceRange === range ? '' : range,
    }));
  };

  const handleSortChange = (e) => {
    setFilters(prev => ({ ...prev, sortBy: e.target.value }));
  };

  // Filter content component (shared between desktop and mobile)
  const FilterContent = () => (
    <>
      <div className={styles.filterSection}>
        <h4 className={styles.filterTitle}>Category</h4>
        <div className={styles.filterOptions}>
          {collections.map(col => (
            <label 
              key={col.id} 
              className={`${styles.filterOption} ${filters.category === col.slug ? styles.active : ''}`}
            >
              <input
                type="checkbox"
                checked={filters.category === col.slug}
                onChange={() => handleCategoryChange(col.slug)}
              />
              {col.name}
            </label>
          ))}
        </div>
      </div>

      <div className={styles.filterSection}>
        <h4 className={styles.filterTitle}>Price Range</h4>
        <div className={styles.filterOptions}>
          {priceRanges.map(range => (
            <label 
              key={range.value} 
              className={`${styles.filterOption} ${filters.priceRange === range.value ? styles.active : ''}`}
            >
              <input
                type="checkbox"
                checked={filters.priceRange === range.value}
                onChange={() => handlePriceChange(range.value)}
              />
              {range.label}
            </label>
          ))}
        </div>
      </div>
    </>
  );

  return (
    <div className={styles.page}>
      <div className="container">
        {/* Page Header */}
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>
            {filters.category 
              ? collections.find(c => c.slug === filters.category)?.name || 'Shop'
              : 'All Products'}
          </h1>
          <p className={styles.pageDesc}>
            Discover our collection of premium bags
          </p>
        </div>

        <div className={styles.layout}>
          {/* Desktop Filters Sidebar */}
          <aside className={styles.filters}>
            <div className={styles.filtersCard}>
              <FilterContent />
            </div>
          </aside>

          {/* Main Content */}
          <main className={styles.main}>
            {/* Toolbar */}
            <div className={styles.toolbar}>
              <span className={styles.resultCount}>
                {loading ? 'Loading...' : `${filteredProducts.length} product${filteredProducts.length !== 1 ? 's' : ''}`}
              </span>
              <select
                className={styles.sortSelect}
                value={filters.sortBy}
                onChange={handleSortChange}
              >
                <option value="popular">Most Popular</option>
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className={styles.productsGrid}>
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className={styles.productSkeleton}>
                    <div className={styles.skeletonImage} />
                    <div className={styles.skeletonText} />
                    <div className={styles.skeletonText} style={{ width: '60%' }} />
                  </div>
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className={styles.productsGrid}>
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className={styles.empty}>
                <div className={styles.emptyIcon}>🔍</div>
                <h3 className={styles.emptyTitle}>No products found</h3>
                <p className={styles.emptyDesc}>
                  Try adjusting your filters to find what you're looking for
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => setFilters({ category: '', priceRange: '', sortBy: 'popular' })}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </main>
        </div>

        {/* Mobile Filter Button */}
        <button 
          className={styles.mobileFilterBtn}
          onClick={() => setMobileFiltersOpen(true)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
          </svg>
          Filters
        </button>

        {/* Mobile Filter Panel */}
        {mobileFiltersOpen && (
          <div className={styles.mobileFilters}>
            <div className={styles.mobileFiltersHeader}>
              <h3 className={styles.mobileFiltersTitle}>Filters</h3>
              <button 
                className={styles.closeBtn}
                onClick={() => setMobileFiltersOpen(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <FilterContent />
            <div className={styles.applyBtn}>
              <Button fullWidth onClick={() => setMobileFiltersOpen(false)}>
                Show {filteredProducts.length} Results
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Wrap in Suspense for useSearchParams
export default function ShopPage() {
  return (
    <Suspense fallback={
      <div className={styles.page}>
        <div className="container">
          <p>Loading...</p>
        </div>
      </div>
    }>
      <ShopPageContent />
    </Suspense>
  );
}
