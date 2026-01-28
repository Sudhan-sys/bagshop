export const dynamic = 'force-dynamic';

import { getAdminClient } from '@/lib/supabaseAdmin';
import { formatPrice } from '@/lib/money';
import styles from '../admin.module.css';

async function getStats() {
  const supabase = getAdminClient();
  
  try {
    const { data: orders, error: ordersError } = await supabase.from('orders').select('*');
    if (ordersError) throw ordersError;
    
    // Get exact count of products
    const { count: productCount, error: productsError } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });
      
    if (productsError) throw productsError;
    
    // Calculate stats
    const totalRevenue = orders?.reduce((sum, order) => {
      // Only count paid/delivered/shipped revenue
      const validStatuses = ['paid', 'shipped', 'delivered'];
      return validStatuses.includes(order.status) ? sum + Number(order.total_amount) : sum;
    }, 0) || 0;

    const pendingOrders = orders?.filter(o => o.status === 'pending').length || 0;

    return {
      orderCount: orders?.length || 0,
      productCount: productCount || 0,
      totalRevenue,
      pendingOrders
    };
  } catch (error) {
    console.error('Admin Dashboard Load Error:', error);
    return null; // Return null to indicate error
  }
}

export default async function AdminDashboard() {
  const stats = await getStats();

  if (!stats) {
    return (
      <div className={styles.card} style={{ padding: '2rem', textAlign: 'center' }}>
        <h2 style={{ color: '#ef4444' }}>Unable to load dashboard data</h2>
        <p style={{ marginTop: '1rem', color: '#666' }}>
          Please make sure your <code>SUPABASE_SERVICE_ROLE_KEY</code> is correctly set in <code>.env.local</code>.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.heading}>Dashboard Overview</h1>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <StatCard title="Total Revenue" value={formatPrice(stats.totalRevenue)} color="green" />
        <StatCard title="Total Orders" value={stats.orderCount} />
        <StatCard title="Pending Orders" value={stats.pendingOrders} color="orange" />
        <StatCard title="Total Products" value={stats.productCount} />
      </div>

      <div className={styles.card}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #f0f0f0' }}>
          <h3 style={{ margin: 0 }}>Recent Activity</h3>
        </div>
        <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
          Welcome to your BagShop admin panel.
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, color }) {
  const colors = {
    green: { bg: '#dcfce7', text: '#166534' },
    orange: { bg: '#ffedd5', text: '#9a3412' },
    blue: { bg: '#dbeafe', text: '#1e40af' },
    default: { bg: 'white', text: '#1a1a1a' }
  };
  
  const theme = colors[color] || colors.default;

  return (
    <div className={styles.card} style={{ padding: '1.5rem' }}>
      <p style={{ color: '#666', fontSize: '0.875rem', marginBottom: '0.5rem' }}>{title}</p>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: theme.text }}>{value}</h2>
    </div>
  );
}
