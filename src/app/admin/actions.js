'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { revalidatePath } from 'next/cache';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

/**
 * Attempt to login as admin
 */
export async function loginAction(prevState, formData) {
  const password = formData.get('password');

  if (password === ADMIN_PASSWORD) {
    const cookieStore = await cookies();
    cookieStore.set('admin_session', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
    });
    
    redirect('/admin/dashboard');
  } else {
    return { error: 'Invalid password' };
  }
}

/**
 * Logout admin
 */
export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete('admin_session');
  redirect('/admin/login');
}

/**
 * Toggle product stock status
 */
export async function toggleProductStock(id, currentStatus) {
  const { error } = await supabase
    .from('products')
    .update({ in_stock: !currentStatus })
    .eq('id', id);

  if (error) {
    console.error('Stock update failed:', error);
    throw new Error('Failed to update stock');
  }
  revalidatePath('/admin/products');
}

/**
 * Update order status
 */
export async function updateOrderStatusAction(orderId, status) {
  const { error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId);

  if (error) {
    console.error('Order update failed:', error);
    throw new Error('Failed to update order');
  }
  revalidatePath('/admin/orders');
}
