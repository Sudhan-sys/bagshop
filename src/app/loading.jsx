import BagLoader from '@/components/ui/BagLoader';

/**
 * Global Loading UI
 * 
 * Automatically rendered by Next.js App Router during navigation
 * and initial page load. Replaces the default browser spinner
 * with our branded Bag animation.
 */
export default function Loading() {
  return <BagLoader text="Preparing your experience..." />;
}
