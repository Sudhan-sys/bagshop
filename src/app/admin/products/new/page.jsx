'use client';

import { createProductAction } from '../actions';
import Link from 'next/link';

export default function NewProductPage() {
  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <Link 
          href="/admin/products" 
          style={{ 
            color: '#64748b', 
            textDecoration: 'none', 
            fontSize: '14px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            marginBottom: '8px'
          }}
        >
          ← Back to Products
        </Link>
        <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1e293b' }}>
          Create New Product
        </h1>
      </div>

      {/* Form Card */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '32px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        maxWidth: '500px'
      }}>
        <form action={createProductAction}>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ 
              display: 'block', 
              fontSize: '14px', 
              fontWeight: '500', 
              color: '#374151',
              marginBottom: '8px'
            }}>
              Product Title *
            </label>
            <input
              type="text"
              name="title"
              required
              placeholder="e.g. Urban Commuter Backpack"
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '15px',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
            />
            <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: '8px' }}>
              This will be the main name shown to customers.
            </p>
          </div>

          <div style={{ 
            backgroundColor: '#f8fafc', 
            padding: '16px', 
            borderRadius: '8px',
            marginBottom: '24px'
          }}>
            <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
              💡 The product will be created as a <strong>Draft</strong>. You can add pricing, 
              inventory, and images in the next step before publishing.
            </p>
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '14px 24px',
              backgroundColor: '#d4a853',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Create Product & Continue →
          </button>
        </form>
      </div>
    </div>
  );
}
