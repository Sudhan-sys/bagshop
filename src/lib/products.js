/**
 * Product Fetching Functions (Updated for New Schema)
 * 
 * Maps normalized DB tables (products, pricing, images) 
 * to the flat object structure expected by the Storefront UI.
 */

import { supabase, isSupabaseConfigured } from './supabaseClient';
import { products as fallbackProducts } from '@/data/products';

/**
 * Fetch all active products
 */
export async function fetchProducts({
  category = null,
  sortBy = 'created_at',
  sortOrder = 'desc',
  limit = 50,
} = {}) {
  try {
    // 1. Fetch from new normalized tables
    let query = supabase
      .from('products')
      .select(`
        id, title, slug, status, created_at,
        product_pricing!inner(price, mrp),
        product_inventory(stock),
        product_images(image_url, is_primary, sort_order),
        product_details(description, highlights, specifications)
      `)
      .eq('status', 'active') // Only showing active
      .order(sortBy === 'price' ? 'product_pricing(price)' : 'created_at', { ascending: sortOrder === 'asc' })
      .limit(limit);

    const { data, error } = await query;

    if (error) {
      console.warn('[Products] DB Fetch Error (falling back):', error.message);
      return fallbackProducts; 
    }

    if (!data || data.length === 0) return fallbackProducts; // Use fallback if DB empty

    // 2. Transform to match Storefront UI format
    return data.map(transformNewProduct);
  } catch (err) {
    console.error('[Products] Unexpected error:', err);
    return fallbackProducts;
  }
}

/**
 * Fetch single product by slug
 */
export async function fetchProductBySlug(slug) {
  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        id, title, slug, status,
        product_pricing!inner(price, mrp),
        product_inventory(stock),
        product_images(image_url, is_primary, sort_order),
        product_details(description, highlights, specifications)
      `)
      .eq('slug', slug)
      .eq('status', 'active')
      .single();

    if (error || !data) return null;

    return transformNewProduct(data);
  } catch (err) {
    return null;
  }
}

/**
 * Fetch featured products (first 4 active products)
 */
export async function fetchFeaturedProducts() {
  const products = await fetchProducts({ limit: 4 });
  return products;
}

/**
 * Fetch new arrivals (latest 8 active products)
 */
export async function fetchNewArrivals() {
  const products = await fetchProducts({ sortBy: 'created_at', sortOrder: 'desc', limit: 8 });
  return products;
}

/**
 * Fetch related products (same category, excluding current)
 */
export async function fetchRelatedProducts(category, currentProductId, limit = 4) {
  // For MVP, just return other active products since we don't have categories yet
  const products = await fetchProducts({ limit: limit + 1 });
  return products.filter(p => p.id !== currentProductId).slice(0, limit);
}
function transformNewProduct(p) {
  // Safe extraction of relations (they might be null if join failed or no data)
  const pricing = p.product_pricing || { price: 0, mrp: 0 };
  const inventory = p.product_inventory || { stock: 0 };
  const details = p.product_details || { description: '', highlights: [], specifications: {} };
  
  // Images logic
  const sortedImages = p.product_images?.sort((a,b) => a.sort_order - b.sort_order) || [];
  const primaryImg = sortedImages.find(i => i.is_primary)?.image_url || sortedImages[0]?.image_url || '/images/placeholder.svg';
  const allImages = sortedImages.map(i => i.image_url);

  return {
    id: p.id,
    name: p.title || 'Untitled Product',
    slug: p.slug,
    price: pricing.price || 0,
    originalPrice: pricing.mrp || 0,
    description: details.description || '',
    highlights: details.highlights || [],
    specs: details.specifications || {},
    images: allImages.length > 0 ? allImages : [primaryImg],
    cutoutImage: primaryImg,
    colors: [],
    inStock: (inventory.stock || 0) > 0,
    rating: 4.8, // Default rating
    reviewCount: 0,
    badge: null,
    category: 'bags', // Placeholder
  };
}
