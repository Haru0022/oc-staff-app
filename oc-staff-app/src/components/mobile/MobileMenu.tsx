// components/mobile/MobileMenu.tsx
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FaHome, FaUsers, FaCalendarAlt, FaUserTie } from 'react-icons/fa';
import styles from './MobileMenu.module.css'; // CSS モジュールをインポート

const MobileMenu: React.FC = () => {
  const router = useRouter();

  return (
    <div className={styles.menuContainer}>
      <Link href="/mobile/participants" className={styles.menuItem}>
        <FaUsers
          size={24}
          className={
            router.pathname === '/mobile/participants'
              ? styles.activeIcon
              : styles.icon
          }
        />
      </Link>
      <Link href="/" className={styles.menuItem}>
        <FaHome
          size={24}
          className={router.pathname === '/' ? styles.activeIcon : styles.icon}
        />
      </Link>
      <Link href="/admin" className={styles.menuItem}>
        <FaUserTie
          size={24}
          className={
            router.pathname === '/admin' ? styles.activeIcon : styles.icon
          }
        />
      </Link>
      <Link
        href="/admin"
        className={`p-2 ${
          router.pathname === '/admin' ? 'text-blue-500' : ''
        }`}
      >
        <FaUserTie size={24} />
      </Link>

      <Link
        href="/admin"
        className={`p-2 ${
          router.pathname === '/admin' ? 'text-blue-500' : ''
        }`}
      >
        <FaCalendarAlt size={24} />
      </Link>
    </div>
  );
};

export default MobileMenu;