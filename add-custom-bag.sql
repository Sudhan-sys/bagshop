-- ==============================================================================
-- 🛍️ SPECIAL EDITION PRODUCT DROP
-- Run this in Supabase SQL Editor
-- ==============================================================================

DO $$
DECLARE
    p_id UUID := gen_random_uuid();
BEGIN

    -- 1. THE DHARINEESH VP EDITION
    INSERT INTO products (id, title, slug, status)
    VALUES (p_id, 'Dharineesh S - VP Executive Edition', 'dharineesh-vp-exclusive', 'active');

    -- Price: 9999
    INSERT INTO product_pricing (product_id, price, mrp)
    VALUES (p_id, 9999, 14999);

    INSERT INTO product_inventory (product_id, stock)
    VALUES (p_id, 1); -- Limited Edition (1 in stock?)

    INSERT INTO product_details (product_id, description, highlights, specifications)
    VALUES (
        p_id,
        'The ultimate executive asset. This limited VP Education edition comes fully equipped with PM1 certification and Pathways enrollment. Valid through March 2026.',
        ARRAY['Club VP Education', 'PM1 Certified', 'Pathways Enrolled', 'Self-Pay Disabled', 'Valid until March 31, 2026'],
        '{"Role": "VP Education", "Certification": "PM1", "Status": "Pathways Enrolled", "Validity": "March 31, 2026", "Warranty": "Official Club Warranty"}'::jsonb
    );

    -- Image placeholder - You will need to upload the actual image to your storage
    -- and update this URL, or place the image in public/images/
    INSERT INTO product_images (product_id, image_url, is_primary, sort_order)
    VALUES 
        (p_id, 'https://placehold.co/600x600/1e293b/d4a853?text=Dharineesh+VP', true, 0);

END $$;
