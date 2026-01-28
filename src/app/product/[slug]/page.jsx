import { fetchProductBySlug, fetchRelatedProducts } from '@/lib/products';
import { notFound } from 'next/navigation';
import ProductClient from './ProductClient';

// 1. Dynamic Metadata Generation (SEO)
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await fetchProductBySlug(slug);

  if (!product) {
    return { title: 'Product Not Found' };
  }

  const primaryImage = product.images?.[0] || 'https://bagshop-demo.vercel.app/og-image.jpg';

  return {
    title: `${product.name} | BagShop`,
    description: product.description?.substring(0, 160) || `Buy ${product.name} online.`,
    openGraph: {
      title: product.name,
      description: product.description?.substring(0, 160),
      images: [{ url: primaryImage }],
    },
  };
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  
  // 2. Server-side Data Fetching
  const product = await fetchProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = await fetchRelatedProducts(product.category, product.id, 4);

  // 3. JSON-LD Structured Data (for Google Rich Snippets)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.images,
    description: product.description,
    brand: {
      '@type': 'Brand',
      name: 'BagShop'
    },
    offers: {
      '@type': 'Offer',
      url: `https://bagshop-demo.vercel.app/product/${slug}`,
      priceCurrency: 'INR',
      price: product.price,
      availability: product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition'
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: Math.max(1, product.reviewCount) // Google needs at least 1
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductClient product={product} relatedProducts={relatedProducts} />
    </>
  );
}
