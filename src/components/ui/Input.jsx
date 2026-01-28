import { cn } from '@/lib/utils';
import styles from './Input.module.css';

export default function Input({
  label,
  error,
  className = '',
  textarea = false,
  ...props
}) {
  const Component = textarea ? 'textarea' : 'input';

  return (
    <div className={cn(styles.inputWrapper, error && styles.error, className)}>
      {label && <label className={styles.label}>{label}</label>}
      <Component 
        className={cn(styles.input, textarea && styles.textarea)} 
        {...props} 
      />
      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
}
