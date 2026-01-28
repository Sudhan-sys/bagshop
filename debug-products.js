const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function checkProducts() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  console.log('--- Checking DB Connection ---');
  const { data: products, error } = await supabase
    .from('products')
    .select(`
      id, title, status,
      product_pricing(price),
      product_inventory(stock)
    `);

  if (error) {
    console.error('Error fetching:', error);
    return;
  }

  console.log('Found', products.length, 'products:');
  products.forEach(p => {
    console.log(`[${p.status.toUpperCase()}] ${p.title}`);
    console.log(`   Price: ${p.product_pricing?.price}`);
    console.log(`   Stock: ${p.product_inventory?.stock}`);
    console.log('-----------------------------------');
  });
}

checkProducts();
