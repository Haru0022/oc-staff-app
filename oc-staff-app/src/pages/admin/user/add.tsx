// src/pages/admin/user/add.tsx
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../../admin/context/AuthContext';
import styles from '../../../styles/add.module.css';
import { getAuth, onAuthStateChanged } from "firebase/auth";


interface UserInput {
  name: string;
  email: string;
  affiliation: string;
  role: string;
  password?: string;
}

const AddUser: React.FC = () => {
  const [users, setUsers] = useState<UserInput[]>([{ name: '', email: '', affiliation: '', role: 'user', password: '' }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { currentUser } = useAuth();

  const generatePassword = () => {
    const length = 8;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let password = "";
    for (let i = 0; i < length; ++i) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
  };

  // 認証関連の処理は一旦コメントアウト
  /*
  useEffect(() => {
      if (!currentUser || currentUser.role !== 'admin') {
        router.push('/auth/login');
      }
  }, [currentUser, router]);
  */
  
  useEffect(() => {
    setUsers([{
      name: '',
      email: '',
      affiliation: '',
      role: 'user',
      password: generatePassword()
    }]);
  }, []);

  const handleAddRow = () => {
    setUsers([...users, { 
      name: '', 
      email: '', 
      affiliation: '', 
      role: 'user', 
      password: generatePassword() 
    }]);
  };

  const handleInputChange = (index: number, field: keyof UserInput, value: any) => {
    const updatedUsers = [...users];
    updatedUsers[index][field] = value;
    setUsers(updatedUsers);
  };

  useEffect(() => {
    console.log("初回レンダリング時の currentUser:", currentUser); // 確認用ログ
  }, [currentUser]);
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    // currentUser が初期化されるまで待機
    while (!currentUser) {
      await new Promise(resolve => setTimeout(resolve, 100)); // 100ms 待機
    }
    
    try {
      console.log("フォーム送信時の currentUser:", currentUser); // 確認用ログ
  
      if (!currentUser) {
        console.error("currentUser が null です。ユーザーがログインしていません");
        return;
      }
  
      console.log("ログイン中のユーザー:", {
        uid: currentUser.uid,
        email: currentUser.email,
      }); // 確認用ログ
  
      // 認証トークンの取得
      const idToken = await currentUser.getIdToken();
      console.log("取得した ID トークン:", idToken);


      const auth = getAuth();
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          const token = await user.getIdToken();
          console.log("Token:", token);
        } else {
          console.log("User not authenticated");
        }
      });

      
      const headers = {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${idToken}`,
      };
  
      const response = await fetch('/api/create', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(users),
      });
  
      console.log("レスポンス:", response); // 確認用ログ
  
      if (!response.ok) {
        const data = await response.json();
        console.error("サーバーレスポンス:", data);
        throw new Error(data.error || 'Failed to create users');
      }
  
      console.log("ユーザー作成成功！");
      router.push('/admin/user');
    } catch (error) {
      console.error('Error creating users: ', error);
      setError('ユーザーの作成に失敗しました');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className={styles.container}>
      <div className={styles.titleArea}>
        <h1 className={styles.title}>アカウント追加</h1>
        <div> 
          {/* 
          <button type="button" onClick={handleAddRow} className={styles.addButton}>
            行を追加
          </button>
          <button
            type="button"
            onClick={(e) => {
              const event = new Event('submit', { bubbles: true, cancelable: true });
              e.currentTarget.form?.dispatchEvent(event);
              handleSubmit(event as unknown as React.FormEvent<HTMLFormElement>); // unknown を経由してキャスト
            }}
            disabled={loading}
            className={styles.addButton}
          >
            {loading ? '作成中...' : '作成'}
          </button>*/}

        </div>
      </div>

      {error && <div className={styles.error}>{error}</div>}
      <div style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 200px)' }}>
        {/* formタグを追加 */}
        <form onSubmit={handleSubmit}>
          <div className={styles.tableArea}>
            <table className={styles.table}>
              <thead>
                <tr className={styles.tableHeader}>
                  <th>名前</th>
                  <th>メールアドレス</th>
                  <th>所属</th>
                  <th>権限</th>
                  <th>初期パスワード</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={index} className={styles.tableRow}>
                    <td>
                      <input
                        type="text"
                        value={user.name}
                        onChange={(e) => handleInputChange(index, 'name', e.target.value)}
                        required
                        className={styles.input}
                      />
                    </td>
                    <td>
                      <input
                        type="email"
                        value={user.email}
                        onChange={(e) => handleInputChange(index, 'email', e.target.value)}
                        required
                        className={styles.input}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={user.affiliation}
                        onChange={(e) => handleInputChange(index, 'affiliation', e.target.value)}
                        required
                        className={styles.input}
                      />
                    </td>
                    <td>
                      <select
                        value={user.role}
                        onChange={(e) => handleInputChange(index, 'role', e.target.value)}
                        className={styles.select}
                      >
                        <option value="admin">管理者</option>
                        <option value="user">ユーザー</option>
                      </select>
                    </td>
                    <td>
                      <input
                        type="text"
                        value={user.password || ''}
                        onChange={(e) => handleInputChange(index, 'password', e.target.value)}
                        className={styles.input}
                      />
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => setUsers(users.filter((_, i) => i !== index))}
                        className={styles.deleteButton}
                      >
                        削除
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button type="button" onClick={handleAddRow} className={styles.addButton}>
            行を追加
          </button>
          <button type="submit" disabled={loading} className={styles.addButton}>
            {loading ? '作成中...' : '作成'}
          </button> 
        </form>
      </div>
    </div>
  );
};

export default AddUser;