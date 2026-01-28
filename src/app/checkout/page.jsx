'use client';

/**
 * Checkout Page with Razorpay Integration
 * 
 * Multi-step checkout flow:
 * 1. Shipping Address
 * 2. Shipping Method
 * 3. Payment Method
 * 4. Order Review
 * 
 * Supports:
 * - Cash on Delivery (COD)
 * - Cash on Delivery (COD)
 * - Stripe (Cards, UPI, NetBanking)
 */

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
// Removed Razorpay Script import
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/money';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import styles from './page.module.css';

const steps = [
  { id: 'address', label: 'Address' },
  { id: 'shipping', label: 'Shipping' },
  { id: 'payment', label: 'Payment' },
  { id: 'review', label: 'Review' },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, subtotal, clearCart, isHydrated, getItemsForOrder } = useCart();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // Removed razorpayLoaded state

  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    shippingMethod: 'standard',
    paymentMethod: 'stripe',
  });

  const shipping = subtotal >= 1999 ? 0 : 99;
  const expressShipping = 199;
  const actualShipping = formData.shippingMethod === 'express' ? expressShipping : shipping;
  const total = subtotal + actualShipping;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const validateStep = () => {
    if (currentStep === 0) {
      if (!formData.email || !formData.firstName || !formData.lastName) {
        setError('Please fill in all required fields');
        return false;
      }
      if (!formData.address || !formData.city || !formData.state || !formData.pincode) {
        setError('Please complete your shipping address');
        return false;
      }
      if (!/\S+@\S+\.\S+/.test(formData.email)) {
        setError('Please enter a valid email address');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
      setError(null);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      setError(null);
    }
  };

  /**
   * Build order data object for API calls
   */
  const getOrderData = useCallback(() => ({
    customerName: `${formData.firstName} ${formData.lastName}`,
    customerEmail: formData.email,
    customerPhone: formData.phone,
    shippingAddress: {
      address: formData.address,
      city: formData.city,
      state: formData.state,
      pincode: formData.pincode,
    },
    totalAmount: total,
    items: getItemsForOrder(),
  }), [formData, total, getItemsForOrder]);

  /**
   * Handle Razorpay payment
   */
  /**
   * Handle Stripe payment
   */
  const handleStripePayment = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: getItemsForOrder(),
          customerEmail: formData.email,
          customerName: `${formData.firstName} ${formData.lastName}`,
          customerPhone: formData.phone,
          shippingAddress: {
            address: formData.address,
            city: formData.city,
            state: formData.state,
            pincode: formData.pincode,
          },
          totalAmount: total,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to initiate payment');
      }

      // Redirect to Stripe Checkout
      window.location.href = result.url;

    } catch (err) {
      console.error('Stripe error:', err);
      setError(err.message || 'Payment initiation failed. Please try again.');
      setLoading(false);
    }
  };

  /**
   * Handle COD order placement
   */
  const handleCODOrder = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...getOrderData(),
          paymentMethod: 'cod',
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to create order');
      }

      clearCart();
      router.push(`/order-success?id=${result.orderId}`);

    } catch (err) {
      console.error('COD order error:', err);
      setError(err.message || 'Failed to place order. Please try again.');
      setLoading(false);
    }
  };

  /**
   * Handle order placement based on payment method
   */
  const handlePlaceOrder = async () => {
    if (formData.paymentMethod === 'cod') {
      await handleCODOrder();
    } else {
      // Stripe Payment
      await handleStripePayment();
    }
  };

  // Redirect to cart if empty
  useEffect(() => {
    if (isHydrated && cart.length === 0) {
      router.push('/cart');
    }
  }, [isHydrated, cart, router]);

  if (!isHydrated) {
    return (
      <div className={styles.page}>
        <div className="container">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return null;
  }

  return (
    <>
      <div className={styles.page}>
        <div className="container">
          {/* Steps Indicator */}
          <div className={styles.steps}>
            {steps.map((step, i) => (
              <div key={step.id}>
                <div 
                  className={`${styles.step} ${i < currentStep ? styles.completed : ''} ${i === currentStep ? styles.active : ''}`}
                >
                  <span className={styles.stepNumber}>
                    {i < currentStep ? '✓' : i + 1}
                  </span>
                  <span className={styles.stepLabel}>{step.label}</span>
                </div>
                {i < steps.length - 1 && <div className={styles.stepDivider} />}
              </div>
            ))}
          </div>

          {/* Error Message */}
          {error && (
            <div className={styles.errorMessage}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: 20, height: 20 }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
              </svg>
              {error}
            </div>
          )}

          <div className={styles.layout}>
            {/* Form */}
            <div>
              {currentStep === 0 && (
                <div className={styles.formCard}>
                  <h2 className={styles.formTitle}>Shipping Address</h2>
                  <div className={styles.formGrid}>
                    <Input
                      label="Email *"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your@email.com"
                    />
                    <div className={styles.formRow}>
                      <Input
                        label="First Name *"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                      />
                      <Input
                        label="Last Name *"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                      />
                    </div>
                    <Input
                      label="Phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+91 XXXXX XXXXX"
                    />
                    <Input
                      label="Address *"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Street address, apartment, etc."
                    />
                    <div className={styles.formRow}>
                      <Input
                        label="City *"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                      />
                      <Input
                        label="State *"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                      />
                    </div>
                    <Input
                      label="Pincode *"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      placeholder="6 digit pincode"
                    />
                  </div>
                  <div className={styles.actions}>
                    <Button variant="accent" onClick={handleNext}>Continue to Shipping</Button>
                  </div>
                </div>
              )}

              {currentStep === 1 && (
                <div className={styles.formCard}>
                  <h2 className={styles.formTitle}>Shipping Method</h2>
                  <div className={styles.paymentMethods}>
                    <label className={`${styles.paymentOption} ${formData.shippingMethod === 'standard' ? styles.active : ''}`}>
                      <input
                        type="radio"
                        name="shippingMethod"
                        value="standard"
                        checked={formData.shippingMethod === 'standard'}
                        onChange={handleInputChange}
                      />
                      <div className={styles.paymentLabel}>
                        <div className={styles.paymentTitle}>Standard Delivery</div>
                        <div className={styles.paymentDesc}>5-7 business days • {shipping === 0 ? 'FREE' : formatPrice(99)}</div>
                      </div>
                      <span className={styles.paymentIcon}>📦</span>
                    </label>
                    <label className={`${styles.paymentOption} ${formData.shippingMethod === 'express' ? styles.active : ''}`}>
                      <input
                        type="radio"
                        name="shippingMethod"
                        value="express"
                        checked={formData.shippingMethod === 'express'}
                        onChange={handleInputChange}
                      />
                      <div className={styles.paymentLabel}>
                        <div className={styles.paymentTitle}>Express Delivery</div>
                        <div className={styles.paymentDesc}>2-3 business days • {formatPrice(199)}</div>
                      </div>
                      <span className={styles.paymentIcon}>🚀</span>
                    </label>
                  </div>
                  <div className={styles.actions}>
                    <Button variant="outline" onClick={handleBack}>Back</Button>
                    <Button variant="accent" onClick={handleNext}>Continue to Payment</Button>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className={styles.formCard}>
                  <h2 className={styles.formTitle}>Payment Method</h2>
                  <div className={styles.paymentMethods}>
                    <label className={`${styles.paymentOption} ${formData.paymentMethod === 'cod' ? styles.active : ''}`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={formData.paymentMethod === 'cod'}
                        onChange={handleInputChange}
                      />
                      <div className={styles.paymentLabel}>
                        <div className={styles.paymentTitle}>Cash on Delivery</div>
                        <div className={styles.paymentDesc}>Pay when you receive your order</div>
                      </div>
                      <span className={styles.paymentIcon}>💵</span>
                    </label>
                    <label className={`${styles.paymentOption} ${formData.paymentMethod === 'stripe' ? styles.active : ''}`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="stripe"
                        checked={formData.paymentMethod === 'stripe'}
                        onChange={handleInputChange}
                      />
                      <div className={styles.paymentLabel}>
                        <div className={styles.paymentTitle}>Credit / Debit Card (Stripe)</div>
                        <div className={styles.paymentDesc}>Secure online payment via Stripe</div>
                      </div>
                      <span className={styles.paymentIcon}>💳</span>
                    </label>
                  </div>
                  <div className={styles.actions}>
                    <Button variant="outline" onClick={handleBack}>Back</Button>
                    <Button variant="accent" onClick={handleNext}>Review Order</Button>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className={styles.formCard}>
                  <h2 className={styles.formTitle}>Review Your Order</h2>
                  <div style={{ marginBottom: 'var(--space-6)' }}>
                    <h4 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, marginBottom: 'var(--space-2)' }}>Shipping to:</h4>
                    <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>
                      {formData.firstName} {formData.lastName}<br />
                      {formData.address}<br />
                      {formData.city}, {formData.state} - {formData.pincode}<br />
                      {formData.phone && <>{formData.phone}<br /></>}
                      {formData.email}
                    </p>
                  </div>
                  <div style={{ marginBottom: 'var(--space-6)' }}>
                    <h4 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, marginBottom: 'var(--space-2)' }}>Delivery:</h4>
                    <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>
                      {formData.shippingMethod === 'express' ? 'Express (2-3 days)' : 'Standard (5-7 days)'}
                    </p>
                  </div>
                  <div style={{ marginBottom: 'var(--space-6)' }}>
                    <h4 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, marginBottom: 'var(--space-2)' }}>Payment:</h4>
                    <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>
                      {formData.paymentMethod === 'cod' && 'Cash on Delivery'}
                      {formData.paymentMethod === 'stripe' && 'Online Payment (Stripe)'}
                    </p>
                  </div>
                  
                  {/* Razorpay Trust Badge */}
                  {formData.paymentMethod !== 'cod' && (
                    <div style={{ 
                      padding: 'var(--space-3)', 
                      background: 'var(--color-bg)', 
                      borderRadius: 'var(--radius-md)',
                      marginBottom: 'var(--space-6)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--space-2)',
                      fontSize: 'var(--font-size-xs)',
                      color: 'var(--color-text-muted)'
                    }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                      </svg>
                      Secured by Stripe. Your payment information is encrypted.
                    </div>
                  )}

                  <div className={styles.actions}>
                    <Button variant="outline" onClick={handleBack}>Back</Button>
                    <Button variant="accent" loading={loading} onClick={handlePlaceOrder}>
                      {formData.paymentMethod === 'cod' 
                        ? `Place Order • ${formatPrice(total)}`
                        : `Pay ${formatPrice(total)}`
                      }
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className={styles.summary}>
              <h3 className={styles.summaryTitle}>Order Summary</h3>
              <div className={styles.summaryItems}>
                {cart.map(item => (
                  <div key={`${item.id}-${item.variant}`} className={styles.summaryItem}>
                    <div className={styles.summaryItemImage} style={{ position: 'relative', overflow: 'hidden' }}>
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.style.background = '#333';
                          e.target.parentElement.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;font-size:14px;">🎒</div>';
                        }}
                      />
                    </div>
                    <div className={styles.summaryItemDetails}>
                      <div className={styles.summaryItemName}>{item.name}</div>
                      <div className={styles.summaryItemMeta}>{item.variant} × {item.quantity}</div>
                    </div>
                    <div className={styles.summaryItemPrice}>{formatPrice(item.price * item.quantity)}</div>
                  </div>
                ))}
              </div>
              <div className={styles.summaryRow}>
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Shipping</span>
                <span>{actualShipping === 0 ? 'FREE' : formatPrice(actualShipping)}</span>
              </div>
              <div className={styles.summaryTotal}>
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
