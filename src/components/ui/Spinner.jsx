import { cn } from '@/lib/utils';
import styles from './Spinner.module.css';

export default function Spinner({ size = 'md', className = '' }) {
  return (
    <div 
      className={cn(styles.spinner, styles[size], className)} 
      role="status"
      aria-label="Loading"
    />
  );
}
