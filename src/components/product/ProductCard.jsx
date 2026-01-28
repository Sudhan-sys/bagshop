'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { formatPrice, formatDiscountBadge } from '@/lib/money';
import styles from './ProductCard.module.css';

export default function ProductCard({ product, onTryOn }) {
  const { addItem } = useCart();
  const [imageError, setImageError] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Adding item:', product.name);
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || product.image,
      variant: product.colors?.[0]?.name || 'Default',
      quantity: 1,
    });
  };

  const discount = formatDiscountBadge(product.originalPrice, product.price);

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    for (let i = 0; i < 5; i++) {
      stars.push(
        <svg
          key={i}
          className={`${styles.star} ${i >= fullStars ? styles.starEmpty : ''}`}
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }
    return stars;
  };

  return (
    <div className={styles.card}>
      <div className={styles.imageWrapper}>
        {!imageError ? (
          <img 
            src={product.images?.[0] || product.image} 
            alt={product.name}
            className={styles.image}
            style={{ objectFit: 'cover' }}
            onError={() => setImageError(true)}
          />
        ) : (
          <div 
            className={styles.image}
            style={{ 
              background: `linear-gradient(145deg, ${product.colors?.[0]?.value || '#2d2d2d'} 0%, ${product.colors?.[0]?.value || '#1a1a1a'}88 50%, #f5f5f5 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg 
              width="80" 
              height="80" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="rgba(255,255,255,0.6)" 
              strokeWidth="1.5"
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
          </div>
        )}
        {product.badge && <span className={styles.badge}>{product.badge}</span>}
        <div className={styles.quickActions}>
          <button 
            className={styles.quickBtn}
            onClick={handleAddToCart}
            aria-label="Add to cart"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add
          </button>
          {onTryOn && (
            <button 
              className={styles.quickBtn}
              onClick={(e) => { e.preventDefault(); onTryOn(product); }}
              aria-label="Try on"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
              </svg>
              Try
            </button>
          )}
        </div>
      </div>
      <div className={styles.content}>
        <span className={styles.category}>{product.category}</span>
        <h3 className={styles.name}>
          <Link href={`/product/${product.slug}`}>{product.name}</Link>
        </h3>
        <div className={styles.rating}>
          <div className={styles.stars}>{renderStars(product.rating)}</div>
          <span className={styles.ratingText}>({product.reviewCount})</span>
        </div>
        <div className={styles.priceRow}>
          <span className={styles.price}>{formatPrice(product.price)}</span>
          {product.originalPrice && (
            <span className={styles.originalPrice}>{formatPrice(product.originalPrice)}</span>
          )}
          {discount && <span className={styles.discount}>{discount}</span>}
        </div>
      </div>
    </div>
  );
}
