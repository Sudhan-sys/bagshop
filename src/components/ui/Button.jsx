import { cn } from '@/lib/utils';
import styles from './Button.module.css';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  className = '',
  ...props
}) {
  return (
    <button
      className={cn(
        styles.button,
        styles[variant],
        styles[size],
        fullWidth && styles.full,
        loading && styles.loading,
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <span className={styles.spinner} />}
      {children}
    </button>
  );
}
