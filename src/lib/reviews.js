
import { supabase } from './supabaseClient';

export async function fetchReviews(productId) {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('product_id', productId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }
  return data;
}

export async function submitReview(review) {
  const { data, error } = await supabase
    .from('reviews')
    .insert([review])
    .select()
    .single();

  if (error) {
    throw error;
  }
  return data;
}
