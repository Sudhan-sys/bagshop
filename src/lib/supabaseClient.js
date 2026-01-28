/**
 * Supabase Client Configuration
 * 
 * Creates and exports a reusable Supabase client instance.
 * Uses environment variables for credentials.
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl) {
  console.warn('[Supabase] NEXT_PUBLIC_SUPABASE_URL is not set');
}
if (!supabaseAnonKey) {
  console.warn('[Supabase] NEXT_PUBLIC_SUPABASE_ANON_KEY is not set');
}

// Create and export the Supabase client
// We return null if keys are missing to prevent createClient from throwing "supabaseUrl is required" during build
export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false, // No auth needed for public reads
      },
    })
  : null;

/**
 * Helper to check if Supabase is properly configured
 * @returns {boolean}
 */
export function isSupabaseConfigured() {
  return Boolean(supabaseUrl && supabaseAnonKey);
}

/**
 * Get public URL for a file in Supabase Storage
 * @param {string} bucket - Storage bucket name
 * @param {string} path - File path within the bucket
 * @returns {string} Public URL
 */
export function getStorageUrl(bucket, path) {
  if (!supabaseUrl) return '';
  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`;
}
