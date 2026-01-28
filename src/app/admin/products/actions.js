'use server';

import { createClient } from '@supabase/supabase-js';
import { redirect } from 'next/navigation';

// Use Service Role for admin operations (bypasses RLS)
function getAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!serviceKey) {
    // Fallback to anon key if service key not set (will fail on RLS)
    console.warn('SUPABASE_SERVICE_ROLE_KEY not set - using anon key');
    return createClient(supabaseUrl, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  }
  
  return createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  });
}

export async function createProductAction(formData) {
  const supabase = getAdminClient();

  const title = formData.get('title');
  // Simple slugify
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  // 1. Create Core Product
  const { data: product, error } = await supabase
    .from('products')
    .insert({
      title,
      slug,
      status: 'draft'
    })
    .select()
    .single();

  if (error) {
    console.error('Create product error:', error);
    throw new Error(error.message);
  }

  // 2. Initialize Child Tables
  await Promise.all([
    supabase.from('product_details').insert({ product_id: product.id }),
    supabase.from('product_pricing').insert({ product_id: product.id, price: 0, mrp: 0 }),
    supabase.from('product_inventory').insert({ product_id: product.id, stock: 0 }),
  ]);

  redirect(`/admin/products/${product.id}/edit`);
}
