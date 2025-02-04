import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FaHome, FaUsers, FaCalendarAlt, FaUserTie, FaUserPlus } from 'react-icons/fa';
import styles from './MobileMenu.module.css'; // CSSモジュールをインポート

const MobileMenu: React.FC = () => {
  const router = useRouter();

  return (
    <div className={styles.menuContainer}>
      {/* ホーム */}
      <Link href="/mobile/home" passHref legacyBehavior>
        <div className={`${styles.menuItem} ${router.pathname === '/mobile/home' ? styles.active : ''}`}>
          <FaHome className={styles.icon} />
          <span className={styles.text}>ホーム</span>
        </div>
      </Link>

      {/* 参加者一覧 */}
      <Link href="/mobile/participant" passHref legacyBehavior>
        <div className={`${styles.menuItem} ${router.pathname === '/mobile/participant' ? styles.active : ''}`}>
          <FaUsers className={styles.icon} />
          <span className={styles.text}>参加者</span>
        </div>
      </Link>

      {/* オープンキャンパス一覧 */}
      <Link href="/mobile/openCampuses" passHref legacyBehavior>
        <div className={`${styles.menuItem} ${router.pathname === '/mobile/openCampuses' ? styles.active : ''}`}>
          <FaCalendarAlt className={styles.icon} />
          <span className={styles.text}>OC</span>
        </div>
      </Link>

      {/* スタッフ一覧 */}
      <Link href="/mobile/staff" passHref legacyBehavior>
        <div className={`${styles.menuItem} ${router.pathname === '/mobile/staff' ? styles.active : ''}`}>
          <FaUserTie className={styles.icon} />
          <span className={styles.text}>スタッフ</span>
        </div>
      </Link>
    </div>
  );
};

export default MobileMenu;