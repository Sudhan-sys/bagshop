'use client';

import { useState } from 'react';
import { updateOrderStatusAction } from '../actions';
import { formatPrice } from '@/lib/money';
import styles from '../admin.module.css';

const STATUS_COLORS = {
  pending: styles.badgeWarning,
  paid: styles.badgeSuccess,
  shipped: styles.badgeNeutral,
  delivered: styles.badgeSuccess,
  cancelled: styles.badgeError,
};

export default function OrderList({ initialOrders }) {
  const [updating, setUpdating] = useState(null);

  const handleStatusChange = async (orderId, newStatus) => {
    if (!confirm(`Change order status to ${newStatus}?`)) return;
    
    setUpdating(orderId);
    try {
      await updateOrderStatusAction(orderId, newStatus);
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
          <th>Order ID</th>
          <th>Customer</th>
          <th>Total</th>
          <th>Payment</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {initialOrders.map(order => (
          <tr key={order.id}>
            <td style={{ fontFamily: 'monospace' }}>{order.id}</td>
            <td>
              <div style={{ fontWeight: 500 }}>{order.customer_name}</div>
              <div style={{ fontSize: '0.8em', color: '#666' }}>{order.customer_email}</div>
            </td>
            <td>{formatPrice(order.total_amount)}</td>
            <td style={{ textTransform: 'uppercase' }}>{order.payment_method}</td>
            <td>
              <span className={`${styles.badge} ${STATUS_COLORS[order.status] || styles.badgeNeutral}`}>
                {order.status}
              </span>
            </td>
            <td>
              <select 
                className={styles.actionBtn}
                value="" 
                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                disabled={updating === order.id}
              >
                <option value="" disabled>Update Status</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
