import { useState, useEffect } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import styles from './openCampues.module.css';
import { InferGetStaticPropsType } from 'next';
import Link from 'next/link'; // Link コンポーネントをインポート

interface OpenCampus {
  id: string;
  title: string;
  date: string;
  staffCount: number; 
  participantsCount: number; 
}

const MobileHomePage = () => {
  const [openCampuses, setOpenCampuses] = useState<OpenCampus[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const openCampusesRef = collection(db, 'openCampuses');
        const q = query(openCampusesRef, orderBy('date', 'desc'));
        const querySnapshot = await getDocs(q);

        const openCampusesData: OpenCampus[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          title: doc.data().title,
          date: doc.data().date.toDate().toLocaleDateString('ja-JP'),
          staffCount: doc.data().staffCount, // 追加
          participantsCount: doc.data().participantsCount, // 追加
        }));

        setOpenCampuses(openCampusesData);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('データの取得中にエラーが発生しました。');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>オープンキャンパス一覧</h1>
      <ul className={styles.list}>
        {openCampuses.map((openCampus) => (
          <li key={openCampus.id} className={styles.listItem}>
            <Link href={`/mobile/openCampuses/detail/${openCampus.id}`}>
              <div className={styles.openCampusInfo}>
                <span className={styles.openCampusTitle}>{openCampus.title}</span>
                <span className={styles.openCampusDate}>{openCampus.date}</span>
              </div>
              <div className={styles.openCampusCounts}>
                <span className={styles.count}>
                  スタッフ: {openCampus.staffCount}名
                </span>
                <span className={styles.count}>
                  参加者: {openCampus.participantsCount}名
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

MobileHomePage.displayName = 'MobileHomePage';

export default MobileHomePage;