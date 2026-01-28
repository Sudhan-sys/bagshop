'use client';

import { useActionState } from 'react';
import { updateProductDetails } from '../actions';

export default function DetailsForm({ productId, details }) {
  const [state, action, isPending] = useActionState(updateProductDetails, null);

  return (
    <form action={action} style={{ display: 'grid', gap: '24px', maxWidth: '700px' }}>
      <input type="hidden" name="id" value={productId} />
      
      {state?.success && (
        <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: '#dcfce7', color: '#166534' }}>
          ✅ {state.success}
        </div>
      )}

      <div>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>
          Description
        </label>
        <textarea
          name="description"
          rows={8}
          defaultValue={details.description || ''}
          placeholder="Describe your product in detail..."
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            fontSize: '15px',
            lineHeight: '1.6',
            outline: 'none',
            resize: 'vertical',
            color: '#1e293b'
          }}
        />
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>
          Product Highlights
        </label>
        <div style={{ 
          backgroundColor: '#f8fafc', 
          border: '1px solid #e2e8f0', 
          borderRadius: '8px',
          overflow: 'hidden' 
        }}>
          <div style={{ 
            padding: '8px 12px', 
            borderBottom: '1px solid #e2e8f0', 
            fontSize: '12px', 
            color: '#64748b',
            backgroundColor: '#f1f5f9'
          }}>
            Enter each highlight on a new line
          </div>
          <textarea
            name="highlights"
            rows={5}
            defaultValue={details.highlights?.join('\n') || ''}
            placeholder="• Water resistant material&#10;• 15-inch laptop sleeve&#10;• Ergonomic straps"
            style={{
              width: '100%',
              padding: '12px',
              border: 'none',
              fontSize: '14px',
              lineHeight: '1.8',
              outline: 'none',
              resize: 'vertical',
              color: '#1e293b'
            }}
          />
        </div>
      </div>

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
          {isPending ? 'Saving...' : 'Save Description'}
        </button>
      </div>
    </form>
  );
}
