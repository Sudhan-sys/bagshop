'use server';

import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

// Use Service Role for admin operations (bypasses RLS)
function getAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!serviceKey) {
    console.warn('SUPABASE_SERVICE_ROLE_KEY not set');
    return createClient(supabaseUrl, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  }
  
  return createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  });
}

// 1. Core Update
export async function updateProductCore(prevState, formData) {
  const supabase = getAdminClient();

  const id = formData.get('id');
  const title = formData.get('title');
  const slug = formData.get('slug');
  const status = formData.get('status');

  const { error } = await supabase
    .from('products')
    .update({ title, slug, status, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) return { error: error.message };
  
  revalidatePath(`/admin/products/${id}/edit`);
  revalidatePath('/admin/products'); 
  revalidatePath('/'); // Refresh storefront
  return { success: 'Product updated!' };
}

// 2. Details Update
export async function updateProductDetails(prevState, formData) {
  const supabase = getAdminClient();

  const id = formData.get('id');
  const description = formData.get('description') || '';
  const highlightsRaw = formData.get('highlights') || '';
  const highlights = highlightsRaw.split('\n').filter(Boolean); 

  const { error } = await supabase
    .from('product_details')
    .upsert({ 
      product_id: id, 
      description, 
      highlights, 
      updated_at: new Date().toISOString() 
    });

  if (error) return { error: error.message };
  
  revalidatePath(`/admin/products/${id}/edit/details`);
  return { success: 'Details updated!' };
}

// 3. Pricing Update
export async function updateProductPricing(prevState, formData) {
  const supabase = getAdminClient();

  const id = formData.get('id');
  const price = Number(formData.get('price'));
  const mrp = Number(formData.get('mrp'));

  if (price > mrp) {
    return { error: 'Sale price cannot be higher than MRP' };
  }

  const { error } = await supabase
    .from('product_pricing')
    .upsert({ 
      product_id: id,
      price,
      mrp,
      updated_at: new Date().toISOString()
    });

  if (error) return { error: error.message };
  
  revalidatePath(`/admin/products/${id}/edit/pricing`);
  revalidatePath('/'); // Refresh storefront
  return { success: 'Pricing updated!' };
}

// 4. Inventory Update
export async function updateProductInventory(prevState, formData) {
  const supabase = getAdminClient();

  const id = formData.get('id');
  const stock = Number(formData.get('stock'));
  const low_stock_threshold = Number(formData.get('threshold')) || 5;
  const sku = formData.get('sku') || '';

  const { error } = await supabase
    .from('product_inventory')
    .upsert({ 
      product_id: id,
      stock,
      low_stock_threshold,
      sku,
      updated_at: new Date().toISOString()
    });

  if (error) return { error: error.message };
  
  revalidatePath(`/admin/products/${id}/edit/inventory`);
  return { success: 'Inventory updated!' };
}

// 5. Image Actions
export async function addProductImage({ productId, imageUrl }) {
  const supabase = getAdminClient();

  const { error } = await supabase.from('product_images').insert({
    product_id: productId,
    image_url: imageUrl,
    is_primary: false,
  });

  if (error) throw new Error(error.message);
  revalidatePath(`/admin/products/${productId}/edit/images`);
}

export async function setPrimaryImage({ imageId, productId }) {
  const supabase = getAdminClient();

  await supabase
    .from('product_images')
    .update({ is_primary: false })
    .eq('product_id', productId);

  await supabase
    .from('product_images')
    .update({ is_primary: true })
    .eq('id', imageId);

  revalidatePath(`/admin/products/${productId}/edit/images`);
}

export async function deleteProductImage({ imageId, productId }) {
  const supabase = getAdminClient();

  await supabase.from('product_images').delete().eq('id', imageId);
  revalidatePath(`/admin/products/${productId}/edit/images`);
}
