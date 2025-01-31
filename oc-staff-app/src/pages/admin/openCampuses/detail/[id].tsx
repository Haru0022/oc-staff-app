import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import styles from '../../../../styles/OpenCampusDetail.module.css';
import { doc, getDoc, collection, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../../../../lib/firebase';

interface PastEvent {
  id: string;
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
  furigana: string;
  gender: string;
  school: string;
  grade: string;
  subject: string;
  count: number;
  pastEvents: PastEvent[];
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

interface OpenCampus {
  id: string;
  title: string;
  date: Date;
  memo: string;
  participantsCount: number;
  staffCount: number;
  participants: Participant[];
  staffs: Staff[];
}

const OpenCampusDetail: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [openCampus, setOpenCampus] = useState<OpenCampus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [displayData, setDisplayData] = useState<'participants' | 'staffs'>(
    'participants'
  );

  useEffect(() => {
    const fetchOpenCampus = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const docRef = doc(db, 'openCampuses', id as string);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const participants = await getParticipants(id as string);
          const staffs = await getStaffs(id as string);

          setOpenCampus({
            id: docSnap.id,
            ...docSnap.data(),
            date: docSnap.data().date.toDate(),
            participants,
            staffs,
          } as OpenCampus);
        } else {
          setError('オープンキャンパスが見つかりません');
        }
      } catch (error) {
        console.error('Error fetching open campus: ', error);
        setError('オープンキャンパスデータの取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    fetchOpenCampus();
  }, [id]);

  const getParticipants = async (openCampusId: string) => {
    const participantsRef = collection(
      db,
      'openCampuses',
      openCampusId,
      'participants'
    );
    const participantsSnapshot = await getDocs(participantsRef);
    return participantsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Participant[];
  };

  const getStaffs = async (openCampusId: string) => {
    const staffsRef = collection(db, 'openCampuses', openCampusId, 'staffs');
    const staffsSnapshot = await getDocs(staffsRef);
    return staffsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Staff[];
  };

  const showParticipants = () => setDisplayData('participants');
  const showStaffs = () => setDisplayData('staffs');

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }

  if (!openCampus) {
    return null;
  }

  const currentData =
    displayData === 'participants' ? openCampus.participants : openCampus.staffs;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.info}>
          <div className={styles.date}>
            {/* 日付をフォーマット */}
            {openCampus.date
              .toLocaleDateString('ja-JP', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })
              .replace(/\s/g, '')}
          </div>
          <div className={styles.title}>{openCampus.title}</div>
          <div className={styles.memo}>{openCampus.memo}</div>
        </div>
        <div className={styles.counts}>
          {/* 参加者ボタン */}
          <button
            className={`${styles.countButton} ${
              displayData === 'participants' ? styles.active : ''
            }`}
            onClick={showParticipants}
          >
            参加者 <span>{openCampus.participants.length}人</span>
          </button>
          {/* スタッフボタン */}
          <button
            className={`${styles.countButton} ${
              displayData === 'staffs' ? styles.active : ''
            }`}
            onClick={showStaffs}
          >
            学生スタッフ <span>{openCampus.staffs.length}人</span>
          </button>
        </div>
      </div>

      <div className={styles.tableArea}>
        <table className={styles.table}>
          <thead>
            <tr className={styles.tableHeader}>
              <th>名前</th>
              {displayData === 'staffs' && <th>フリガナ</th>}
              <th>性別</th>
              <th>
                {displayData === 'participants' ? '高校名' : '所属学科'}
              </th>
              <th>学年</th>
              {displayData === 'participants' && <th>参加学科</th>}
              {displayData === 'participants' && <th>回数</th>}
              {displayData === 'staffs' && <th>役割</th>}
              <th>詳細</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((member) => (
              <tr key={member.id} className={styles.tableRow}>
                <td>
                  <div className={styles.nameContainer}>
                    {displayData === 'staffs' && (
                      <span className={styles.furigana}>
                        {member.furigana}
                      </span>
                    )}
                    <span className={styles.name}>{member.name}</span>
                  </div>
                </td>
                <td>
                  <div className={styles.innerCell}>{member.gender}</div>
                </td>
                <td>
                  <div className={styles.innerCell}>
                    {/* 参加者とスタッフで表示する内容を切り替え */}
                    {displayData === 'participants'
                      ? (member as any).school
                      : (member as any).department}
                  </div>
                </td>
                <td><div className={styles.innerCell}>{member.grade}</div></td>
                <td>
                  {/* 参加者の場合のみ表示 */}
                  {displayData === 'participants' && (
                    <div className={styles.innerCell}>
                      {(member as any).subject}
                    </div>
                  )}
                </td>
                <td>
                  {/* 参加者の場合のみ表示 */}
                  {displayData === 'participants' && (
                    <div className={styles.innerCell}>
                      {(member as any).count}
                    </div>
                  )}
                </td>
                <td>
                  {/* スタッフの場合のみ表示 */}
                  {displayData === 'staffs' && (
                    <div className={styles.innerCell}>
                      {(member as any).role}
                    </div>
                  )}
                </td>
                <td>
                  {/* 詳細ボタン */}
                  <button className={styles.detailButton}>
                    <svg
                      className={styles.detailIcon}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 20h9" />
                      <path
                        d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"
                      />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OpenCampusDetail;