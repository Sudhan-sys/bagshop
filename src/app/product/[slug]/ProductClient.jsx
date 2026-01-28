'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { formatPrice, formatDiscountBadge } from '@/lib/money';
import Button from '@/components/ui/Button';
import ProductCard from '@/components/product/ProductCard';
import TryOnModal from '@/components/tryon/TryOnModal';
import ReviewsSection from '@/components/product/ReviewsSection';
import styles from './page.module.css';

export default function ProductClient({ product, relatedProducts }) {
  const { addItem } = useCart();
  
  // UI state
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [tryOnOpen, setTryOnOpen] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Simplified variant logic for MVP
  const currentColor = product.colors?.[selectedColor] || { name: 'Default', value: '#333333' };
  const variantPrice = product.price; 
  const discount = formatDiscountBadge(product.originalPrice, variantPrice);

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      product_id: product.id,
      variant_id: null,
      name: product.name,
      price: variantPrice,
      image: product.images?.[0] || '/images/placeholder.svg',
      variant: null,
      quantity,
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    window.location.href = '/checkout';
  };

  // Render star rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    for (let i = 0; i < 5; i++) {
      stars.push(
        <svg
          key={i}
          className={styles.star}
          style={{ fill: i >= fullStars ? 'var(--color-border)' : 'var(--color-accent)' }}
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }
    return stars;
  };

  const productImages = product.images?.length > 0 ? product.images : ['/images/placeholder.svg'];

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.grid}>
          {/* Gallery */}
          <div className={styles.gallery}>
            <div className={styles.mainImage}>
              {!imageError ? (
                <img 
                  src={productImages[selectedImage] || productImages[0]} 
                  alt={product.name}
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  onError={() => setImageError(true)}
                />
              ) : (
                <div style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#f5f5f5'
                }}>
                  Image Unavailable
                </div>
              )}
            </div>
            <div className={styles.thumbnails}>
              {productImages.slice(0, 4).map((img, i) => (
                <button 
                  key={i} 
                  className={`${styles.thumbnail} ${i === selectedImage ? styles.active : ''}`}
                  onClick={() => {
                    setSelectedImage(i);
                    setImageError(false);
                  }}
                >
                  <img 
                    src={img} 
                    alt="" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => e.target.src = '/images/placeholder.svg'}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className={styles.details}>
            <div className={styles.breadcrumb}>
              <Link href="/">Home</Link> / <Link href="/shop">Shop</Link> / {product.name}
            </div>

            {product.badge && <span className={styles.badge}>{product.badge}</span>}
            
            <h1 className={styles.title}>{product.name}</h1>

            <div className={styles.rating}>
              <div className={styles.stars}>{renderStars(product.rating)}</div>
              <span className={styles.ratingText}>
                {product.rating} ({product.reviewCount} reviews)
              </span>
            </div>

            <div className={styles.priceRow}>
              <span className={styles.price}>{formatPrice(variantPrice)}</span>
              {product.originalPrice > 0 && (
                <span className={styles.originalPrice}>{formatPrice(product.originalPrice)}</span>
              )}
              {discount && <span className={styles.discount}>{discount}</span>}
            </div>

            <p className={styles.description}>{product.description}</p>

            <div className={styles.quantityRow}>
              <span className={styles.variantLabel}>Quantity:</span>
              <div className={styles.quantityControl}>
                <button 
                  className={styles.quantityBtn}
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className={styles.quantityValue}>{quantity}</span>
                <button 
                  className={styles.quantityBtn}
                  onClick={() => setQuantity(q => q + 1)}
                >
                  +
                </button>
              </div>
            </div>

            <div className={styles.actions}>
              <Button variant="primary" size="lg" onClick={handleAddToCart}>
                Add to Cart
              </Button>
              <Button variant="accent" size="lg" onClick={handleBuyNow}>
                Buy Now
              </Button>
            </div>

             <button className={styles.tryOnBtn} onClick={() => setTryOnOpen(true)}>
              🤖 Try it on — AI Preview
            </button>

            {/* Highlights & Specs (kept short for brevity, but exist) */}
            {product.highlights?.length > 0 && (
              <div className={styles.highlights}>
                <h4 className={styles.highlightsTitle}>Key Features</h4>
                <ul className={styles.highlightsList}>
                  {product.highlights.map((highlight, i) => (
                    <li key={i}>{highlight}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Related */}
        {relatedProducts.length > 0 && (
           <section style={{ marginTop: '4rem' }}>
            <h2>You May Also Like</h2>
            <div className={styles.relatedGrid}>
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>

      <TryOnModal
        isOpen={tryOnOpen}
        onClose={() => setTryOnOpen(false)}
        product={{ ...product, image: productImages[0] }}
      />
      
      <div className="container">
        <ReviewsSection productId={product.id} />
      </div>
    </div>
  );
}
