# Reviews Setup Instructions

Since I could not automatically apply the database changes due to permission restrictions, you need to run the following SQL in your Supabase Dashboard to enable the Reviews feature.

1.  Go to your **Supabase Dashboard** > **SQL Editor**.
2.  Click **New Query**.
3.  Copy and paste the SQL below.
4.  Click **Run**.

```sql
-- 1. Create Reviews Table
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

-- 2. Create Indexes
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at);

-- 3. Enable RLS (Security)
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- 4. Create Policies
-- Allow anyone to read reviews
CREATE POLICY "Public read reviews" ON reviews FOR SELECT USING (true);

-- Allow anyone to create reviews (for guest reviews)
CREATE POLICY "Anyone can create reviews" ON reviews FOR INSERT WITH CHECK (true);

-- 5. Add Rating Columns to Products (if missing)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'rating') THEN
        ALTER TABLE products ADD COLUMN rating NUMERIC(3,1) DEFAULT 0;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'review_count') THEN
        ALTER TABLE products ADD COLUMN review_count INTEGER DEFAULT 0;
    END IF;
END $$;

-- 6. Create Trigger to Auto-Update Product Rating
CREATE OR REPLACE FUNCTION update_product_rating() RETURNS TRIGGER AS $$
DECLARE
    _avg_rating NUMERIC(3,1);
    _count INTEGER;
BEGIN
    SELECT COALESCE(AVG(rating), 0), COUNT(*) INTO _avg_rating, _count
    FROM reviews
    WHERE product_id = NEW.product_id;

    UPDATE products
    SET rating = _avg_rating,
        review_count = _count
    WHERE id = NEW.product_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Attach Trigger
DROP TRIGGER IF EXISTS on_review_change ON reviews;
CREATE TRIGGER on_review_change
AFTER INSERT OR UPDATE OR DELETE ON reviews
FOR EACH ROW EXECUTE FUNCTION update_product_rating();
```

## Hydration Warning Fixed

I also added `suppressHydrationWarning` to the newsletter inputs in the footer to silence the console warnings caused by browser extensions.
