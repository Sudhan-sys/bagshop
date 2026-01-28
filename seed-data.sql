-- ==============================================================================
-- 🛍️ BAGSHOP SEED DATA
-- Run this in Supabase SQL Editor to populate your store with premium demo products.
-- ==============================================================================

-- Helper for inserting product with related data
-- We use a DO block to declare variables for product IDs

DO $$
DECLARE
    -- Product IDs
    p_weekender UUID := gen_random_uuid();
    p_commuter UUID := gen_random_uuid();
    p_tote UUID := gen_random_uuid();
    p_hiker UUID := gen_random_uuid();
    p_sling UUID := gen_random_uuid();
    p_briefcase UUID := gen_random_uuid();
BEGIN

    -- 1. THE VOYAGER WEEKENDER (Travel)
    INSERT INTO products (id, title, slug, status)
    VALUES (p_weekender, 'The Voyager Weekender', 'voyager-weekender-leather', 'active');

    INSERT INTO product_pricing (product_id, price, mrp)
    VALUES (p_weekender, 8999, 12999);

    INSERT INTO product_inventory (product_id, stock)
    VALUES (p_weekender, 15);

    INSERT INTO product_details (product_id, description, highlights, specifications)
    VALUES (
        p_weekender,
        'Handcrafted from premium full-grain leather, The Voyager is designed for the modern explorer. Featuring a spacious main compartment, separate shoe pocket, and antique brass hardware, it only gets better with age.',
        ARRAY['Premium Full-Grain Leather', 'Dedicated Shoe Compartment', 'Water-Resistant Lining', 'Detachable Shoulder Strap', 'Airline Carry-On Compliant'],
        '{"Dimensions": "55 x 30 x 25 cm", "Weight": "1.8 kg", "Material": "Full-Grain Leather", "Capacity": "40L", "Warranty": "Lifetime"}'::jsonb
    );

    INSERT INTO product_images (product_id, image_url, is_primary, sort_order)
    VALUES 
        (p_weekender, 'https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&q=80&w=1600', true, 0),
        (p_weekender, 'https://images.unsplash.com/photo-1559348349-86f1f65817fe?auto=format&fit=crop&q=80&w=1600', false, 1);


    -- 2. METRO TECH PRO (Backpack)
    INSERT INTO products (id, title, slug, status)
    VALUES (p_commuter, 'Metro Tech Pro Backpack', 'metro-tech-pro-backpack', 'active');

    INSERT INTO product_pricing (product_id, price, mrp)
    VALUES (p_commuter, 4499, 6999);

    INSERT INTO product_inventory (product_id, stock)
    VALUES (p_commuter, 50);

    INSERT INTO product_details (product_id, description, highlights, specifications)
    VALUES (
        p_commuter,
        'The ultimate daily driver for tech professionals. Built with ballistic nylon, it features a crush-proof zone for sunglasses, suspended laptop protection, and an integrated USB charging port.',
        ARRAY['Suspended 16" Laptop Sleeve', 'Ballistic Nylon Construction', 'USB Charging Port', 'Anti-Theft Secret Pocket', 'Ergonomic Air-Flow Back Panel'],
        '{"Dimensions": "46 x 31 x 15 cm", "Weight": "0.9 kg", "Material": "1680D Ballistic Nylon", "Capacity": "22L", "Warranty": "3 Years"}'::jsonb
    );

    INSERT INTO product_images (product_id, image_url, is_primary, sort_order)
    VALUES 
        (p_commuter, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=1600', true, 0),
        (p_commuter, 'https://images.unsplash.com/photo-1581605405669-fcdf8116543f?auto=format&fit=crop&q=80&w=1600', false, 1);


    -- 3. CANVAS EVERYDAY TOTE (Handbag)
    INSERT INTO products (id, title, slug, status)
    VALUES (p_tote, 'Canvas Everyday Tote', 'canvas-everyday-tote', 'active');

    INSERT INTO product_pricing (product_id, price, mrp)
    VALUES (p_tote, 2499, 3999);

    INSERT INTO product_inventory (product_id, stock)
    VALUES (p_tote, 100);

    INSERT INTO product_details (product_id, description, highlights, specifications)
    VALUES (
        p_tote,
        'Effortlessly chic and incredibly durable. This heavy-duty canvas tote features leather handles and a structured base. Perfect for the market, the beach, or the office.',
        ARRAY['Heavy-Duty Cotton Canvas', 'Vegetable-Tanned Leather Handles', 'Interior Zip Pocket', 'Magnetic Snap Closure', 'Water-Repellent Coating'],
        '{"Dimensions": "40 x 35 x 12 cm", "Weight": "0.5 kg", "Material": "18oz Cotton Canvas", "Drop Length": "25 cm", "Warranty": "1 Year"}'::jsonb
    );

    INSERT INTO product_images (product_id, image_url, is_primary, sort_order)
    VALUES 
        (p_tote, 'https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&q=80&w=1600', true, 0),
        (p_tote, 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=1600', false, 1);


    -- 4. ALPINE EXPLORER 45L (Adventure)
    INSERT INTO products (id, title, slug, status)
    VALUES (p_hiker, 'Alpine Explorer 45L', 'alpine-explorer-hiking-pack', 'active');

    INSERT INTO product_pricing (product_id, price, mrp)
    VALUES (p_hiker, 7999, 10999);

    INSERT INTO product_inventory (product_id, stock)
    VALUES (p_hiker, 25);

    INSERT INTO product_details (product_id, description, highlights, specifications)
    VALUES (
        p_hiker,
        'Engineered for the trails. The Alpine Explorer features an adjustable suspension system, hydration reservoir sleeve, and integrated rain cover. Lightweight yet rugged.',
        ARRAY['Adjustable Torso Length', 'Hydration System Compatible', 'Included Rain Cover', 'Trekking Pole Attachments', 'Breathable Mesh Back'],
        '{"Dimensions": "65 x 32 x 25 cm", "Weight": "1.3 kg", "Material": "Ripstop Nylon", "Capacity": "45+5L", "Warranty": "Lifetime"}'::jsonb
    );

    INSERT INTO product_images (product_id, image_url, is_primary, sort_order)
    VALUES 
        (p_hiker, 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&q=80&w=1600', true, 0),
        (p_hiker, 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&q=80&w=1600', false, 1);


    -- 5. URBAN SLING MINI (Sling)
    INSERT INTO products (id, title, slug, status)
    VALUES (p_sling, 'Urban Sling Mini', 'urban-sling-mini', 'active');

    INSERT INTO product_pricing (product_id, price, mrp)
    VALUES (p_sling, 1999, 2999);

    INSERT INTO product_inventory (product_id, stock)
    VALUES (p_sling, 75);

    INSERT INTO product_details (product_id, description, highlights, specifications)
    VALUES (
        p_sling,
        'Keep your essentials close and your hands free. The Urban Sling Mini is perfect for city exploration, featuring RFID blocking pockets and a self-adjusting strap.',
        ARRAY['RFID Blocking Pocket', 'Waterproof Zippers', 'Magnetic Buckle', 'Key Leash', 'Soft Microfiber Lining'],
        '{"Dimensions": "25 x 15 x 6 cm", "Weight": "0.3 kg", "Material": "X-Pac VX21", "Capacity": "4L", "Warranty": "2 Years"}'::jsonb
    );

    INSERT INTO product_images (product_id, image_url, is_primary, sort_order)
    VALUES 
        (p_sling, 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=1600', true, 0);


    -- 6. SIGNATURE BRIEFCASE (Office)
    INSERT INTO products (id, title, slug, status)
    VALUES (p_briefcase, 'Signature Leather Briefcase', 'signature-leather-briefcase', 'active');

    INSERT INTO product_pricing (product_id, price, mrp)
    VALUES (p_briefcase, 11499, 15999);

    INSERT INTO product_inventory (product_id, stock)
    VALUES (p_briefcase, 10);

    INSERT INTO product_details (product_id, description, highlights, specifications)
    VALUES (
        p_briefcase,
        'Command the boardroom with our Signature Briefcase. Italian leather, precision stitching, and a slim profile that accommodates a 15-inch laptop and your critical documents.',
        ARRAY['Italian Vegetable-Tanned Leather', 'Fits 15" Laptop', 'Trolley Strap for Travel', 'Brass Feet Protection', 'Velvet Interior Lining'],
        '{"Dimensions": "40 x 28 x 8 cm", "Weight": "1.2 kg", "Material": "Italian Leather", "Capacity": "10L", "Warranty": "5 Years"}'::jsonb
    );

    INSERT INTO product_images (product_id, image_url, is_primary, sort_order)
    VALUES 
        (p_briefcase, 'https://images.unsplash.com/photo-1551214012-84f95e0d9eee?auto=format&fit=crop&q=80&w=1600', true, 0);

END $$;
