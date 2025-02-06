// src/pages/_app.tsx

import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import Sidebar from '../components/Sidebar';
import MobileLayout from '../components/mobile/MobileLayout';
import '../styles/globals.css';
import { DataProvider } from '../admin/context/DataContext';
import { AuthProvider, useAuth  } from '../admin/context/AuthContext'; // AuthProviderをインポート
import { useEffect } from 'react';
//import 'bootstrap/dist/css/bootstrap.min.css'; // BootstrapのCSSを読み込み
function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isAdmin = router.pathname.startsWith('/admin');
  const isMobile = router.pathname.startsWith('/mobile');

  return (
    <AuthProvider>
      <DataProvider>
        {/*<AuthGuard isAdmin={isAdmin}>*/}
          <div style={{ display: 'flex', background: '#c0c0c0' }}>
            {isAdmin && <Sidebar />}
            <div style={{ width: '100%' }}>
              {isMobile ? (
                <MobileLayout>
                  <Component {...pageProps} />
                </MobileLayout>
              ) : (
                <Component {...pageProps} />
              )}
            </div>
          </div>
        {/*</AuthGuard>*/}
      </DataProvider>
    </AuthProvider>
  );
}

// 認証ガードのコンポーネント
/*
const AuthGuard: React.FC<{ isAdmin: boolean, children: React.ReactNode }> = ({ isAdmin, children }) => {
  const { currentUser, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (isAdmin && (!currentUser || currentUser.role !== 'admin')) {
      router.push('/auth/login');
    }
  }, [currentUser, loading, isAdmin, router]);

  if (loading || (isAdmin && !currentUser)) {
    return null; 
  }

  return <>{children}</>;
};
*/
export default MyApp;