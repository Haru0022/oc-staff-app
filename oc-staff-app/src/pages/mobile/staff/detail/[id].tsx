import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import {
  doc,
  getDoc,
  collection,
  getDocs,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../../../../lib/firebase';
import styles from './[id].module.css';

// 型定義 (必要に応じて lib/types.ts などに移動)
interface OpenCampusData {  // 使う場合のみ
  title: string;
  // 他の必要なフィールドもあれば追加
}

interface PastEvent {
  id: string;
  openCampusId: string; // オープンキャンパスのID *タイトルを表示したければ、別途取得処理が必要*
  date: Date;
  role: string; // 役割
  // 必要に応じて他のフィールドを追加（メモなど）
}

interface Staff {
  id: string;
  name: string;
  furigana: string;
  gender: string;
  department: string;
  grade: string;
  role: string;
  pastEvents: PastEvent[];
}

const MobileStaffDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [staff, setStaff] = useState<Staff | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStaff = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        const docRef = doc(db, 'staffs', id as string);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const pastEvents = await getPastEvents(id as string);
          setStaff({
            id: docSnap.id,
            ...docSnap.data(),
            pastEvents: pastEvents,
          } as Staff);
        } else {
          setError('スタッフが見つかりません');
        }
      } catch (error) {
        console.error('Error fetching staff: ', error);
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('スタッフデータの取得に失敗しました');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchStaff();
  }, [id]);

  const getPastEvents = async (staffId: string): Promise<PastEvent[]> => {
    const pastEventsRef = collection(db, 'staffs', staffId, 'pastEvents');
    const pastEventsSnapshot = await getDocs(pastEventsRef);

    return pastEventsSnapshot.docs.map((doc) => {
      const data = doc.data();

      return {
        id: doc.id,
        openCampusId: data.openCampusId, // そのまま openCampusId を使用 (必要に応じてタイトル取得処理を追加)
        date: (data.date as Timestamp).toDate(),
        role: data.role,
      };
    });
  };

  if (isLoading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (!staff) {
    return null;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{staff.name} さんの詳細</h1>
      <div className={styles.profileContainer}>
        <div className={styles.profileItem}>
          <span className={styles.profileLabel}>フリガナ:</span>
          <span className={styles.profileValue}>{staff.furigana}</span>
        </div>
        <div className={styles.profileItem}>
          <span className={styles.profileLabel}>性別:</span>
          <span className={styles.profileValue}>{staff.gender}</span>
        </div>
        <div className={styles.profileItem}>
          <span className={styles.profileLabel}>所属:</span>
          <span className={styles.profileValue}>{staff.department}</span>
        </div>
        <div className={styles.profileItem}>
          <span className={styles.profileLabel}>学年:</span>
          <span className={styles.profileValue}>{staff.grade}</span>
        </div>
      </div>

      <h2 className={styles.pastEventsTitle}>過去の担当イベント</h2>
      <ul className={styles.pastEventsList}>
        {staff.pastEvents.map((event) => (
          <li key={event.id} className={styles.pastEventItem}>
            {/* 
            <div className={styles.eventInfo}>
              <span className={styles.eventLabel}>オープンキャンパス:</span>
              <span className={styles.eventValue}>{event.openCampusId}</span>
            </div>*/}
            <div className={styles.eventInfo}>
              <span className={styles.eventLabel}>日付:</span>
              <span className={styles.eventValue}>
                {event.date.toLocaleDateString('ja-JP')}
              </span>
            </div>
            <div className={styles.eventInfo}>
              <span className={styles.eventLabel}>役割:</span>
              <span className={styles.eventValue}>{event.role}</span>
            </div>
            {/* 必要に応じて他の情報（メモなど）も表示 */}
          </li>
        ))}
      </ul>
    </div>
  );
};

MobileStaffDetailPage.displayName = 'MobileStaffDetailPage';

export default MobileStaffDetailPage;