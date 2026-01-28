'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/money';
import Button from '@/components/ui/Button';
import styles from './page.module.css';

export default function CartPage() {
  const { cart, updateQuantity, removeItem, subtotal, isHydrated } = useCart();

  if (!isHydrated) {
    return (
      <div className={styles.page}>
        <div className="container">
          <h1 className={styles.pageTitle}>Your Cart</h1>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className={styles.page}>
        <div className="container">
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>🛒</div>
            <h2 className={styles.emptyTitle}>Your cart is empty</h2>
            <p className={styles.emptyDesc}>
              Looks like you haven't added any bags yet. Let's find your perfect match!
            </p>
            <Link href="/shop">
              <Button variant="accent" size="lg">Start Shopping</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const shipping = subtotal >= 1999 ? 0 : 99;
  const total = subtotal + shipping;

  return (
    <div className={styles.page}>
      <div className="container">
        <h1 className={styles.pageTitle}>Your Cart ({cart.length} items)</h1>

        <div className={styles.layout}>
          {/* Cart Items */}
          <div className={styles.cartItems}>
            {cart.map((item) => (
              <div key={`${item.id}-${item.variant}`} className={styles.cartItem}>
                <div className={styles.itemImage} style={{ position: 'relative', overflow: 'hidden' }}>
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.style.background = '#333';
                      e.target.parentElement.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;font-size:20px;">🎒</div>';
                    }}
                  />
                </div>
                <div className={styles.itemDetails}>
                  <h3 className={styles.itemName}>{item.name}</h3>
                  <p className={styles.itemVariant}>{item.variant}</p>
                  <p className={styles.itemPrice}>{formatPrice(item.price)}</p>
                  <div className={styles.itemActions}>
                    <div className={styles.quantityControl}>
                      <button
                        className={styles.quantityBtn}
                        onClick={() => updateQuantity(item.id, item.variant, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
                        </svg>
                      </button>
                      <span className={styles.quantityValue}>{item.quantity}</span>
                      <button
                        className={styles.quantityBtn}
                        onClick={() => updateQuantity(item.id, item.variant, item.quantity + 1)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                      </button>
                    </div>
                    <button
                      className={styles.removeBtn}
                      onClick={() => removeItem(item.id, item.variant)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className={styles.summary}>
            <h3 className={styles.summaryTitle}>Order Summary</h3>
            
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>Subtotal</span>
              <span className={styles.summaryValue}>{formatPrice(subtotal)}</span>
            </div>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>Shipping</span>
              <span className={styles.summaryValue}>
                {shipping === 0 ? 'FREE' : formatPrice(shipping)}
              </span>
            </div>
            {subtotal < 1999 && (
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-accent)', marginTop: 'var(--space-2)' }}>
                Add {formatPrice(1999 - subtotal)} more for free shipping!
              </p>
            )}

            <div className={styles.couponInput}>
              <input type="text" placeholder="Coupon code" />
              <button>Apply</button>
            </div>

            <div className={styles.summaryTotal}>
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>

            <div className={styles.checkoutBtn}>
              <Link href="/checkout">
                <Button variant="accent" fullWidth size="lg">
                  Proceed to Checkout
                </Button>
              </Link>
            </div>

            <div className={styles.trustBadges}>
              <span className={styles.badge}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                </svg>
                Secure
              </span>
              <span className={styles.badge}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
                Easy Returns
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
