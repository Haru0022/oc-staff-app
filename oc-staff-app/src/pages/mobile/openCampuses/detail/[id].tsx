import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { doc, getDoc, collection, getDocs, } from 'firebase/firestore';
import { db } from '../../../../lib/firebase';
import styles from './[id].module.css';

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
  gender: string;
  school: string;
  grade: string;
  subject: string;
  count: number;
}

interface Staff {
  id: string;
  name: string;
  furigana: string;
  gender: string;
  department: string;
  grade: string;
  role: string;
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

const OpenCampusDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [openCampus, setOpenCampus] = useState<OpenCampus | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [displayData, setDisplayData] =
    useState<'participants' | 'staffs'>('participants');

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        const docRef = doc(db, 'openCampuses', id as string);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const participants = await getParticipants(id as string);
          const staffs = await getStaffs(id as string);

          setOpenCampus({
            id: docSnap.id,
            title: docSnap.data().title,
            date: docSnap.data().date.toDate(),
            memo: docSnap.data().memo,
            participantsCount: docSnap.data().participantsCount,
            staffCount: docSnap.data().staffCount,
            participants,
            staffs,
          });
        } else {
          setError('オープンキャンパスが見つかりません');
        }
      } catch (err) {
        console.error('Error fetching open campus: ', err);
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('オープンキャンパスデータの取得に失敗しました');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
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

  if (isLoading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
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
            {openCampus.date.toLocaleDateString('ja-JP', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>
          <div className={styles.title}>{openCampus.title}</div>
          <div className={styles.memo}>{openCampus.memo}</div>
        </div>
        <div className={styles.counts}>
          <button
            className={`${styles.countButton} ${
              displayData === 'participants' ? styles.active : ''
            }`}
            onClick={showParticipants}
          >
            参加者 <span>{openCampus.participants.length}人</span>
          </button>
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

      <div className={styles.listArea}>
        <ul className={styles.list}>
          {currentData.map((member) => (
            <li key={member.id} className={styles.listItem}>
              <div className={styles.memberInfo}>
                <span className={styles.memberName}>{member.name}</span>
                {displayData === 'staffs' && (
                  <span className={styles.memberFurigana}>
                    {(member as Staff).furigana}
                  </span>
                )}
              </div>
              <div className={styles.memberInfo}>
                <span className={styles.memberGender}>{member.gender}</span>
                <span className={styles.memberSubInfo}>
                  {displayData === 'participants'
                    ? (member as Participant).school
                    : (member as Staff).department}
                </span>
                <span className={styles.memberSubInfo}>{member.grade}</span>
                {displayData === 'participants' && (
                  <span className={styles.memberSubInfo}>
                    {(member as Participant).subject}
                  </span>
                )}
                {displayData === 'participants' && (
                  <span className={styles.memberSubInfo}>
                    {(member as Participant).count}回
                  </span>
                )}
                {displayData === 'staffs' && (
                  <span className={styles.memberSubInfo}>
                    {(member as Staff).role}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

OpenCampusDetailPage.displayName = 'OpenCampusDetailPage';

export default OpenCampusDetailPage;