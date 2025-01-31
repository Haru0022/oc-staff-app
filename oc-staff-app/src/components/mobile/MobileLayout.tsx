// components/mobile/MobileLayout.tsx
import React, { ReactNode } from 'react';
import MobileMenu from './MobileMenu';
import styles from './MobileLayout.module.css'; // CSSモジュールをインポート

interface Props {
  children: ReactNode;
}

const MobileLayout: React.FC<Props> = ({ children }) => {
  return (
    <div className={styles.mobileLayoutContainer}>
      <div className={styles.contentArea}>{children}</div>
      <MobileMenu />
    </div>
  );
};

export default MobileLayout;