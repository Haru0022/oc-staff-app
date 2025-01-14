// src/pages/index.tsx
import React from 'react';
import Sidebar from '../components/Sidebar'; // Sidebar コンポーネントをインポート

const Home: React.FC = () => {
  return (
    <div>
      <main style={{ marginLeft: '250px', padding: '20px' }}> {/* サイドバーの幅に合わせて調整 */}
        <h1>ホーム</h1>
        {/* ここにメインコンテンツを追加 */}
        <p>ここに表示したい内容を書いていきます。</p>
      </main>
    </div>
  );
};

export default Home;