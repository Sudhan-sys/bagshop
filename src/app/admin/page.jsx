import { getAdminClient } from '@/lib/supabaseAdmin';
import { formatPrice } from '@/lib/money';

export const dynamic = 'force-dynamic';

async function getStats() {
  const supabase = getAdminClient();
  try {
    const { data: orders } = await supabase.from('orders').select('*');
    const { count: productCount } = await supabase.from('products').select('*', { count: 'exact', head: true });
    
    const totalRevenue = orders?.reduce((sum, order) => {
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
    console.error('Stats error:', error);
    return { orderCount: 0, productCount: 0, totalRevenue: 0, pendingOrders: 0 };
  }
}

export default async function AdminDashboard() {
  const stats = await getStats();

  const statCards = [
    { 
      label: 'Total Revenue', 
      value: formatPrice(stats.totalRevenue), 
      icon: '💰',
      color: '#10b981',
      bgColor: '#d1fae5'
    },
    { 
      label: 'Total Orders', 
      value: stats.orderCount, 
      icon: '📦',
      color: '#3b82f6',
      bgColor: '#dbeafe'
    },
    { 
      label: 'Pending Orders', 
      value: stats.pendingOrders, 
      icon: '⏳',
      color: '#f59e0b',
      bgColor: '#fef3c7'
    },
    { 
      label: 'Total Products', 
      value: stats.productCount, 
      icon: '🛍️',
      color: '#8b5cf6',
      bgColor: '#ede9fe'
    },
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1e293b', marginBottom: '8px' }}>
          Dashboard
        </h1>
        <p style={{ color: '#64748b', fontSize: '14px' }}>
          Welcome back! Here&apos;s what&apos;s happening with your store.
        </p>
      </div>

      {/* Stats Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
        gap: '24px',
        marginBottom: '32px'
      }}>
        {statCards.map((stat) => (
          <div 
            key={stat.label}
            style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '16px'
            }}
          >
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '12px',
              backgroundColor: stat.bgColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px'
            }}>
              {stat.icon}
            </div>
            <div>
              <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '4px' }}>
                {stat.label}
              </div>
              <div style={{ fontSize: '28px', fontWeight: '700', color: stat.color }}>
                {stat.value}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b', marginBottom: '16px' }}>
          Quick Actions
        </h2>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <QuickActionButton href="/admin/products/new" label="Add New Product" icon="➕" />
          <QuickActionButton href="/admin/orders" label="View Orders" icon="📋" />
          <QuickActionButton href="/" label="View Store" icon="🏪" />
        </div>
      </div>
    </div>
  );
}

function QuickActionButton({ href, label, icon }) {
  return (
    <a 
      href={href}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '12px 20px',
        backgroundColor: '#f1f5f9',
        color: '#475569',
        borderRadius: '8px',
        textDecoration: 'none',
        fontSize: '14px',
        fontWeight: '500',
        transition: 'all 0.2s'
      }}
    >
      <span>{icon}</span>
      {label}
    </a>
  );
}
