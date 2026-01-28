'use client';

import { useActionState } from 'react';
import { updateProductInventory } from '../actions';

export default function InventoryForm({ productId, inventory }) {
  const [state, action, isPending] = useActionState(updateProductInventory, null);

  return (
    <form action={action} style={{ display: 'grid', gap: '24px', maxWidth: '500px' }}>
      <input type="hidden" name="id" value={productId} />
      
      {state?.success && (
        <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: '#dcfce7', color: '#166534' }}>
          ✅ {state.success}
        </div>
      )}

      <div>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>
          SKU (Stock Keeping Unit)
        </label>
        <input
          type="text"
          name="sku"
          defaultValue={inventory.sku || ''}
          placeholder="BAG-PRO-001"
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
          Stock Quantity
        </label>
        <input
          type="number"
          name="stock"
          defaultValue={inventory.stock || 0}
          min="0"
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
        <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '6px' }}>
          Set to 0 to mark as "Out of Stock".
        </p>
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>
          Low Stock Threshold
        </label>
        <input
          type="number"
          name="threshold"
          defaultValue={inventory.low_stock_threshold || 5}
          min="0"
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
        <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '6px' }}>
          Alerts you when stock dips below this number.
        </p>
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
          {isPending ? 'Saving...' : 'Save Inventory'}
        </button>
      </div>
    </form>
  );
}
