import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import {doc, getDoc, collection, getDocs, Timestamp,} from 'firebase/firestore';
import { db } from '../../../../lib/firebase';
import styles from './[id].module.css';

interface PastEvent {
  id: string;
  openCampusId: string;
  date: Date;
  grade: string;
  subject: string;
  count: number; // participants ドキュメントの count と重複？
  memo: string;
}

interface Participant {
  id: string;
  name: string;
  gender: string;
  school: string;
  grade: string;
  subject: string;
  count: number; // pastEvents 内の count と重複？
  pastEvents: PastEvent[];
}

const MobileParticipantDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [participant, setParticipant] = useState<Participant | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchParticipant = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
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
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('参加者データの取得に失敗しました');
        }
      } finally {
        setIsLoading(false);
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

    // 非同期処理が不要になったため、pastEventsSnapshot.docs.map のみで処理
    return pastEventsSnapshot.docs.map((doc) => {
      const data = doc.data();

      return {
        id: doc.id,
        openCampusId: data.openCampusId, // openCampusId をそのまま使用
        date: (data.date as Timestamp).toDate(), // Timestamp から Date に変換
        grade: data.grade,
        subject: data.subject,
        count: data.count, // 注意: participants ドキュメントの count と重複している可能性があります
        memo: data.memo,
      };
    });
  };

  if (isLoading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
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
      <ul className={styles.pastEventsList}>
        {participant.pastEvents.map((event) => (
          <li key={event.id} className={styles.pastEventItem}>
            {/* 
            <div className={styles.eventInfo}>
              <span className={styles.eventLabel}>オープンキャンパス:</span>
              <span className={styles.eventValue}>{event.openCampusId}</span>
            </div>
            */}
            <div className={styles.eventInfo}>
              <span className={styles.eventLabel}>日付:</span>
              <span className={styles.eventValue}>
                {event.date.toLocaleDateString('ja-JP')}
              </span>
            </div>
            <div className={styles.eventInfo}>
              <span className={styles.eventLabel}>学年:</span>
              <span className={styles.eventValue}>{event.grade}</span>
            </div>
            <div className={styles.eventInfo}>
              <span className={styles.eventLabel}>参加学科:</span>
              <span className={styles.eventValue}>{event.subject}</span>
            </div>
            <div className={styles.eventInfo}>
              <span className={styles.eventLabel}>回数:</span>
              <span className={styles.eventValue}>{event.count}</span>
            </div>
            <div className={styles.eventInfo}>
              <span className={styles.eventLabel}>メモ:</span>
              <span className={styles.eventValue}>{event.memo}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

MobileParticipantDetailPage.displayName = 'MobileParticipantDetailPage';

export default MobileParticipantDetailPage;