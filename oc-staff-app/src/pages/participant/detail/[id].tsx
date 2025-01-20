import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import styles from '../../../styles/ParticipantDetail.module.css';
import { doc, getDoc, collection, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebase';

interface PastEvent {
  id: string; // pastEvents の id を追加
  openCampusId: string;
  date: Date;
  grade: string;
  subject: string;
  count: number;
  memo: string;
}

interface Participant {
  id: string;
  name: string;
  gender: string;
  school: string;
  grade: string;
  subject: string;
  count: number;
  pastEvents: PastEvent[];
}

const ParticipantDetail: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [participant, setParticipant] = useState<Participant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchParticipant = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const docRef = doc(db, 'participants', id as string);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const pastEvents = await getPastEvents(id as string);
          setParticipant({
            id: docSnap.id,
            ...docSnap.data(),
            pastEvents: pastEvents,
          } as Participant);
        } else {
          setError('参加者が見つかりません');
        }
      } catch (error) {
        console.error('Error fetching participant: ', error);
        setError('参加者データの取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    fetchParticipant();
  }, [id]);

  const getPastEvents = async (participantId: string): Promise<PastEvent[]> => {
    const pastEventsRef = collection(
      db,
      'participants',
      participantId,
      'pastEvents'
    );
    const pastEventsSnapshot = await getDocs(pastEventsRef);
    return pastEventsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      date: (doc.data().date as Timestamp).toDate(), // Convert Timestamp to Date
    })) as PastEvent[];
  };

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }

  if (!participant) {
    return null;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{participant.name} さんの詳細</h1>
      <div className={styles.profileContainer}>
        <div className={styles.profileItem}>
          <span className={styles.profileLabel}>性別:</span>
          <span className={styles.profileValue}>{participant.gender}</span>
        </div>
        <div className={styles.profileItem}>
          <span className={styles.profileLabel}>高校:</span>
          <span className={styles.profileValue}>{participant.school}</span>
        </div>
        <div className={styles.profileItem}>
          <span className={styles.profileLabel}>学年:</span>
          <span className={styles.profileValue}>{participant.grade}</span>
        </div>
        <div className={styles.profileItem}>
          <span className={styles.profileLabel}>参加学科:</span>
          <span className={styles.profileValue}>{participant.subject}</span>
        </div>
        <div className={styles.profileItem}>
          <span className={styles.profileLabel}>参加回数:</span>
          <span className={styles.profileValue}>{participant.count}</span>
        </div>
      </div>

      <h2 className={styles.pastEventsTitle}>過去の参加イベント</h2>
      <table className={styles.pastEventsTable}>
        <thead>
          <tr className={styles.tableHeader}>
            <th>オープンキャンパスID</th>
            <th>日付</th>
            <th>学年</th>
            <th>参加学科</th>
            <th>回数</th>
            <th>メモ</th>
          </tr>
        </thead>
        <tbody>
          {participant.pastEvents.map((event) => (
            <tr key={event.id} className={styles.tableRow}>
              <td>{event.openCampusId}</td>
              <td>
                {event.date
                  ? event.date.toLocaleDateString('ja-JP')
                  : '日付未設定'}
              </td>
              <td>{event.grade}</td>
              <td>{event.subject}</td>
              <td>{event.count}</td>
              <td>{event.memo}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ParticipantDetail;