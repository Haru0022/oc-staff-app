import React, { useState } from 'react';
import Link from 'next/link';
import { FaHome, FaUsers, FaCalendarAlt, FaUserTie, FaUserPlus, FaSignOutAlt } from 'react-icons/fa';
import styles from '../styles/Sidebar.module.css';
import { useData } from '../admin/context/DataContext';
import { useAuth } from '../admin/context/AuthContext';
import { useRouter } from 'next/router';

const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { fetchData } = useData();
  const { logout } = useAuth();
  const router = useRouter();

  const handleUpdate = async () => {
    fetchData();
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/auth/login'); // ログアウト後、ログインページへリダイレクト
    } catch (error) {
      console.error('ログアウトに失敗しました', error);
      // 必要に応じてエラーハンドリング (例: エラーメッセージの表示)
    }
  };

  return (
    <div className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''}`}>
      <button className={styles.toggleButton} onClick={() => setIsCollapsed(!isCollapsed)}>
        {isCollapsed ? '▶' : '◀'}
      </button>

      {/* ホーム */}
      <Link href="/admin/home">
        <div className={styles.menuItem}>
          <FaHome className={styles.icon} />
          {!isCollapsed && <span className={styles.text}>ホーム</span>}
        </div>
      </Link>

      {/* 参加者一覧 */}
      <Link href="/admin/participant">
        <div className={styles.menuItem}>
          <FaUsers className={styles.icon} />
          {!isCollapsed && <span className={styles.text}>参加者一覧</span>}
        </div>
      </Link>

      {/* オープンキャンパス一覧 */}
      <Link href="/admin/openCampuses">
        <div className={styles.menuItem}>
          <FaCalendarAlt className={styles.icon} />
          {!isCollapsed && <span className={styles.text}>オープンキャンパス一覧</span>}
        </div>
      </Link>

      {/* スタッフ一覧 */}
      <Link href="/admin/staff">
        <div className={styles.menuItem}>
          <FaUserTie className={styles.icon} />
          {!isCollapsed && <span className={styles.text}>スタッフ一覧</span>}
        </div>
      </Link>

      {/* アカウント管理 */}
      <Link href="/admin/user">
        <div className={styles.menuItem}>
          <FaUserPlus className={styles.icon} />
          {!isCollapsed && <span className={styles.text}>アカウント管理</span>}
        </div>
      </Link>

      {/* 更新ボタン 
      <button onClick={handleUpdate} className={styles.menuItem}>
        {!isCollapsed && <span className={styles.text}>データ更新</span>}
      </button>*/}

      {/* ログアウトボタン 
      <button onClick={handleLogout} className={styles.menuItem}>
        <FaSignOutAlt className={styles.icon} />
        {!isCollapsed && <span className={styles.text}>ログアウト</span>}
      </button>*/}

      <Link href="#"> 
        <div onClick={handleLogout} className={styles.menuItem}>
          <FaSignOutAlt className={styles.icon} />
          {!isCollapsed && <span className={styles.text}>ログアウト</span>}
        </div>
      </Link>
    </div>
  );
};

export default Sidebar;