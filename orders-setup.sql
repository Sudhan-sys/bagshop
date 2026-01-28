-- ==============================================================================
-- 🛍️ ORDERS & CUSTOMERS SCHEMA (Stripe Ready - Idempotent Version)
-- ==============================================================================

-- 1. CUSTOMERS TABLE
CREATE TABLE IF NOT EXISTS customers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    first_name TEXT,
    last_name TEXT,
    phone TEXT,
    shipping_address JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. ORDERS TABLE
CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    customer_id UUID REFERENCES customers(id),
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT,
    shipping_address JSONB NOT NULL,
    total_amount NUMERIC NOT NULL,
    payment_method TEXT DEFAULT 'cod',
    status TEXT DEFAULT 'pending', 
    stripe_session_id TEXT, 
    payment_intent TEXT, 
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ORDER ITEMS TABLE
CREATE TABLE IF NOT EXISTS order_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id TEXT REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id), 
    product_name TEXT NOT NULL,
    quantity INTEGER DEFAULT 1,
    price NUMERIC NOT NULL,
    variant TEXT,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. INDEXES
CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);

-- 5. RLS POLICIES
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to prevent errors
DROP POLICY IF EXISTS "Public create customers" ON customers;
DROP POLICY IF EXISTS "Public create orders" ON orders;
DROP POLICY IF EXISTS "Public create order_items" ON order_items;

-- Re-create policies
CREATE POLICY "Public create customers" ON customers FOR INSERT WITH CHECK (true);
CREATE POLICY "Public create orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public create order_items" ON order_items FOR INSERT WITH CHECK (true);
