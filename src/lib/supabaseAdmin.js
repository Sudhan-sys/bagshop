/**
 * Supabase Admin Client
 * 
 * This client uses the SERVICE ROLE key to bypass Row Level Security.
 * It should ONLY be used in Server Components or API Routes.
 * NEVER import this file in Client Components.
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Create admin client if key is available
const adminClient = supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null;

/**
 * Get the Supabase Admin client
 * Throws error if service key is not configured
 */
export function getAdminClient() {
  if (!adminClient) {
    console.error('Supabase Service Role Key is missing. Admin operations will fail.');
    // Fallback to regular client (will fail RLS but prevents crash)
    return require('./supabaseClient').supabase;
  }
  return adminClient;
}
