import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import InventoryForm from './InventoryForm';

export const dynamic = 'force-dynamic';

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export default async function EditInventoryPage({ params }) {
  const { id } = await params;
  const supabase = getAdminClient();

  const { data: inventory } = await supabase
    .from('product_inventory')
    .select('*')
    .eq('product_id', id)
    .single();

  const { data: product } = await supabase.from('products').select('title, status').eq('id', id).single();

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
           <Link href="/admin/products" style={{ color: '#64748b', textDecoration: 'none', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 500, marginBottom: '4px' }}>
            ← Back to Products
          </Link>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1e293b' }}>
            Edit Product
          </h1>
        </div>
        <div style={{ padding: '6px 12px', backgroundColor: product?.status === 'active' ? '#dcfce7' : '#f1f5f9', color: product?.status === 'active' ? '#166534' : '#475569', borderRadius: '20px', fontSize: '13px', fontWeight: '600', textTransform: 'capitalize' }}>
          {product?.status || 'Active'}
        </div>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        <Tabs productId={id} />
        
        <div style={{ padding: '32px' }}>
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b' }}>Inventory Management</h2>
            <p style={{ color: '#64748b', fontSize: '14px' }}>Track stock levels and SKUs.</p>
          </div>
          <InventoryForm productId={id} inventory={inventory || {}} />
        </div>
      </div>
    </div>
  );
}

function Tabs({ productId }) {
  const tabs = [
    { label: 'Overview', href: `/admin/products/${productId}/edit` },
    { label: 'Details', href: `/admin/products/${productId}/edit/details` },
    { label: 'Pricing', href: `/admin/products/${productId}/edit/pricing` },
    { label: 'Inventory', href: `/admin/products/${productId}/edit/inventory`, active: true },
    { label: 'Images', href: `/admin/products/${productId}/edit/images` },
  ];

  return (
    <div style={{ 
      display: 'flex', 
      borderBottom: '1px solid #e2e8f0', 
      backgroundColor: '#f8fafc',
      gap: '8px',
      padding: '0 16px'
    }}>
      {tabs.map((tab) => (
        <Link
          key={tab.label}
          href={tab.href}
          style={{
            padding: '16px 12px',
            color: tab.active ? '#d4a853' : '#64748b',
            borderBottom: tab.active ? '2px solid #d4a853' : '2px solid transparent',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: '600',
            whiteSpace: 'nowrap',
            marginBottom: '-1px'
          }}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
}
