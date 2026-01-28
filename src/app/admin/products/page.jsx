import { supabase } from '@/lib/supabaseClient';
import { formatPrice } from '@/lib/money';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
  const { data: products } = await supabase
    .from('products')
    .select(`
      *,
      product_pricing(price, mrp),
      product_inventory(stock)
    `)
    .order('created_at', { ascending: false });

  const statusColors = {
    active: { bg: '#d1fae5', text: '#065f46' },
    draft: { bg: '#fef3c7', text: '#92400e' },
    inactive: { bg: '#f1f5f9', text: '#475569' },
    archived: { bg: '#fee2e2', text: '#991b1b' },
  };

  return (
    <div>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '32px'
      }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1e293b', marginBottom: '8px' }}>
            Products
          </h1>
          <p style={{ color: '#64748b', fontSize: '14px' }}>
            Manage your product catalog
          </p>
        </div>
        <Link
          href="/admin/products/new"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 24px',
            backgroundColor: '#1e293b',
            color: 'white',
            borderRadius: '8px',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          ➕ Add Product
        </Link>
      </div>

      {/* Products Table */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        {products?.length === 0 ? (
          <div style={{ padding: '64px', textAlign: 'center', color: '#64748b' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📦</div>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b', marginBottom: '8px' }}>
              No products yet
            </h3>
            <p style={{ marginBottom: '24px' }}>Get started by adding your first product.</p>
            <Link
              href="/admin/products/new"
              style={{
                display: 'inline-flex',
                padding: '12px 24px',
                backgroundColor: '#d4a853',
                color: 'white',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: '500'
              }}
            >
              Add Your First Product
            </Link>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc' }}>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Product</th>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Status</th>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Price</th>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Stock</th>
                <th style={{ padding: '16px 24px', textAlign: 'right', fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products?.map((product) => {
                const colors = statusColors[product.status] || statusColors.draft;
                return (
                  <tr key={product.id} style={{ borderTop: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '20px 24px' }}>
                      <div style={{ fontWeight: '600', color: '#1e293b', marginBottom: '4px' }}>
                        {product.title}
                      </div>
                      <div style={{ fontSize: '13px', color: '#94a3b8' }}>
                        /{product.slug}
                      </div>
                    </td>
                    <td style={{ padding: '20px 24px' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '4px 12px',
                        borderRadius: '999px',
                        fontSize: '12px',
                        fontWeight: '600',
                        backgroundColor: colors.bg,
                        color: colors.text,
                        textTransform: 'capitalize'
                      }}>
                        {product.status}
                      </span>
                    </td>
                    <td style={{ padding: '20px 24px', color: '#1e293b', fontWeight: '500' }}>
                      {formatPrice(product.product_pricing?.price || 0)}
                    </td>
                    <td style={{ padding: '20px 24px', color: '#64748b' }}>
                      {product.product_inventory?.stock || 0} units
                    </td>
                    <td style={{ padding: '20px 24px', textAlign: 'right' }}>
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        style={{
                          display: 'inline-flex',
                          padding: '8px 16px',
                          backgroundColor: '#f1f5f9',
                          color: '#475569',
                          borderRadius: '6px',
                          textDecoration: 'none',
                          fontSize: '13px',
                          fontWeight: '500'
                        }}
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
