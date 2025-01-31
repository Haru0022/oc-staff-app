import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import styles from '../../../../styles/StaffDetail.module.css'; // 新規作成する CSS ファイル
import { doc, getDoc, collection, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../../../../lib/firebase';

interface PastEvent {
  id: string;
  openCampusId: string;
  date: Date;
  role: string;
}

interface Staff {
  id: string;
  name: string;
  furigana: string;
  gender: string;
  department: string;
  grade: string;
  pastEvents: PastEvent[];
}

const StaffDetail: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [staff, setStaff] = useState<Staff | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStaff = async () => {
      if (!id) return;

      try {
        setLoading(true);
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
        setError('スタッフデータの取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, [id]);

  const getPastEvents = async (staffId: string): Promise<PastEvent[]> => {
    const pastEventsRef = collection(db, 'staffs', staffId, 'pastEvents');
    const pastEventsSnapshot = await getDocs(pastEventsRef);
    return pastEventsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      date: (doc.data().date as Timestamp).toDate(),
    })) as PastEvent[];
  };

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
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
          <span className={styles.profileLabel}>所属学科:</span>
          <span className={styles.profileValue}>{staff.department}</span>
        </div>
        <div className={styles.profileItem}>
          <span className={styles.profileLabel}>学年:</span>
          <span className={styles.profileValue}>{staff.grade}</span>
        </div>
      </div>

      <h2 className={styles.pastEventsTitle}>過去の担当イベント</h2>
      <table className={styles.pastEventsTable}>
        <thead>
          <tr className={styles.tableHeader}>
            <th>オープンキャンパスID</th>
            <th>日付</th>
            <th>役割</th>
          </tr>
        </thead>
        <tbody>
          {staff.pastEvents.map((event) => (
            <tr key={event.id} className={styles.tableRow}>
              <td>{event.openCampusId}</td>
              <td>
                {event.date
                  ? event.date.toLocaleDateString('ja-JP')
                  : '日付未設定'}
              </td>
              <td>{event.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StaffDetail;