import React, { useState } from 'react';
import Link from 'next/link';
import { FaHome, FaUsers, FaCalendarAlt, FaUserTie } from 'react-icons/fa'; // 必要なアイコンをインポート
import styles from '../styles/Sidebar.module.css'; // styles/Sidebar.module.css が必要

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
      <Link href="/participants">
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
      <Link href="/staffs">
        <div className={styles.menuItem}>
          <FaUserTie className={styles.icon} />
          {!isCollapsed && <span className={styles.text}>スタッフ一覧</span>}
        </div>
      </Link>
    </div>
  );
};

export default Sidebar;