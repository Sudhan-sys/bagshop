/**
 * Sample product data
 */

export const products = [
  {
    id: 'urban-backpack-pro',
    name: 'Urban Backpack Pro',
    slug: 'urban-backpack-pro',
    price: 3499,
    originalPrice: 4999,
    category: 'backpacks',
    collection: 'urban',
    description: 'A premium urban backpack designed for the modern professional. Features padded laptop compartment, water-resistant fabric, and ergonomic straps.',
    highlights: [
      'Fits 15.6" laptop with padded protection',
      'Water-resistant 900D polyester',
      'Hidden anti-theft back pocket',
      'USB charging port',
      'Ergonomic shoulder straps',
    ],
    specs: {
      dimensions: '45 x 30 x 15 cm',
      weight: '850g',
      capacity: '25L',
      material: '900D Polyester',
      compartments: '3 main + 5 pockets',
      waterResistance: 'Water-resistant',
      warranty: '2 Years',
    },
    colors: [
      { name: 'Charcoal Black', value: '#1a1a1a', image: '/images/products/urban-backpack-pro.png?v=3' },
      { name: 'Navy Blue', value: '#1e3a5f', image: '/images/products/urban-backpack-pro.png?v=3' },
    ],
    images: [
      '/images/products/urban-backpack-pro.png?v=3',
      '/images/products/urban-backpack-pro.png?v=3',
      '/images/products/urban-backpack-pro.png?v=3',
    ],
    cutoutImage: '/images/products/urban-backpack-pro.png?v=3',
    useCases: ['office', 'college', 'daily'],
    rating: 4.7,
    reviewCount: 234,
    inStock: true,
    badge: 'Best Seller',
  },
  {
    id: 'travel-duffle-xl',
    name: 'Travel Duffle XL',
    slug: 'travel-duffle-xl',
    price: 4999,
    originalPrice: 6499,
    category: 'travel',
    collection: 'adventure',
    description: 'Spacious travel duffle built for adventures. Expandable design, rugged construction, and smart organization for extended trips.',
    highlights: [
      'Expandable 60L to 75L capacity',
      'Lockable main compartment',
      'Detachable shoulder strap',
      'Shoe compartment',
      'Compression straps',
    ],
    specs: {
      dimensions: '65 x 35 x 30 cm',
      weight: '1.2kg',
      capacity: '60-75L',
      material: 'Ballistic Nylon',
      compartments: '2 main + 4 pockets',
      waterResistance: 'Weather-resistant',
      warranty: '3 Years',
    },
    colors: [
      { name: 'Midnight Black', value: '#0d0d0d', image: '/images/products/travel-duffle-xl.png?v=3' },
      { name: 'Storm Grey', value: '#4a4a4a', image: '/images/products/travel-duffle-xl.png?v=3' },
    ],
    images: [
      '/images/products/travel-duffle-xl.png?v=3',
    ],
    cutoutImage: '/images/products/travel-duffle-xl.png?v=3',
    useCases: ['travel'],
    rating: 4.8,
    reviewCount: 156,
    inStock: true,
    badge: 'New',
  },
  {
    id: 'executive-laptop-bag',
    name: 'Executive Laptop Bag',
    slug: 'executive-laptop-bag',
    price: 5999,
    originalPrice: 7499,
    category: 'laptop',
    collection: 'business',
    description: 'Sophisticated laptop bag for executives. Premium leather accents, TSA-friendly design, and refined aesthetics for the boardroom.',
    highlights: [
      'Fits 17" laptop securely',
      'TSA-friendly lay-flat design',
      'Genuine leather trim',
      'RFID-blocking pocket',
      'Trolley sleeve for travel',
    ],
    specs: {
      dimensions: '42 x 32 x 12 cm',
      weight: '1.1kg',
      capacity: '18L',
      material: 'Premium Canvas + Leather',
      compartments: '2 main + 8 pockets',
      waterResistance: 'Splash-resistant',
      warranty: '5 Years',
    },
    colors: [
      { name: 'Classic Brown', value: '#5c4033', image: '/images/placeholder.svg' },
      { name: 'Jet Black', value: '#1a1a1a', image: '/images/placeholder.svg' },
    ],
    images: [
      '/images/placeholder.svg',
    ],
    cutoutImage: '/images/placeholder.svg',
    useCases: ['office', 'travel'],
    rating: 4.9,
    reviewCount: 89,
    inStock: true,
    badge: 'Premium',
  },
  {
    id: 'compact-sling-bag',
    name: 'Compact Sling Bag',
    slug: 'compact-sling-bag',
    price: 1999,
    originalPrice: 2499,
    category: 'handbags',
    collection: 'urban',
    description: 'Minimalist sling bag for essentials. Perfect for commutes, quick outings, and keeping your valuables close.',
    highlights: [
      'Quick-access front pocket',
      'Adjustable crossbody strap',
      'Anti-theft hidden pocket',
      'Lightweight at 280g',
      'Headphone port',
    ],
    specs: {
      dimensions: '20 x 14 x 8 cm',
      weight: '280g',
      capacity: '3L',
      material: 'Ripstop Nylon',
      compartments: '1 main + 3 pockets',
      waterResistance: 'Water-resistant',
      warranty: '1 Year',
    },
    colors: [
      { name: 'Slate Grey', value: '#6b7280', image: '/images/products/compact-sling-bag.png?v=3' },
      { name: 'Deep Black', value: '#111111', image: '/images/products/compact-sling-bag.png?v=3' },
      { name: 'Olive', value: '#556b2f', image: '/images/products/compact-sling-bag.png?v=3' },
    ],
    images: [
      '/images/products/compact-sling-bag.png?v=3',
    ],
    cutoutImage: '/images/products/compact-sling-bag.png?v=3',
    useCases: ['daily', 'college'],
    rating: 4.5,
    reviewCount: 312,
    inStock: true,
  },
  {
    id: 'weekend-tote',
    name: 'Weekend Tote',
    slug: 'weekend-tote',
    price: 3299,
    originalPrice: 3999,
    category: 'handbags',
    collection: 'lifestyle',
    description: 'Versatile tote for weekend getaways. Spacious interior, magnetic closure, and sophisticated design.',
    highlights: [
      'Magnetic snap closure',
      'Interior zip pocket',
      'Reinforced handles',
      'Fits gym essentials',
      'Vegan leather option',
    ],
    specs: {
      dimensions: '40 x 35 x 15 cm',
      weight: '650g',
      capacity: '20L',
      material: 'Canvas + Vegan Leather',
      compartments: '1 main + 2 pockets',
      waterResistance: 'Light splash',
      warranty: '2 Years',
    },
    colors: [
      { name: 'Sand Beige', value: '#c2b280', image: '/images/placeholder.svg' },
      { name: 'Dusty Rose', value: '#d4a5a5', image: '/images/placeholder.svg' },
    ],
    images: [
      '/images/placeholder.svg',
    ],
    cutoutImage: '/images/placeholder.svg',
    useCases: ['daily', 'travel'],
    rating: 4.6,
    reviewCount: 178,
    inStock: true,
  },
  {
    id: 'adventure-hiking-pack',
    name: 'Adventure Hiking Pack',
    slug: 'adventure-hiking-pack',
    price: 6499,
    originalPrice: 7999,
    category: 'backpacks',
    collection: 'adventure',
    description: 'Technical hiking backpack for serious adventurers. Ventilated back panel, rain cover, and hydration compatible.',
    highlights: [
      '45L capacity for multi-day hikes',
      'Built-in rain cover',
      'Hydration bladder compatible',
      'Hip belt with pockets',
      'Trekking pole attachments',
    ],
    specs: {
      dimensions: '60 x 35 x 25 cm',
      weight: '1.4kg',
      capacity: '45L',
      material: 'Cordura® Nylon',
      compartments: '2 main + 6 pockets',
      waterResistance: 'Rain cover included',
      warranty: '5 Years',
    },
    colors: [
      { name: 'Summit Orange', value: '#e85d04', image: '/images/products/adventure-hiking-pack.png?v=3' },
      { name: 'Trail Green', value: '#4a7c59', image: '/images/products/adventure-hiking-pack.png?v=3' },
    ],
    images: [
      '/images/products/adventure-hiking-pack.png?v=3',
    ],
    cutoutImage: '/images/products/adventure-hiking-pack.png?v=3',
    useCases: ['travel'],
    rating: 4.9,
    reviewCount: 67,
    inStock: true,
    badge: 'Top Rated',
  },
];

export function getProductBySlug(slug) {
  return products.find(p => p.slug === slug) || null;
}

export function getProductsByCategory(category) {
  return products.filter(p => p.category === category);
}

export function getProductsByCollection(collection) {
  return products.filter(p => p.collection === collection);
}

export function getBestSellers() {
  return products.filter(p => p.badge === 'Best Seller' || p.rating >= 4.7).slice(0, 4);
}

export function getNewArrivals() {
  return products.filter(p => p.badge === 'New').slice(0, 4);
}
