import React, { useState } from 'react';
import Link from 'next/link';
import { FaHome, FaUsers, FaCalendarAlt, FaUserTie } from 'react-icons/fa';
import styles from '../styles/Sidebar.module.css';

const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''}`}>
      <button className={styles.toggleButton} onClick={() => setIsCollapsed(!isCollapsed)}>
        {isCollapsed ? '▶' : '◀'}
      </button>

      {/* ホーム */}
      <Link href="/">
        <div className={styles.menuItem}>
          <FaHome className={styles.icon} />
          {!isCollapsed && <span className={styles.text}>ホーム</span>}
        </div>
      </Link>

      {/* 参加者一覧 */}
      <Link href="/participant">
        <div className={styles.menuItem}>
          <FaUsers className={styles.icon} />
          {!isCollapsed && <span className={styles.text}>参加者一覧</span>}
        </div>
      </Link>

      {/* オープンキャンパス一覧 */}
      <Link href="/openCampuses">
        <div className={styles.menuItem}>
          <FaCalendarAlt className={styles.icon} />
          {!isCollapsed && <span className={styles.text}>オープンキャンパス一覧</span>}
        </div>
      </Link>

      {/* スタッフ一覧 */}
      <Link href="/staff">
        <div className={styles.menuItem}>
          <FaUserTie className={styles.icon} />
          {!isCollapsed && <span className={styles.text}>スタッフ一覧</span>}
        </div>
      </Link>
    </div>
  );
};

export default Sidebar;