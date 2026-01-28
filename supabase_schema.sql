-- Create Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY, -- We can use the generated BS... ID or UUID
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  shipping_address JSONB NOT NULL, -- Store full address object
  total_amount NUMERIC NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'shipped', 'delivered', 'cancelled')),
  payment_method TEXT NOT NULL
);

-- Create Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id TEXT REFERENCES orders(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  price NUMERIC NOT NULL,
  variant TEXT
);

-- Enable Row Level Security (RLS)
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anyone to insert orders (public checkout)
CREATE POLICY "Enable insert for everyone" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable insert for everyone" ON order_items FOR INSERT WITH CHECK (true);

-- Policy: Allow users to read their own orders (by email? or just public for now for demo)
-- For a real app, you'd integrate Auth. For now, we'll allow public Select IF they know the ID? 
-- Actually, strict RLS: No public select. Only Insert. 
-- You (the admin) can read all in dashboard.
