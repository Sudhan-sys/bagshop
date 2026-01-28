'use client';

import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { formatPrice } from '@/lib/money';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import styles from '../account.module.css';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  useEffect(() => {
    const fetchOrders = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            name:product_name
          )
        `)
        .eq('customer_email', user.email) // Linking by email for now (simple MVP)
        .order('created_at', { ascending: false });

      if (error) console.error('Error fetching orders:', error);
      else setOrders(data || []);
      
      setLoading(false);
    };

    fetchOrders();
  }, [supabase]);

  if (loading) return <div>Loading orders...</div>;

  if (orders.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', border: '1px solid #e5e5e5', borderRadius: '12px' }}>
        <h2 style={{ marginBottom: '16px' }}>No orders yet</h2>
        <p style={{ color: '#666', marginBottom: '24px' }}>Once you place an order, it will appear here.</p>
        <Link href="/shop">
          <Button variant="accent">Start Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.ordersList}>
      {orders.map((order) => (
        <div key={order.id} className={styles.orderCard}>
          <div className={styles.orderHeader}>
            <div className={styles.orderMeta}>
              <div className={styles.metaGroup}>
                <span className={styles.metaLabel}>Order Placed</span>
                <span className={styles.metaValue}>
                  {new Date(order.created_at).toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'long', year: 'numeric'
                  })}
                </span>
              </div>
              <div className={styles.metaGroup}>
                <span className={styles.metaLabel}>Total</span>
                <span className={styles.metaValue}>{formatPrice(order.total_amount)}</span>
              </div>
              <div className={styles.metaGroup}>
                <span className={styles.metaLabel}>Order #</span>
                <span className={styles.metaValue}>{order.id}</span>
              </div>
            </div>
            
            <div className={`${styles.statusBadge} ${styles[`status_${order.status}`] || styles.status_pending}`}>
              {order.status.replace('_', ' ')}
            </div>
          </div>

          <div className={styles.orderBody}>
            <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '8px' }}>
              {order.order_items?.map((item, idx) => (
                <div key={idx} style={{ flexShrink: 0, width: '80px' }}>
                  <div style={{ 
                    width: '80px', height: '80px', 
                    background: '#f5f5f5', borderRadius: '8px', 
                    marginBottom: '8px', overflow: 'hidden' 
                  }}>
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🎒</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: '16px', display: 'flex', gap: '12px' }}>
               {/* Placeholders for future View Details / Track Order features */}
               <Button variant="outline" size="sm">View Invoice</Button>
               {order.status === 'shipped' && (
                 <Button variant="accent" size="sm">Track Package</Button>
               )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
