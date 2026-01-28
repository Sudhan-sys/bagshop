/**
 * Order Management Functions (Server-Side Only)
 * 
 * These functions handle order creation and should only be called
 * from server components or API routes, never from client-side code.
 * 
 * Security: Orders and customers are inserted server-side only.
 * Client-side code calls API routes which use these functions.
 */

import { supabase, isSupabaseConfigured } from './supabaseClient';

/**
 * Generate a unique order ID
 * @returns {string} Order ID in format BS{timestamp}
 */
export function generateOrderId() {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `BS${timestamp}${random}`;
}

/**
 * Create a customer record for guest checkout
 * @param {Object} customerData - Customer information
 * @returns {Promise<Object>} Created customer or error
 */
export async function createCustomer({
  email,
  firstName,
  lastName,
  phone,
  address,
}) {
  if (!isSupabaseConfigured()) {
    console.warn('[Orders] Supabase not configured, skipping customer creation');
    return { success: true, customerId: null };
  }

  try {
    // Check if customer already exists by email
    const { data: existingCustomer } = await supabase
      .from('customers')
      .select('id')
      .eq('email', email)
      .single();

    if (existingCustomer) {
      return { success: true, customerId: existingCustomer.id };
    }

    // Create new customer
    const { data, error } = await supabase
      .from('customers')
      .insert([{
        email,
        first_name: firstName,
        last_name: lastName,
        phone,
        shipping_address: address,
      }])
      .select('id')
      .single();

    if (error) {
      console.error('[Orders] Customer creation error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, customerId: data.id };
  } catch (err) {
    console.error('[Orders] Unexpected customer creation error:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Create a new order with order items
 * This function creates both the order and its items in a single transaction-like flow.
 * 
 * @param {Object} orderData - Order information
 * @param {string} orderData.orderId - Pre-generated order ID
 * @param {string} orderData.customerName - Customer full name
 * @param {string} orderData.customerEmail - Customer email
 * @param {string} orderData.customerPhone - Customer phone
 * @param {Object} orderData.shippingAddress - Shipping address object
 * @param {number} orderData.totalAmount - Order total
 * @param {string} orderData.paymentMethod - Payment method (cod, upi, card)
 * @param {Array} orderData.items - Cart items
 * @returns {Promise<Object>} Order creation result
 */
export async function createOrder({
  orderId,
  customerName,
  customerEmail,
  customerPhone,
  shippingAddress,
  totalAmount,
  paymentMethod,
  items,
}) {
  if (!isSupabaseConfigured()) {
    console.warn('[Orders] Supabase not configured, order will not be persisted');
    return { 
      success: true, 
      orderId,
      message: 'Order processed (database not configured)' 
    };
  }

  try {
    // 1. Create the order record
    const { error: orderError } = await supabase
      .from('orders')
      .insert([{
        id: orderId,
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        shipping_address: shippingAddress,
        total_amount: totalAmount,
        payment_method: paymentMethod,
        status: 'pending', // Initial status, will change after payment
      }]);

    if (orderError) {
      console.error('[Orders] Order creation error:', orderError);
      return { success: false, error: orderError.message };
    }

    // 2. Create order items (snapshot of cart at time of order)
    const orderItems = items.map(item => ({
      order_id: orderId,
      product_id: item.id || item.product_id,
      product_name: item.name,
      quantity: item.quantity || item.qty || 1,
      price: item.price,
      variant: item.variant || null,
      variant_id: item.variant_id || null,
      image_url: item.image || null,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error('[Orders] Order items creation error:', itemsError);
      // Attempt to clean up the order if items failed
      await supabase.from('orders').delete().eq('id', orderId);
      return { success: false, error: itemsError.message };
    }

    return { 
      success: true, 
      orderId,
      message: 'Order created successfully' 
    };
  } catch (err) {
    console.error('[Orders] Unexpected order creation error:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Update order status (for payment processing)
 * @param {string} orderId - Order ID
 * @param {string} status - New status (pending, paid, shipped, delivered, cancelled)
 * @param {Object} additionalData - Any additional data to update
 * @returns {Promise<Object>} Update result
 */
export async function updateOrderStatus(orderId, status, additionalData = {}) {
  if (!isSupabaseConfigured()) {
    return { success: true, message: 'Status update skipped (database not configured)' };
  }

  try {
    const { error } = await supabase
      .from('orders')
      .update({ 
        status, 
        ...additionalData,
        updated_at: new Date().toISOString() 
      })
      .eq('id', orderId);

    if (error) {
      console.error('[Orders] Status update error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, message: 'Status updated' };
  } catch (err) {
    console.error('[Orders] Unexpected status update error:', err);
    return { success: false, error: err.message };
  }
}
