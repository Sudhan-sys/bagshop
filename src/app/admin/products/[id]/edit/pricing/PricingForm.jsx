'use client';

import { useActionState } from 'react';
import { updateProductPricing } from '../actions';
import { useState } from 'react';

export default function PricingForm({ productId, pricing }) {
  const [state, action, isPending] = useActionState(updateProductPricing, null);
  const [price, setPrice] = useState(pricing.price || 0);
  const [mrp, setMrp] = useState(pricing.mrp || 0);

  const discount = mrp > 0 && price < mrp ? Math.round(((mrp - price) / mrp) * 100) : 0;

  return (
    <form action={action} style={{ display: 'grid', gap: '24px', maxWidth: '500px' }}>
      <input type="hidden" name="id" value={productId} />
      
      {state?.success && (
        <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: '#dcfce7', color: '#166534' }}>
          ✅ {state.success}
        </div>
      )}
      {state?.error && (
        <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: '#fee2e2', color: '#dc2626' }}>
          ⚠️ {state.error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>
            MRP (Market Price)
          </label>
          <div style={{ position: 'relative' }}>
            <span style={{ 
              position: 'absolute', 
              left: '12px', 
              top: '50%', 
              transform: 'translateY(-50%)', 
              color: '#94a3b8',
              fontWeight: 500
            }}>₹</span>
            <input
              type="number"
              name="mrp"
              value={mrp}
              onChange={(e) => setMrp(e.target.value)}
              min="0"
              style={{
                width: '100%',
                padding: '10px 10px 10px 28px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                fontSize: '16px',
                outline: 'none',
                color: '#1e293b',
                fontWeight: 600
              }}
            />
          </div>
        </div>

        <div>
           <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>
            Selling Price
          </label>
          <div style={{ position: 'relative' }}>
            <span style={{ 
              position: 'absolute', 
              left: '12px', 
              top: '50%', 
              transform: 'translateY(-50%)', 
              color: '#94a3b8',
              fontWeight: 500
            }}>₹</span>
            <input
              type="number"
              name="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              min="0"
              style={{
                width: '100%',
                padding: '10px 10px 10px 28px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                fontSize: '16px',
                outline: 'none',
                color: '#1e293b',
                fontWeight: 600
              }}
            />
          </div>
        </div>
      </div>

      {discount > 0 && (
         <div style={{ 
          padding: '16px', 
          backgroundColor: '#eff6ff', 
          borderRadius: '8px', 
          border: '1px solid #dbeafe',
          color: '#1e40af',
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>🏷️</span>
          <span>Customer saves <strong>{discount}%</strong> off MRP with this pricing.</span>
        </div>
      )}

      <div style={{ paddingTop: '16px' }}>
        <button
          type="submit"
          disabled={isPending}
          style={{
            padding: '12px 24px',
            backgroundColor: '#1e293b',
            color: 'white',
            borderRadius: '8px',
            border: 'none',
            fontSize: '14px',
            fontWeight: '600',
            cursor: isPending ? 'wait' : 'pointer',
            opacity: isPending ? 0.7 : 1
          }}
        >
          {isPending ? 'Saving...' : 'Save Pricing'}
        </button>
      </div>
    </form>
  );
}
