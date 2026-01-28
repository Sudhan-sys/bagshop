'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import styles from './page.module.css';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get('id');
  const sessionId = searchParams.get('session_id');
  
  const [verifying, setVerifying] = useState(!!sessionId);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function verifyPayment() {
      if (!sessionId || !orderId) return;

      try {
        const response = await fetch('/api/stripe/verify-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ session_id: sessionId, order_id: orderId }),
        });

        const result = await response.json();

        if (!result.success) {
          throw new Error(result.message || 'Payment authentication failed');
        }
        
        // Success! Remove session params to prevent re-verification
        // router.replace(`/order-success?id=${orderId}&payment=success`);
        setVerifying(false);
      } catch (err) {
        console.error('Verify error:', err);
        setError(err.message);
        setVerifying(false);
      }
    }

    if (sessionId) {
      verifyPayment();
    }
  }, [sessionId, orderId, router]);

  if (verifying) {
    return (
      <div className={styles.page}>
        <div className="container" style={{ textAlign: 'center', padding: '100px 0' }}>
          <h2>Verifying your payment...</h2>
          <p>Please do not close this window.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.page}>
        <div className="container" style={{ textAlign: 'center', padding: '100px 0' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>⚠️</div>
          <h2 style={{ color: '#ef4444', marginBottom: '16px' }}>Payment Verification Failed</h2>
          <p style={{ marginBottom: '24px', color: '#64748b' }}>{error}</p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <Link href="/checkout"><Button variant="accent">Try Again</Button></Link>
            <Link href="/contact"><Button variant="outline">Contact Support</Button></Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.card}>
          <div className={styles.icon}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          </div>

          <h1 className={styles.title}>Order Placed Successfully!</h1>
          <p className={styles.message}>
            Thank you for shopping with BagShop! We've received your order and will send you a confirmation email shortly.
          </p>

          <div className={styles.orderId}>
             <div className={styles.orderIdLabel}>Order ID</div>
             <div className={styles.orderIdValue}>{orderId || 'BS-ERROR'}</div>
          </div>

          <div className={styles.actions}>
            <Link href="/shop">
              <Button variant="accent">Continue Shopping</Button>
            </Link>
            <Link href="/">
              <Button variant="outline">Back to Home</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}
