'use client';

import Button from '@/components/ui/Button';
import styles from './not-found.module.css';

export default function Error({ error, reset }) {
  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.content}>
          <div className={styles.icon}>⚠️</div>
          <h1 className={styles.title}>Something Went Wrong</h1>
          <p className={styles.message}>
            We encountered an unexpected error. Please try again or contact support if the problem persists.
          </p>
          <div className={styles.actions}>
            <Button variant="accent" onClick={reset}>Try Again</Button>
            <Button variant="outline" onClick={() => window.location.href = '/'}>
              Go Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
