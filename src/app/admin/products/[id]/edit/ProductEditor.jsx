'use client';

import { useState } from 'react';
import CoreForm from './CoreForm';
import DetailsForm from './details/DetailsForm';
import PricingForm from './pricing/PricingForm';
import InventoryForm from './inventory/InventoryForm';
import ImageManager from './images/ImageManager';
import Link from 'next/link';

export default function ProductEditor({ product, details, pricing, inventory, images }) {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'details', label: 'Details' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'inventory', label: 'Inventory' },
    { id: 'images', label: 'Images' },
  ];

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
           <Link 
            href="/admin/products" 
            style={{ 
              color: '#64748b', 
              textDecoration: 'none', 
              fontSize: '13px', 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '4px',
              fontWeight: 500,
              marginBottom: '4px'
            }}
          >
            ← Back to Products
          </Link>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1e293b' }}>
            Edit Product
          </h1>
        </div>
        <div style={{ 
          padding: '6px 12px', 
          backgroundColor: product.status === 'active' ? '#dcfce7' : '#f1f5f9',
          color: product.status === 'active' ? '#166534' : '#475569',
          borderRadius: '20px',
          fontSize: '13px',
          fontWeight: '600',
          textTransform: 'capitalize'
        }}>
          {product.status}
        </div>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        
        {/* Instant Tabs */}
        <div style={{ 
          display: 'flex', 
          borderBottom: '1px solid #e2e8f0', 
          backgroundColor: '#f8fafc',
          gap: '8px',
          padding: '0 16px'
        }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '16px 12px',
                color: activeTab === tab.id ? '#d4a853' : '#64748b',
                borderBottom: activeTab === tab.id ? '2px solid #d4a853' : '2px solid transparent',
                background: 'none',
                borderTop: 'none',
                borderLeft: 'none',
                borderRight: 'none',
                fontSize: '14px',
                fontWeight: activeTab === tab.id ? '600' : '500',
                cursor: 'pointer',
                marginBottom: '-1px',
                transition: 'all 0.2s'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
        
        {/* Content Area */}
        <div style={{ padding: '32px' }}>
          
          {activeTab === 'overview' && (
            <div>
              <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b' }}>Global Settings</h2>
                <p style={{ color: '#64748b', fontSize: '14px' }}>Manage the core identity of your product.</p>
              </div>
              <CoreForm product={product} />
            </div>
          )}

          {activeTab === 'details' && (
            <div>
              <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b' }}>Product Description</h2>
                <p style={{ color: '#64748b', fontSize: '14px' }}>Add detailed information to help customers decide.</p>
              </div>
              <DetailsForm productId={product.id} details={details || {}} />
            </div>
          )}

          {activeTab === 'pricing' && (
            <div>
              <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b' }}>Pricing Strategy</h2>
                <p style={{ color: '#64748b', fontSize: '14px' }}>Set your competitive pricing.</p>
              </div>
              <PricingForm productId={product.id} pricing={pricing || {}} />
            </div>
          )}

          {activeTab === 'inventory' && (
             <div>
              <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b' }}>Inventory Management</h2>
                <p style={{ color: '#64748b', fontSize: '14px' }}>Track stock levels and SKUs.</p>
              </div>
              <InventoryForm productId={product.id} inventory={inventory || {}} />
            </div>
          )}

          {activeTab === 'images' && (
            <div>
              <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b' }}>Product Gallery</h2>
                <p style={{ color: '#64748b', fontSize: '14px' }}>Upload visuals. The primary image will be the cover.</p>
              </div>
              <ImageManager productId={product.id} initialImages={images || []} />
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
