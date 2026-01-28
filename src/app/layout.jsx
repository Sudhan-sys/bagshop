import './globals.css';
import Providers from './providers';
import Header from '../components/layout/Header';
import BagFooter from '../components/layout/BagFooter';

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // Prevents zooming issues on mobile inputs
  themeColor: '#ffffff',
};

export const metadata = {
  metadataBase: new URL('https://bagshop-demo.vercel.app'), // Replace with your actual domain
  title: {
    default: 'BagShop - Premium Backpacks, Travel Bags & Accessories',
    template: '%s | BagShop India'
  },
  description: 'Discover premium backpacks, laptop bags, and travel gear suited for the modern journey. Crafted for durability, designed for style. Free shipping across India.',
  keywords: ['backpacks', 'travel bags', 'laptop bags', 'school bags', 'premium bags india', 'bagshop'],
  authors: [{ name: 'BagShop Team' }],
  creator: 'BagShop',
  publisher: 'BagShop',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://bagshop-demo.vercel.app',
    siteName: 'BagShop',
    title: 'BagShop - Premium Carry Gear',
    description: 'Elevate your carry game with our premium collection of backpacks and travel gear.',
    images: [
      {
        url: '/og-image.jpg', // You should add a default OG image to public folder
        width: 1200,
        height: 630,
        alt: 'BagShop Collection',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BagShop - Premium Carry Gear',
    description: 'Elevate your carry game with our premium collection of backpacks and travel gear.',
    creator: '@bagshop',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Providers>
          <Header />
          <main style={{ minHeight: '60vh' }}>{children}</main>
          <BagFooter />
        </Providers>
      </body>
    </html>
  );
}
