'use client';

import { useActionState } from 'react';
import { updateProductCore } from './actions';

export default function CoreForm({ product }) {
  const [state, action, isPending] = useActionState(updateProductCore, null);

  return (
    <form action={action} style={{ display: 'grid', gap: '24px', maxWidth: '600px' }}>
      <input type="hidden" name="id" value={product.id} />
      
      {state?.success && (
        <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: '#dcfce7', color: '#166534', fontSize: '14px' }}>
          ✅ {state.success}
        </div>
      )}

      <div>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>
          Product Title
        </label>
        <input
          type="text"
          name="title"
          defaultValue={product.title}
          style={{
            width: '100%',
            padding: '10px 14px',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            fontSize: '15px',
            outline: 'none',
            color: '#1e293b'
          }}
        />
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>
          URL Slug
        </label>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ 
            padding: '10px 14px', 
            backgroundColor: '#f1f5f9', 
            border: '1px solid #e2e8f0', 
            borderRight: 'none',
            borderRadius: '8px 0 0 8px',
            color: '#94a3b8',
            fontSize: '14px'
          }}>
            /product/
          </span>
          <input
            type="text"
            name="slug"
            defaultValue={product.slug}
            style={{
              flex: 1,
              padding: '10px 14px',
              borderRadius: '0 8px 8px 0',
              border: '1px solid #e2e8f0',
              fontSize: '15px',
              outline: 'none',
              color: '#1e293b'
            }}
          />
        </div>
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>
          Visibility Status
        </label>
        <select
          name="status"
          defaultValue={product.status}
          style={{
            width: '100%',
            padding: '10px 14px',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            fontSize: '15px',
            outline: 'none',
            backgroundColor: 'white',
            cursor: 'pointer'
          }}
        >
          <option value="draft">Draft (Private)</option>
          <option value="active">Active (Public)</option>
          <option value="inactive">Inactive (Hidden)</option>
          <option value="archived">Archived</option>
        </select>
        <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '6px' }}>
          Draft products are hidden from the store. Set to <strong>Active</strong> to publish.
        </p>
      </div>

      <div style={{ paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
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
            opacity: isPending ? 0.7 : 1,
            transition: 'all 0.2s'
          }}
        >
          {isPending ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}
