'use client';

/**
 * Home Page
 * 
 * Main landing page with:
 * - Hero section
 * - Shop by Category
 * - Best Sellers (from Supabase)
 * - Trust features
 * - New Arrivals (from Supabase)
 * - CTA banner
 */

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { collections } from '@/data/collections';
import { fetchFeaturedProducts, fetchNewArrivals } from '@/lib/products';
import ProductCard from '@/components/product/ProductCard';
import Button from '@/components/ui/Button';
import styles from './page.module.css';

// Collection icons mapping
const collectionIcons = {
  backpacks: '🎒',
  travel: '🧳',
  laptop: '💼',
  handbags: '👜',
};

export default function HomePage() {
  // State for dynamic product loading
  const [bestSellers, setBestSellers] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load products on mount
  useEffect(() => {
    async function loadProducts() {
      try {
        const [featured, arrivals] = await Promise.all([
          fetchFeaturedProducts(4),
          fetchNewArrivals(4),
        ]);
        setBestSellers(featured);
        setNewArrivals(arrivals);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroPattern} />
        <div className="container">
          <div className={styles.heroContent}>
            <span className={styles.heroBadge}>Premium Quality</span>
            <h1 className={styles.heroTitle}>
              Bags Designed for <span>Every Journey</span>
            </h1>
            <p className={styles.heroDesc}>
              Discover our collection of premium bags crafted for durability, style, and comfort. From daily commutes to grand adventures.
            </p>
            <div className={styles.heroActions}>
              <Link href="/shop" className={`${styles.heroBtn} ${styles.heroBtnPrimary}`}>
                Shop Now
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </Link>
              <Link href="/about" className={`${styles.heroBtn} ${styles.heroBtnSecondary}`}>
                Our Story
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Collections Section */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Shop by Category</h2>
            <p className={styles.sectionDesc}>
              Explore our curated collections designed for every lifestyle
            </p>
          </div>
          <div className={styles.collectionsGrid}>
            {collections.map((collection) => (
              <Link
                key={collection.id}
                href={`/shop?category=${collection.slug}`}
                className={styles.collectionCard}
              >
                <div className={styles.collectionContent}>
                  <div className={styles.collectionIcon}>
                    {collectionIcons[collection.slug] || '👜'}
                  </div>
                  <h3 className={styles.collectionName}>{collection.name}</h3>
                  <span className={styles.collectionCount}>
                    {collection.productCount} Products
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className={styles.section} style={{ background: 'var(--color-bg)' }}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Best Sellers</h2>
            <p className={styles.sectionDesc}>
              Our most loved bags chosen by customers like you
            </p>
          </div>
          
          {loading ? (
            <div className={styles.productsGrid}>
              {[1, 2, 3, 4].map(i => (
                <div key={i} className={styles.productSkeleton}>
                  <div className={styles.skeletonImage} />
                  <div className={styles.skeletonText} />
                  <div className={styles.skeletonText} style={{ width: '60%' }} />
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.productsGrid}>
              {bestSellers.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
          
          <div style={{ textAlign: 'center', marginTop: 'var(--space-10)' }}>
            <Link href="/shop">
              <Button variant="outline" size="lg">View All Products</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className={`${styles.section} ${styles.trustSection}`}>
        <div className="container">
          <div className={styles.trustGrid}>
            <div className={styles.trustItem}>
              <div className={styles.trustIcon}>🪶</div>
              <h4 className={styles.trustTitle}>Lightweight</h4>
              <p className={styles.trustDesc}>Ergonomic designs that don't weigh you down</p>
            </div>
            <div className={styles.trustItem}>
              <div className={styles.trustIcon}>💧</div>
              <h4 className={styles.trustTitle}>Water-Resistant</h4>
              <p className={styles.trustDesc}>Protected against rain and spills</p>
            </div>
            <div className={styles.trustItem}>
              <div className={styles.trustIcon}>🛡️</div>
              <h4 className={styles.trustTitle}>2+ Year Warranty</h4>
              <p className={styles.trustDesc}>Quality guaranteed with extended coverage</p>
            </div>
            <div className={styles.trustItem}>
              <div className={styles.trustIcon}>🚚</div>
              <h4 className={styles.trustTitle}>Free Delivery</h4>
              <p className={styles.trustDesc}>On orders above ₹1,999</p>
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>New Arrivals</h2>
            <p className={styles.sectionDesc}>
              Fresh styles just landed in our collection
            </p>
          </div>
          
          {loading ? (
            <div className={styles.productsGrid}>
              {[1, 2, 3, 4].map(i => (
                <div key={i} className={styles.productSkeleton}>
                  <div className={styles.skeletonImage} />
                  <div className={styles.skeletonText} />
                  <div className={styles.skeletonText} style={{ width: '60%' }} />
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.productsGrid}>
              {newArrivals.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Banner */}
      <section className={styles.ctaBanner}>
        <div className="container">
          <h2 className={styles.ctaTitle}>Ready to Find Your Perfect Bag?</h2>
          <p className={styles.ctaDesc}>
            Join 10,000+ happy customers who trust BagShop for their everyday carry
          </p>
          <Link href="/shop">
            <Button variant="accent" size="lg">
              Explore Collection
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
