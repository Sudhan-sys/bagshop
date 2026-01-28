export const dynamic = 'force-dynamic';

import { getAdminClient } from '@/lib/supabaseAdmin';
import OrderList from './OrderList';
import styles from '../admin.module.css';

async function getOrders() {
  const supabase = getAdminClient();
  try {
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return orders;
  } catch (error) {
    console.error('Orders Load Error:', error);
    return null;
  }
}

export default async function AdminOrders() {
  const orders = await getOrders();

  if (!orders) {
    return (
      <div className={styles.card} style={{ padding: '2rem', textAlign: 'center' }}>
        <h2 style={{ color: '#ef4444' }}>Unable to load orders</h2>
        <p style={{ marginTop: '1rem', color: '#666' }}>
          Please make sure your <code>SUPABASE_SERVICE_ROLE_KEY</code> is correctly set.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.heading}>Orders Management</h1>
      </div>
      
      <div className={styles.card}>
        <OrderList initialOrders={orders || []} />
      </div>
    </div>
  );
}
