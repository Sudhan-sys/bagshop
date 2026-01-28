const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function bulkImport() {
  console.log('🚀 Starting Bulk Import...');

  // 1. Load your products (JSON example)
  // You could also read from a CSV file here
  const products = JSON.parse(fs.readFileSync(path.join(__dirname, '../products-data.json'), 'utf8'));

  console.log(`📦 Found ${products.length} products to import.`);

  let successCount = 0;
  let errorCount = 0;

  for (const product of products) {
    try {
      // A. Insert User/Base Product
      const { data: prodData, error: prodError } = await supabase
        .from('products')
        .insert({
          title: product.title,
          slug: product.slug || product.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
          status: 'active'
        })
        .select()
        .single();

      if (prodError) throw prodError;

      const productId = prodData.id;

      // B. Insert Details, Pricing, Inventory, Images (Parallel)
      await Promise.all([
        // Pricing
        supabase.from('product_pricing').insert({
          product_id: productId,
          price: product.price,
          mrp: product.mrp
        }),

        // Inventory
        supabase.from('product_inventory').insert({
          product_id: productId,
          stock: product.stock
        }),

        // Details
        supabase.from('product_details').insert({
          product_id: productId,
          description: product.description,
          highlights: product.highlights || [],
          specifications: product.specifications || {}
        }),

        // Images
        supabase.from('product_images').insert(
          product.images.map((url, index) => ({
            product_id: productId,
            image_url: url,
            is_primary: index === 0,
            sort_order: index
          }))
        )
      ]);

      console.log(`✅ Imported: ${product.title}`);
      successCount++;

    } catch (err) {
      console.error(`❌ Failed: ${product.title}`, err.message);
      errorCount++;
    }
  }

  console.log('\n=================================');
  console.log(`🎉 Import Complete!`);
  console.log(`✅ Success: ${successCount}`);
  console.log(`❌ Failed:  ${errorCount}`);
  console.log('=================================');
}

bulkImport();
