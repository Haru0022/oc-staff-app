import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import styles from '../../../../styles/ParticipantDetail.module.css';
import { doc, getDoc, collection, getDocs, Timestamp,updateDoc } from 'firebase/firestore';
import { db } from '../../../../lib/firebase';
import 'bootstrap/dist/css/bootstrap.min.css'; // BootstrapのCSSを読み込み
import Accordion from 'react-bootstrap/Accordion';
import Button from 'react-bootstrap/Button';
import Link from 'next/link';


interface PastEvent {
  id: string;
  openCampusId: string;
  date: Date;
  grade: string;
  subject: string;
  count: number;
  memos: string[];
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
  const [editingMemos, setEditingMemos] = useState<Record<string, string[]>>({});
  const [editingMemoIndices, setEditingMemoIndices] = useState<Record<string, number[]>>({});

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
    const pastEventsRef = collection(db, 'participants', participantId, 'pastEvents');
    const pastEventsSnapshot = await getDocs(pastEventsRef);
    return pastEventsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      date: (doc.data().date as Timestamp).toDate(),
      memos: doc.data().memos || [],
    })) as PastEvent[];
  };

  const handleAddMemo = (eventId: string) => {
    setEditingMemos({ ...editingMemos, [eventId]: [...(editingMemos[eventId] || []), ''] });
  };

  const handleMemoChange = (eventId: string, memoIndex: number, newMemo: string) => {
    setEditingMemos({
      ...editingMemos,
      [eventId]: (editingMemos[eventId] || []).map((memo, index) => (index === memoIndex ? newMemo : memo)),
    });
  };

  const handleSaveMemo = async (eventId: string, memoIndex: number) => {
    try {
      const eventRef = doc(db, 'participants', id as string, 'pastEvents', eventId);
      const newMemos = [...participant!.pastEvents.find(event => event.id === eventId)!.memos];
      newMemos[memoIndex] = editingMemos[eventId][memoIndex];
      await updateDoc(eventRef, { memos: newMemos });
      alert('メモを保存しました');

      // 編集状態を解除
      setEditingMemoIndices({
        ...editingMemoIndices,
        [eventId]: editingMemoIndices[eventId].filter((index) => index !== memoIndex),
      });
    } catch (error) {
      console.error('Error saving memo: ', error);
      alert('メモの保存に失敗しました');
    }
  };

  const handleDeleteMemo = async (eventId: string, memoIndex: number) => {
    try {
      const eventRef = doc(db, 'participants', id as string, 'pastEvents', eventId);
      const newMemos = [...participant!.pastEvents.find(event => event.id === eventId)!.memos];
      newMemos.splice(memoIndex, 1);
      await updateDoc(eventRef, { memos: newMemos });
      alert('メモを削除しました');
    } catch (error) {
      console.error('Error deleting memo: ', error);
      alert('メモの削除に失敗しました');
    }
  };

  const handleEditMemo = (eventId: string, memoIndex: number) => {
    setEditingMemoIndices({
      ...editingMemoIndices,
      [eventId]: [...(editingMemoIndices[eventId] || []), memoIndex],
    });
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
      <Accordion defaultActiveKey="0" className={styles.accordion}>
        {participant.pastEvents.map((event, index) => (
          <Accordion.Item eventKey={index.toString()} key={event.id}>
            <Accordion.Header>
              {event.date ? event.date.toLocaleDateString('ja-JP') : '日付未設定'} - {event.subject}
            </Accordion.Header>
            <Accordion.Body>
              <div>
                <p>学年: {event.grade}</p>
                <p>参加学科: {event.subject}</p>
                <p>回数: {event.count}</p>
                <div>
                  {event.memos.map((memo, memoIndex) => (
                    <div key={memoIndex} className={styles.memoContainer}>
                      {editingMemoIndices[event.id]?.includes(memoIndex) ? (
                        <textarea value={editingMemos[event.id]?.[memoIndex] || memo} onChange={(e) => handleMemoChange(event.id, memoIndex, e.target.value)} />
                      ) : (
                        <p>{memo}</p>
                      )}
                      <a href="#" className={styles.saveLink} onClick={() => handleSaveMemo(event.id, memoIndex)}>
                        保存
                      </a>
                      <a href="#" className={styles["delete-link"]} onClick={() => handleDeleteMemo(event.id, memoIndex)}>
                        削除
                      </a>
                      {!editingMemoIndices[event.id]?.includes(memoIndex) && (
                        <Button variant="secondary" onClick={() => handleEditMemo(event.id, memoIndex)}>編集</Button>
                      )}
                    </div>
                  ))}
                  {/*<Button variant="secondary" onClick={() => handleAddMemo(event.id)}>メモを追加</Button>*/}
                </div>
              </div>
              <Link href={`/admin/openCampuses/detail/${event.openCampusId}`}>
                <Button variant="primary">OC詳細</Button>
              </Link>
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  );
};

export default ParticipantDetail;

/*
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import styles from '../../../../styles/ParticipantDetail.module.css';
import { doc, getDoc, collection, getDocs, Timestamp,updateDoc } from 'firebase/firestore';
import { db } from '../../../../lib/firebase';
import 'bootstrap/dist/css/bootstrap.min.css'; // BootstrapのCSSを読み込み
import Accordion from 'react-bootstrap/Accordion';
import Button from 'react-bootstrap/Button';
import Link from 'next/link';


interface PastEvent {
  id: string;
  openCampusId: string;
  date: Date;
  grade: string;
  subject: string;
  count: number;
  memos: string[]; // メモを配列で保持
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
  const [editingMemos, setEditingMemos] = useState<Record<string, string[]>>({});

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
    const pastEventsRef = collection(db, 'participants', participantId, 'pastEvents');
    const pastEventsSnapshot = await getDocs(pastEventsRef);
    return pastEventsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      date: (doc.data().date as Timestamp).toDate(),
      memos: doc.data().memos || [],
    })) as PastEvent[];
  };

  const handleAddMemo = (eventId: string) => {
    console.log('handleAddMemo called with eventId:', eventId); // 関数呼び出しのログ
    setEditingMemos({ ...editingMemos, [eventId]: [...(editingMemos[eventId] || []), ''] });
    console.log('editingMemos:', editingMemos); // state 更新後のログ
  };
  /*
  const handleMemoChange = (eventId: string, memoIndex: number, newMemo: string) => {
    setEditingMemos({
      ...editingMemos,
      [eventId]: editingMemos[eventId].map((memo, index) => (index === memoIndex ? newMemo : memo)),
    });
  };
  */
/*
  const handleMemoChange = (eventId: string, memoIndex: number, newMemo: string) => {
    setEditingMemos({
      ...editingMemos,
      [eventId]: (editingMemos[eventId] || []).map((memo, index) => (index === memoIndex ? newMemo : memo)),
    });
  };

  const handleSaveMemo = async (eventId: string, memoIndex: number) => {
    try {
      const eventRef = doc(db, 'participants', id as string, 'pastEvents', eventId);
      const newMemos = [...participant!.pastEvents.find(event => event.id === eventId)!.memos];
      newMemos[memoIndex] = editingMemos[eventId][memoIndex];
      await updateDoc(eventRef, { memos: newMemos });
      alert('メモを保存しました');
    } catch (error) {
      console.error('Error saving memo: ', error);
      alert('メモの保存に失敗しました');
    }
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



  const handleDeleteMemo = async (eventId: string, memoIndex: number) => {
    try {
      const eventRef = doc(db, 'participants', id as string, 'pastEvents', eventId);
      const newMemos = [...participant!.pastEvents.find(event => event.id === eventId)!.memos];
      newMemos.splice(memoIndex, 1); // 指定されたインデックスのメモを削除
      await updateDoc(eventRef, { memos: newMemos });
      alert('メモを削除しました');
    } catch (error) {
      console.error('Error deleting memo: ', error);
      alert('メモの削除に失敗しました');
    }
  };

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
      <Accordion defaultActiveKey="0" className={styles.accordion}>
        {participant.pastEvents.map((event, index) => (
          <Accordion.Item eventKey={index.toString()} key={event.id}>
            <Accordion.Header>
              {event.date ? event.date.toLocaleDateString('ja-JP') : '日付未設定'} - {event.subject}
            </Accordion.Header>
            <Accordion.Body>
              <div>
                <p>学年: {event.grade}</p>
                <p>参加学科: {event.subject}</p>
                <p>回数: {event.count}</p>
                <div>
                  {event.memos.map((memo, memoIndex) => (
                    <div key={memoIndex} className={styles.memoContainer}>
                      <textarea value={editingMemos[event.id]?.[memoIndex] || memo} onChange={(e) => handleMemoChange(event.id, memoIndex, e.target.value)} />
                      <Button variant="secondary" onClick={() => handleSaveMemo(event.id, memoIndex)}>保存</Button>
                      {/*<Button variant="danger" onClick={() => handleDeleteMemo(event.id, memoIndex)}>削除</Button> 
                      <a href="#" className={styles["delete-link"]} onClick={() => handleDeleteMemo(event.id, memoIndex)}>削除</a>
                    </div>
                  ))}
                  {editingMemos[event.id]?.map((editingMemo, memoIndex) => ( // editingMemos に含まれるメモを textarea で表示
                    <div key={memoIndex} className={styles.memoContainer}>
                      <textarea value={editingMemo} onChange={(e) => handleMemoChange(event.id, memoIndex, e.target.value)} />
                      <Button variant="secondary" onClick={() => handleSaveMemo(event.id, memoIndex)}>保存</Button>
                    </div>
                  ))}
                  <Button variant="secondary" onClick={() => handleAddMemo(event.id)}>メモを追加</Button>
                </div>
                              </div>
              <Link href={`/admin/openCampus/${event.openCampusId}`}>
                <Button variant="primary">OC詳細</Button>
              </Link>
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  );
};

export default ParticipantDetail;
*/