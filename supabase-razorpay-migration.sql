-- =====================================================
-- Add Razorpay Payment Fields to Orders Table
-- Run this SQL in Supabase SQL Editor after the initial schema
-- =====================================================

-- Add Razorpay payment tracking columns
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS razorpay_order_id TEXT,
ADD COLUMN IF NOT EXISTS razorpay_payment_id TEXT;

-- Create index for payment lookups
CREATE INDEX IF NOT EXISTS idx_orders_razorpay_order ON orders(razorpay_order_id);
CREATE INDEX IF NOT EXISTS idx_orders_razorpay_payment ON orders(razorpay_payment_id);

-- Update RLS policy to allow updating orders (for payment status)
-- First drop existing policy if exists, then create new one
DROP POLICY IF EXISTS "Orders can be updated by anyone" ON orders;

CREATE POLICY "Orders can be updated by anyone" 
  ON orders FOR UPDATE 
  USING (true)
  WITH CHECK (true);

-- =====================================================
-- SUCCESS! Orders table now supports Razorpay fields.
-- =====================================================
