'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './admin.module.css';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: '📊' },
    { href: '/admin/products', label: 'Products', icon: '📦' },
    { href: '/admin/orders', label: 'Orders', icon: '🛒' },
    { href: '/admin/audit', label: 'Audit Logs', icon: '📋' },
  ];

  return (
    <div className={styles.layout}>
      {/* Mobile Header */}
      <header className={styles.mobileHeader}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button 
            className={styles.mobileMenuBtn}
            onClick={() => setSidebarOpen(true)}
          >
            ☰
          </button>
          <span style={{ fontWeight: '600' }}>BagShop Admin</span>
        </div>
      </header>

      {/* Overlay */}
      <div 
        className={`${styles.overlay} ${sidebarOpen ? styles.open : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.open : ''}`}>
        {/* Logo */}
        <div className={styles.sidebarHeader}>
          <div className={styles.logoIcon}>B</div>
          <div>
            <div className={styles.logoText}>BagShop</div>
            <div className={styles.logoSubtext}>Admin Panel</div>
          </div>
        </div>

        {/* Navigation */}
        <nav className={styles.nav}>
          <div className={styles.menuLabel}>Menu</div>
          {navItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== '/admin' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
                onClick={() => setSidebarOpen(false)}
              >
                <span style={{ fontSize: '18px' }}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer: User Profile & Actions */}
        <div className={styles.sidebarFooter}>
          {/* User Card */}
          <div className={styles.userCard}>
            <div className={styles.userAvatar}>A</div>
            <div className={styles.userInfo}>
              <div className={styles.userName}>Admin</div>
              <div className={styles.userRole}>Store Manager</div>
            </div>
            <button 
              className={styles.logoutBtn}
              onClick={async () => {
                await fetch('/api/admin/logout', { method: 'POST' });
                window.location.href = '/admin/login';
              }}
              title="Logout"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
            </button>
          </div>

          <Link href="/" className={styles.backLink}>
            ← Back to Store
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className={styles.main}>
        {children}
      </main>
    </div>
  );
}
