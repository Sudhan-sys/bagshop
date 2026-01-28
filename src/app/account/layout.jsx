'use client';

import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import styles from './account.module.css';

export default function AccountLayout({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }
      setUser(session.user);
      setLoading(false);
    };

    getUser();
  }, [router, supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  if (loading) return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      Loading account...
    </div>
  );

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>My Account</h1>
          <p className={styles.userEmail}>{user?.email}</p>
        </div>
        <Button variant="outline" onClick={handleLogout}>
          Sign Out
        </Button>
      </header>

      <div className={styles.grid}>
        <aside className={styles.sidebar}>
          <Link href="/account" className={styles.navLink}>
            Dashboard
          </Link>
          <Link href="/account/orders" className={`${styles.navLink} ${styles.activeLink}`}>
            My Orders
          </Link>
          <Link href="/account/profile" className={styles.navLink}>
            Profile Settings
          </Link>
          <Link href="/account/addresses" className={styles.navLink}>
            Saved Addresses
          </Link>
        </aside>

        <main>
          {children}
        </main>
      </div>
    </div>
  );
}
