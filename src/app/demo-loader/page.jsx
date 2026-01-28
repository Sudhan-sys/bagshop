import BagLoader from '@/components/ui/BagLoader';

/**
 * Test Page for BagLoader
 * 
 * Accessible at: http://localhost:3000/demo-loader
 * Purpose: Allows easy verification of the loading animation.
 */
export default function DemoLoaderPage() {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
       <BagLoader text="This is a demo of the loader..." />
    </div>
  );
}
