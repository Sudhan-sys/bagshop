export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/admin/',
    },
    sitemap: 'https://bagshop-demo.vercel.app/sitemap.xml',
  };
}
