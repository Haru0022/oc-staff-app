// pages/mobile/mypage.tsx
import { useState } from 'react';
// import { useMobileAuth } from '../../../lib/mobile/context/AuthContext'; // パスを修正, AuthContextを使わないのでコメントアウト
// import useRequireAuth from '../../hooks/useRequireAuth'; // useRequireAuth をインポート
import styles from './mypage.module.css';

const MobileMyPage = () => {
  // const { user, signOut, sendPasswordResetEmail } = useMobileAuth(); // useMobileAuth を使用 コメントアウト
  // useRequireAuth(); // useRequireAuth の呼び出しを削除
  const [email, setEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const [resetError, setResetError] = useState('');

  // const handleLogout = async () => {
  //   try {
  //     await signOut();
  //   } catch (error) {
  //     console.error('Error signing out:', error);
  //   }
  // };

  // const handlePasswordReset = async () => {
  //   setResetMessage('');
  //   setResetError('');

  //   if (!email) {
  //     setResetError('メールアドレスを入力してください。');
  //     return;
  //   }

  //   try {
  //     await sendPasswordResetEmail(email);
  //     setResetMessage('パスワードリセットメールを送信しました。');
  //   } catch (error: any) {
  //     console.error('Error sending password reset email:', error);
  //     // ... (エラーハンドリングは同じ)
  //     if (error.code === 'auth/user-not-found') {
  //         setResetError('登録されていないメールアドレスです。');
  //     } else if (error.code === 'auth/invalid-email'){
  //         setResetError('無効なメールアドレスです。');
  //     }
  //      else {
  //       setResetError('パスワードリセットメールの送信に失敗しました。');
  //     }
  //   }
  // };


  // useRequireAuth でローディング状態を管理しているので、ここでは不要
  // if (loading) {
  //   return <div className={styles.loading}>Loading...</div>;
  // }

  // useRequireAuth で未ログインの場合はリダイレクトされるので、ここでは user は必ず存在する
  // if (!user) {
  //   return null;
  // }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>マイページ</h1>
      {/* ダミーデータ表示 */}
      <p>ユーザー名: 大竹陽輝</p>
      <p>メールアドレス: zeal21418034@fsgcl.jp</p>
        {/* {user ? ( */}
            {/* <>
                <p>メールアドレス: {user.email}</p>
                <button onClick={handleLogout} className={styles.button}>
                    ログアウト
                </button>

                <h2 className={styles.subtitle}>パスワードリセット</h2>
                <p>
                    登録済みのメールアドレスを入力してパスワードをリセットしてください。
                </p>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="メールアドレス"
                    className={styles.input}
                />
                <button onClick={handlePasswordReset} className={styles.button}>
                    パスワードリセットメールを送信
                </button>
                {resetMessage && <p className={styles.message}>{resetMessage}</p>}
                {resetError && <p className={styles.error}>{resetError}</p>}
            </>
        ) : (
            <p>ログインしていません</p>
        )} */}
    </div>
  );
};

export default MobileMyPage;