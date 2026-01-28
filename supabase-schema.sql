-- =====================================================
-- BagShop Database Schema
-- Run this SQL in Supabase SQL Editor: Dashboard > SQL Editor > New Query
-- =====================================================

-- 1. PRODUCTS TABLE
-- Stores all product information
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  price NUMERIC NOT NULL,
  original_price NUMERIC,
  category TEXT NOT NULL,
  collection TEXT,
  description TEXT,
  highlights TEXT[], -- Array of highlight strings
  specifications JSONB DEFAULT '{}', -- specs object
  images TEXT[], -- Array of image URLs
  cutout_image_url TEXT, -- For try-on feature
  image_url TEXT, -- Primary image
  use_cases TEXT[], -- Array like ['office', 'travel']
  rating NUMERIC DEFAULT 4.5,
  review_count INTEGER DEFAULT 0,
  in_stock BOOLEAN DEFAULT true,
  badge TEXT, -- 'Best Seller', 'New', 'Premium', etc.
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PRODUCT VARIANTS TABLE
-- Color/size variations of products
CREATE TABLE IF NOT EXISTS product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id TEXT REFERENCES products(id) ON DELETE CASCADE,
  name TEXT, -- Variant name like 'Charcoal Black'
  color_name TEXT,
  color_hex TEXT, -- Hex color code like '#1a1a1a'
  image_url TEXT, -- Image for this variant
  price NUMERIC, -- Override price (if different)
  stock_quantity INTEGER DEFAULT 100,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. CUSTOMERS TABLE
-- Guest checkout customer info
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  shipping_address JSONB, -- Full address object
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ORDERS TABLE
-- Main orders table
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY, -- Custom order ID like 'BSxxx'
  customer_id UUID REFERENCES customers(id),
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  shipping_address JSONB NOT NULL,
  total_amount NUMERIC NOT NULL,
  payment_method TEXT DEFAULT 'cod', -- cod, upi, card
  status TEXT DEFAULT 'pending', -- pending, paid, shipped, delivered, cancelled
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. ORDER ITEMS TABLE
-- Individual items in each order
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id TEXT REFERENCES orders(id) ON DELETE CASCADE,
  product_id TEXT,
  product_name TEXT NOT NULL,
  quantity INTEGER DEFAULT 1,
  price NUMERIC NOT NULL,
  variant TEXT, -- Color/variant name
  variant_id UUID,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- INDEXES for faster queries
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_product_variants_product ON product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- PRODUCTS: Anyone can read active products
CREATE POLICY "Products are viewable by everyone" 
  ON products FOR SELECT 
  USING (is_active = true);

-- PRODUCT VARIANTS: Anyone can read
CREATE POLICY "Product variants are viewable by everyone" 
  ON product_variants FOR SELECT 
  USING (is_active = true);

-- CUSTOMERS: Insert only (for guest checkout)
CREATE POLICY "Customers can be created by anyone" 
  ON customers FOR INSERT 
  WITH CHECK (true);

-- ORDERS: Insert only (no read from client)
CREATE POLICY "Orders can be created by anyone" 
  ON orders FOR INSERT 
  WITH CHECK (true);

-- ORDER ITEMS: Insert only
CREATE POLICY "Order items can be created by anyone" 
  ON order_items FOR INSERT 
  WITH CHECK (true);

-- =====================================================
-- SEED DATA: Insert your products
-- =====================================================

INSERT INTO products (id, name, slug, price, original_price, category, collection, description, highlights, specifications, images, cutout_image_url, image_url, use_cases, rating, review_count, in_stock, badge, is_active, is_featured) VALUES
(
  'urban-backpack-pro',
  'Urban Backpack Pro',
  'urban-backpack-pro',
  3499,
  4999,
  'backpacks',
  'urban',
  'A premium urban backpack designed for the modern professional. Features padded laptop compartment, water-resistant fabric, and ergonomic straps.',
  ARRAY['Fits 15.6" laptop with padded protection', 'Water-resistant 900D polyester', 'Hidden anti-theft back pocket', 'USB charging port', 'Ergonomic shoulder straps'],
  '{"dimensions": "45 x 30 x 15 cm", "weight": "850g", "capacity": "25L", "material": "900D Polyester", "compartments": "3 main + 5 pockets", "waterResistance": "Water-resistant", "warranty": "2 Years"}'::jsonb,
  ARRAY['/images/products/urban-backpack-pro.png?v=3'],
  '/images/products/urban-backpack-pro.png?v=3',
  '/images/products/urban-backpack-pro.png?v=3',
  ARRAY['office', 'college', 'daily'],
  4.7,
  234,
  true,
  'Best Seller',
  true,
  true
),
(
  'travel-duffle-xl',
  'Travel Duffle XL',
  'travel-duffle-xl',
  4999,
  6499,
  'travel',
  'adventure',
  'Spacious travel duffle built for adventures. Expandable design, rugged construction, and smart organization for extended trips.',
  ARRAY['Expandable 60L to 75L capacity', 'Lockable main compartment', 'Detachable shoulder strap', 'Shoe compartment', 'Compression straps'],
  '{"dimensions": "65 x 35 x 30 cm", "weight": "1.2kg", "capacity": "60-75L", "material": "Ballistic Nylon", "compartments": "2 main + 4 pockets", "waterResistance": "Weather-resistant", "warranty": "3 Years"}'::jsonb,
  ARRAY['/images/products/travel-duffle-xl.png?v=3'],
  '/images/products/travel-duffle-xl.png?v=3',
  '/images/products/travel-duffle-xl.png?v=3',
  ARRAY['travel'],
  4.8,
  156,
  true,
  'New',
  true,
  true
),
(
  'executive-laptop-bag',
  'Executive Laptop Bag',
  'executive-laptop-bag',
  5999,
  7499,
  'laptop',
  'business',
  'Sophisticated laptop bag for executives. Premium leather accents, TSA-friendly design, and refined aesthetics for the boardroom.',
  ARRAY['Fits 17" laptop securely', 'TSA-friendly lay-flat design', 'Genuine leather trim', 'RFID-blocking pocket', 'Trolley sleeve for travel'],
  '{"dimensions": "42 x 32 x 12 cm", "weight": "1.1kg", "capacity": "18L", "material": "Premium Canvas + Leather", "compartments": "2 main + 8 pockets", "waterResistance": "Splash-resistant", "warranty": "5 Years"}'::jsonb,
  ARRAY['/images/placeholder.svg'],
  '/images/placeholder.svg',
  '/images/placeholder.svg',
  ARRAY['office', 'travel'],
  4.9,
  89,
  true,
  'Premium',
  true,
  true
),
(
  'compact-sling-bag',
  'Compact Sling Bag',
  'compact-sling-bag',
  1999,
  2499,
  'handbags',
  'urban',
  'Minimalist sling bag for essentials. Perfect for commutes, quick outings, and keeping your valuables close.',
  ARRAY['Quick-access front pocket', 'Adjustable crossbody strap', 'Anti-theft hidden pocket', 'Lightweight at 280g', 'Headphone port'],
  '{"dimensions": "20 x 14 x 8 cm", "weight": "280g", "capacity": "3L", "material": "Ripstop Nylon", "compartments": "1 main + 3 pockets", "waterResistance": "Water-resistant", "warranty": "1 Year"}'::jsonb,
  ARRAY['/images/products/compact-sling-bag.png?v=3'],
  '/images/products/compact-sling-bag.png?v=3',
  '/images/products/compact-sling-bag.png?v=3',
  ARRAY['daily', 'college'],
  4.5,
  312,
  true,
  NULL,
  true,
  false
),
(
  'weekend-tote',
  'Weekend Tote',
  'weekend-tote',
  3299,
  3999,
  'handbags',
  'lifestyle',
  'Versatile tote for weekend getaways. Spacious interior, magnetic closure, and sophisticated design.',
  ARRAY['Magnetic snap closure', 'Interior zip pocket', 'Reinforced handles', 'Fits gym essentials', 'Vegan leather option'],
  '{"dimensions": "40 x 35 x 15 cm", "weight": "650g", "capacity": "20L", "material": "Canvas + Vegan Leather", "compartments": "1 main + 2 pockets", "waterResistance": "Light splash", "warranty": "2 Years"}'::jsonb,
  ARRAY['/images/placeholder.svg'],
  '/images/placeholder.svg',
  '/images/placeholder.svg',
  ARRAY['daily', 'travel'],
  4.6,
  178,
  true,
  NULL,
  true,
  false
),
(
  'adventure-hiking-pack',
  'Adventure Hiking Pack',
  'adventure-hiking-pack',
  6499,
  7999,
  'backpacks',
  'adventure',
  'Technical hiking backpack for serious adventurers. Ventilated back panel, rain cover, and hydration compatible.',
  ARRAY['45L capacity for multi-day hikes', 'Built-in rain cover', 'Hydration bladder compatible', 'Hip belt with pockets', 'Trekking pole attachments'],
  '{"dimensions": "60 x 35 x 25 cm", "weight": "1.4kg", "capacity": "45L", "material": "Cordura® Nylon", "compartments": "2 main + 6 pockets", "waterResistance": "Rain cover included", "warranty": "5 Years"}'::jsonb,
  ARRAY['/images/products/adventure-hiking-pack.png?v=3'],
  '/images/products/adventure-hiking-pack.png?v=3',
  '/images/products/adventure-hiking-pack.png?v=3',
  ARRAY['travel'],
  4.9,
  67,
  true,
  'Top Rated',
  true,
  true
)
ON CONFLICT (id) DO NOTHING;

-- Insert product variants (colors)
INSERT INTO product_variants (product_id, name, color_name, color_hex, image_url) VALUES
('urban-backpack-pro', 'Charcoal Black', 'Charcoal Black', '#1a1a1a', '/images/products/urban-backpack-pro.png?v=3'),
('urban-backpack-pro', 'Navy Blue', 'Navy Blue', '#1e3a5f', '/images/products/urban-backpack-pro.png?v=3'),
('travel-duffle-xl', 'Midnight Black', 'Midnight Black', '#0d0d0d', '/images/products/travel-duffle-xl.png?v=3'),
('travel-duffle-xl', 'Storm Grey', 'Storm Grey', '#4a4a4a', '/images/products/travel-duffle-xl.png?v=3'),
('executive-laptop-bag', 'Classic Brown', 'Classic Brown', '#5c4033', '/images/placeholder.svg'),
('executive-laptop-bag', 'Jet Black', 'Jet Black', '#1a1a1a', '/images/placeholder.svg'),
('compact-sling-bag', 'Slate Grey', 'Slate Grey', '#6b7280', '/images/products/compact-sling-bag.png?v=3'),
('compact-sling-bag', 'Deep Black', 'Deep Black', '#111111', '/images/products/compact-sling-bag.png?v=3'),
('compact-sling-bag', 'Olive', 'Olive', '#556b2f', '/images/products/compact-sling-bag.png?v=3'),
('weekend-tote', 'Sand Beige', 'Sand Beige', '#c2b280', '/images/placeholder.svg'),
('weekend-tote', 'Dusty Rose', 'Dusty Rose', '#d4a5a5', '/images/placeholder.svg'),
('adventure-hiking-pack', 'Summit Orange', 'Summit Orange', '#e85d04', '/images/products/adventure-hiking-pack.png?v=3'),
('adventure-hiking-pack', 'Trail Green', 'Trail Green', '#4a7c59', '/images/products/adventure-hiking-pack.png?v=3');

-- =====================================================
-- SUCCESS! Your database is now ready.
-- =====================================================
