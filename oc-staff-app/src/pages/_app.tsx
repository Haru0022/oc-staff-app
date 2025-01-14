// src/pages/_app.tsx
import type { AppProps } from 'next/app';
import Sidebar from '../components/Sidebar'; // Sidebar コンポーネントをインポート
import '../styles/globals.css'; // グローバルCSSをインポート（必要に応じて）

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div style={{ display: 'flex', background:'#c0c0c0'}}>
      <Sidebar />
      <div style={{ width: '100%' }}> {/* minHeight: '100vh' を削除 */}
        <Component {...pageProps} />
      </div>
    </div>
  );
}

export default MyApp;