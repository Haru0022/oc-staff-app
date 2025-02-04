import React, { useState } from "react";
import { useAuth } from "../../admin/context/AuthContext";
import { useRouter } from "next/router";

// MobileLogin コンポーネントの定義。モバイル版のログイン画面を生成。
const MobileLogin: React.FC = () => {
  // メールアドレスを管理する状態変数。初期値は空文字。
  const [email, setEmail] = useState("");
  // パスワードを管理する状態変数。初期値は空文字。
  const [password, setPassword] = useState("");
  // エラーメッセージを管理する状態変数。初期値は null。
  const [error, setError] = useState<string | null>(null);
  // useRouter フックを使って、Next.js の useRouter を取得。
  const router = useRouter();
  // useAuth フックを使って、AuthContext から認証関連の関数を取得。
  const { signInWithEmailAndPassword } = useAuth();

  // フォーム送信時の処理を定義する非同期関数。
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    // フォームのデフォルトの送信動作をキャンセル。
    event.preventDefault();
    // エラーメッセージをリセット。
    setError(null);

    // ログイン処理を試みる。
    try {
      // AuthContext から取得した signInWithEmailAndPassword 関数を使って、
      // メールアドレスとパスワードでログインを試みる。
      await signInWithEmailAndPassword(email, password);
      // ログイン成功後、モバイル版のトップページ（/mobile/home）にリダイレクト。
      router.push("/mobile/home");
    } catch (error: any) {
      // ログイン失敗時、エラーメッセージを状態変数に設定。
      setError(error.message);
    }
  };

  // コンポーネントのレンダリング。
  return (
    <div>
      {/* モバイル版ログイン画面の見出し */}
      <h1>モバイル版ログイン</h1>
      {/* エラーメッセージが存在する場合、赤色のテキストで表示 */}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {/* ログインフォーム。onSubmit イベントで handleSubmit 関数を呼び出し */}
      <form onSubmit={handleSubmit}>
        <div>
          {/* メールアドレスのラベル */}
          <label htmlFor="email">メールアドレス:</label>
          {/* メールアドレス入力欄 */}
          <input
            type="email"
            id="email"
            value={email}
            // onChange イベントで入力値を email 状態変数に設定
            onChange={(e) => setEmail(e.target.value)}
            // 必須入力に設定
            required
          />
        </div>
        <div>
          {/* パスワードのラベル */}
          <label htmlFor="password">パスワード:</label>
          {/* パスワード入力欄 */}
          <input
            type="password"
            id="password"
            value={password}
            // onChange イベントで入力値を password 状態変数に設定
            onChange={(e) => setPassword(e.target.value)}
            // 必須入力に設定
            required
          />
        </div>
        {/* ログインボタン */}
        <button type="submit">ログイン</button>
      </form>
    </div>
  );
};

// MobileLogin コンポーネントをエクスポート。
export default MobileLogin;