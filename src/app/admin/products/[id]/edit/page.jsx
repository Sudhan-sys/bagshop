import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';
import ProductEditor from './ProductEditor';

export const dynamic = 'force-dynamic';

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export default async function EditProductPage({ params }) {
  const { id } = await params;
  const supabase = getAdminClient();

  // Parallel Fetching for maximum speed
  const [
    { data: product },
    { data: details },
    { data: pricing },
    { data: inventory },
    { data: images }
  ] = await Promise.all([
    supabase.from('products').select('*').eq('id', id).single(),
    supabase.from('product_details').select('*').eq('product_id', id).single(),
    supabase.from('product_pricing').select('*').eq('product_id', id).single(),
    supabase.from('product_inventory').select('*').eq('product_id', id).single(),
    supabase.from('product_images').select('*').eq('product_id', id).order('sort_order').order('created_at', { ascending: false })
  ]);

  if (!product) {
    notFound();
  }

  return (
    <ProductEditor 
      product={product} 
      details={details} 
      pricing={pricing} 
      inventory={inventory} 
      images={images} 
    />
  );
}
