import Link from 'next/link';
import Button from '@/components/ui/Button';
import styles from './not-found.module.css';

export default function NotFound() {
  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.content}>
          <div className={styles.icon}>🔍</div>
          <h1 className={styles.title}>Page Not Found</h1>
          <p className={styles.message}>
            Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
          </p>
          <div className={styles.actions}>
            <Link href="/">
              <Button variant="accent">Go Home</Button>
            </Link>
            <Link href="/shop">
              <Button variant="outline">Browse Shop</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
