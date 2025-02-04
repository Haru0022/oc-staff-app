import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { collection, getDocs, query, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useAuth } from '../../../admin/context/AuthContext';
import styles from '../../../styles/user.module.css';

interface User {
  id: string;
  name: string;
  email: string;
  affiliation: string;
  role: string;
}

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showMenu, setShowMenu] = useState<string | null>(null); // メニューの表示状態を管理
  const router = useRouter();
  //const { currentUser } = useAuth();
  const { currentUser, sendPasswordResetEmail } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const q = query(collection(db, 'users'));
        const querySnapshot = await getDocs(q);

        const usersData: User[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          usersData.push({
            id: doc.id,
            name: data.name,
            email: data.email,
            affiliation: data.affiliation,
            role: data.role,
          });
        });

        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching users: ', error);
        setError('ユーザーデータの取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser, router]);

  const handleMenuClick = (userId: string) => {
    setShowMenu(showMenu === userId ? null : userId);
  };

  // アカウント削除処理
  const handleDelete = async (userId: string) => {
    if (!window.confirm("本当に削除しますか？")) return;

    try {
      // API 経由でユーザーを削除
      const response = await fetch(`/api/users/delete?id=${userId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete user');
      }

      // UI からも削除
      setUsers(users.filter(user => user.id !== userId));
      alert("削除しました");
    } catch (error) {
      console.error('Error deleting user: ', error);
      alert('削除に失敗しました');
    }
  };

  // ロール変更処理
  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const response = await fetch(`/api/users/updateRole`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, role: newRole }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update role');
      }

      // UI を更新
      setUsers(users.map(user => user.id === userId ? { ...user, role: newRole } : user));
      alert("ロールを変更しました");
    } catch (error) {
      console.error('Error updating role: ', error);
      alert('ロールの変更に失敗しました');
    }
  };

  // パスワード再設定処理
  /*
  const handleResetPassword = async (userId: string) => {
    try {
      const newPassword = prompt("新しいパスワードを入力してください");
      if (!newPassword) return;

      const response = await fetch(`/api/users/resetPassword`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, newPassword }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to reset password');
      }

      alert("パスワードを再設定しました");
    } catch (error) {
      console.error('Error resetting password: ', error);
      alert('パスワードの再設定に失敗しました');
    }
  };*/

  // パスワード再設定メール送信関数
  const handleSendPasswordResetEmail = async (email: string) => {
    try {
      // AuthContext から取得した関数を使う
      await sendPasswordResetEmail(email);
      alert("パスワード再設定メールを送信しました");
      setShowMenu(null);
    } catch (error) {
      console.error('Error sending password reset email: ', error);
      alert('パスワード再設定メールの送信に失敗しました');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.searchArea}>
        <h1 className={styles.title}>アカウント管理</h1>

        {/* アカウント追加ページへのリンク */}
        <Link href="/admin/user/add">
          <button>アカウント追加</button>
        </Link>
      </div>

      {/* アカウント一覧 */}
      <div className={styles.tableArea}>
        <table className={styles.table}>
          <thead>
            <tr className={styles.tableHeader}>
              <th>名前</th>
              <th>メールアドレス</th>
              <th>所属</th>
              <th>権限</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className={styles.tableRow}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.affiliation}</td>
                <td>{user.role}</td>
                <td>
                  <button onClick={() => handleMenuClick(user.id)}>︙</button>
                  {showMenu === user.id && (
                    <div className={styles.menu}>
                      <button onClick={() => handleDelete(user.id)}>削除</button>
                      <button onClick={() => handleRoleChange(user.id, user.role === 'admin' ? 'user' : 'admin')}>
                        {user.role === 'admin' ? 'ユーザーに変更' : '管理者に変更'}
                      </button>
                      <button onClick={() => handleSendPasswordResetEmail(user.email)}>パスワード再設定メール送信</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;