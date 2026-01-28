-- ==============================================================================
-- 🛍️ BAGSHOP E-COMMERCE MASTER SCHEMA (Fix ID Conflict)
-- ==============================================================================

-- 1. CLEANUP (Drop new tables if they partially exist with wrong types)
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS product_images CASCADE;
DROP TABLE IF EXISTS product_inventory CASCADE;
DROP TABLE IF EXISTS product_pricing CASCADE;
DROP TABLE IF EXISTS product_details CASCADE;
-- Do NOT drop 'products' yet, we need to inspect it

-- 2. HANDLE LEGACY TABLE (The one with TEXT IDs)
DO $$ 
BEGIN
    -- Check if 'products' exists and has TEXT id (Old Version)
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'products' 
        AND column_name = 'id' 
        AND data_type = 'text'
    ) THEN
        -- Rename it to preserve data
        ALTER TABLE products RENAME TO products_legacy;
    END IF;

    -- Also handle variants
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'product_variants') THEN
        ALTER TABLE product_variants RENAME TO product_variants_legacy;
    END IF;
END $$;

-- 3. CREATE NEW PRODUCTS TABLE (With UUID)
-- Now 'products' name should be free. If it still exists, it must be the UUID one.
CREATE TABLE IF NOT EXISTS products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'inactive', 'archived')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CREATE CHILD TABLES (Now referring to UUID pk)
CREATE TABLE IF NOT EXISTS product_details (
    product_id UUID REFERENCES products(id) ON DELETE CASCADE PRIMARY KEY,
    description TEXT,
    specifications JSONB DEFAULT '{}'::jsonb,
    highlights TEXT[],
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS product_pricing (
    product_id UUID REFERENCES products(id) ON DELETE CASCADE PRIMARY KEY,
    price NUMERIC NOT NULL CHECK (price >= 0),
    mrp NUMERIC NOT NULL CHECK (mrp >= 0),
    currency TEXT DEFAULT 'INR',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS product_inventory (
    product_id UUID REFERENCES products(id) ON DELETE CASCADE PRIMARY KEY,
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    low_stock_threshold INTEGER DEFAULT 5,
    sku TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS product_images (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    admin_user_id UUID REFERENCES auth.users(id),
    entity_type TEXT NOT NULL,
    entity_id UUID NOT NULL,
    action TEXT NOT NULL,
    before_json JSONB,
    after_json JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT,
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. INDEXES
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_product_images_product ON product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_product_images_order ON product_images(product_id, sort_order);

-- 6. SECURITY (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Helpers & Policies
CREATE OR REPLACE FUNCTION is_admin() RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Re-create policies with safety checks
DO $$ BEGIN DROP POLICY IF EXISTS "Public read active products" ON products; EXCEPTION WHEN OTHERS THEN NULL; END $$;
CREATE POLICY "Public read active products" ON products FOR SELECT USING (status = 'active');

DO $$ BEGIN DROP POLICY IF EXISTS "Admins full access products" ON products; EXCEPTION WHEN OTHERS THEN NULL; END $$;
CREATE POLICY "Admins full access products" ON products FOR ALL USING (is_admin());

-- (Repeat generalized admin policy for simplicty)
DO $$ BEGIN
    CREATE POLICY "Admins full access details" ON product_details FOR ALL USING (is_admin());
    CREATE POLICY "Public read details of active" ON product_details FOR SELECT USING (EXISTS (SELECT 1 FROM products p WHERE p.id = product_details.product_id AND p.status = 'active'));
EXCEPTION WHEN OTHERS THEN NULL; END $$;

DO $$ BEGIN
    CREATE POLICY "Admins full access pricing" ON product_pricing FOR ALL USING (is_admin());
    CREATE POLICY "Public read pricing of active" ON product_pricing FOR SELECT USING (EXISTS (SELECT 1 FROM products p WHERE p.id = product_pricing.product_id AND p.status = 'active'));
EXCEPTION WHEN OTHERS THEN NULL; END $$;

DO $$ BEGIN
    CREATE POLICY "Admins full access inventory" ON product_inventory FOR ALL USING (is_admin());
    CREATE POLICY "Public read inventory of active" ON product_inventory FOR SELECT USING (EXISTS (SELECT 1 FROM products p WHERE p.id = product_inventory.product_id AND p.status = 'active'));
EXCEPTION WHEN OTHERS THEN NULL; END $$;

DO $$ BEGIN
    CREATE POLICY "Admins full access images" ON product_images FOR ALL USING (is_admin());
    CREATE POLICY "Public read images of active" ON product_images FOR SELECT USING (EXISTS (SELECT 1 FROM products p WHERE p.id = product_images.product_id AND p.status = 'active'));
EXCEPTION WHEN OTHERS THEN NULL; END $$;

-- 7. TRIGGERS (Auto-Admin)
CREATE OR REPLACE FUNCTION handle_new_user() RETURNS TRIGGER AS $$
DECLARE is_admin_email BOOLEAN;
BEGIN
  is_admin_email := new.email IN ('<MY_EMAIL>', '<CLIENT_EMAIL>', 'ddemo908@gmail.com');
  INSERT INTO public.profiles (id, email, role)
  VALUES (new.id, new.email, CASE WHEN is_admin_email THEN 'admin' ELSE 'user' END)
  ON CONFLICT (id) DO UPDATE SET role = EXCLUDED.role;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- 8. FORCE ADMIN UPDATE
UPDATE profiles SET role = 'admin' WHERE email IN ('<MY_EMAIL>', '<CLIENT_EMAIL>', 'ddemo908@gmail.com');
