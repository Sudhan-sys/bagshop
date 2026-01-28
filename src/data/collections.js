/**
 * Collection data
 */

export const collections = [
  {
    id: 'backpacks',
    name: 'Backpacks',
    slug: 'backpacks',
    description: 'Ergonomic backpacks for work, study, and adventure',
    image: '/images/collections/backpacks.jpg',
    productCount: 12,
  },
  {
    id: 'travel',
    name: 'Travel Bags',
    slug: 'travel',
    description: 'Durable luggage built for every journey',
    image: '/images/collections/travel.jpg',
    productCount: 8,
  },
  {
    id: 'laptop',
    name: 'Laptop Bags',
    slug: 'laptop',
    description: 'Professional protection for your devices',
    image: '/images/collections/laptop.jpg',
    productCount: 6,
  },
  {
    id: 'handbags',
    name: 'Handbags & Totes',
    slug: 'handbags',
    description: 'Everyday elegance meets functionality',
    image: '/images/collections/handbags.jpg',
    productCount: 10,
  },
];

export function getCollectionBySlug(slug) {
  return collections.find(c => c.slug === slug) || null;
}
