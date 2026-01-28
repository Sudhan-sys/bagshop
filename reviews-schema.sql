-- Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, 
    user_name TEXT NOT NULL, 
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at);

-- RLS
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Policies (Robust: Drop first to avoid "already exists" error)
DROP POLICY IF EXISTS "Public read reviews" ON reviews;
CREATE POLICY "Public read reviews" ON reviews FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can create reviews" ON reviews;
CREATE POLICY "Anyone can create reviews" ON reviews FOR INSERT WITH CHECK (true);

-- Function to Recalculate Ratings
CREATE OR REPLACE FUNCTION update_product_rating() RETURNS TRIGGER AS $$
DECLARE
    _avg_rating NUMERIC(3,1);
    _count INTEGER;
BEGIN
    SELECT COALESCE(AVG(rating), 0), COUNT(*) INTO _avg_rating, _count
    FROM reviews
    WHERE product_id = NEW.product_id;

    -- Update product stats (Adding columns if they don't exist handled below)
    UPDATE products 
    SET rating = _avg_rating, 
        review_count = _count 
    WHERE id = NEW.product_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure columns exist in products
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'rating') THEN
        ALTER TABLE products ADD COLUMN rating NUMERIC(3,1) DEFAULT 0;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'review_count') THEN
        ALTER TABLE products ADD COLUMN review_count INTEGER DEFAULT 0;
    END IF;
END $$;

-- Trigger
DROP TRIGGER IF EXISTS on_review_change ON reviews;
CREATE TRIGGER on_review_change 
AFTER INSERT OR UPDATE OR DELETE ON reviews 
FOR EACH ROW EXECUTE FUNCTION update_product_rating();
