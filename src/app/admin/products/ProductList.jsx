'use client';

import { useState } from 'react';
import { toggleProductStock } from '../actions';
import { formatPrice } from '@/lib/money';
import styles from '../admin.module.css';

export default function ProductList({ initialProducts }) {
  const [updating, setUpdating] = useState(null);

  const handleToggle = async (id, currentStatus) => {
    setUpdating(id);
    try {
      await toggleProductStock(id, currentStatus);
    } catch (e) {
      alert('Failed to update');
    } finally {
      setUpdating(null);
    }
  };

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Name</th>
          <th>Category</th>
          <th>Price</th>
          <th>Stock Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {initialProducts.map(product => (
          <tr key={product.id}>
            <td style={{ fontWeight: 500 }}>{product.name}</td>
            <td style={{ textTransform: 'capitalize' }}>{product.category}</td>
            <td>{formatPrice(product.price)}</td>
            <td>
              <span className={`${styles.badge} ${product.in_stock ? styles.badgeSuccess : styles.badgeError}`}>
                {product.in_stock ? 'In Stock' : 'Out of Stock'}
              </span>
            </td>
            <td>
              <button 
                className={styles.actionBtn}
                onClick={() => handleToggle(product.id, product.in_stock)}
                disabled={updating === product.id}
              >
                {updating === product.id ? '...' : (product.in_stock ? 'Mark OOS' : 'Mark In Stock')}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
