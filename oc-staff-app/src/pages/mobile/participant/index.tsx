/*

import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import styles from './participants.module.css';
import Link from 'next/link';

interface Participant {
  id: string;
  name: string;
  school: string;
  grade: string;
  subject: string;
}

export const getStaticProps: GetStaticProps<{ participants: Participant[] }> = async () => {
  const participantsRef = collection(db, 'participants');
  const q = query(participantsRef, orderBy('name', 'asc'));
  const querySnapshot = await getDocs(q);

  const participants: Participant[] = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    name: doc.data().name,
    school: doc.data().school,
    grade: doc.data().grade,
    subject: doc.data().subject,
  }));

  return {
    props: {
      participants,
    },
    revalidate: 60,
  };
};

const MobileParticipantsPage = ({
  participants,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>参加者一覧</h1>
      <ul className={styles.list}>
        {participants.map((participant) => (
          <Link
            href={`/mobile/participant/detail/${participant.id}`}
            key={participant.id}
          >
            <li className={styles.listItem}>
              <div className={styles.participantInfo}>
                <span className={styles.participantName}>
                  {participant.name}
                </span>
                <span className={styles.participantGrade}>
                  {participant.grade}
                </span>
                <span className={styles.participantSubject}>
                  {participant.subject}
                </span>
              </div>
              <div className={styles.participantInfo}>
                <span className={styles.participantSchool}>
                  {participant.school}
                </span>
              </div>
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
};

MobileParticipantsPage.displayName = 'MobileParticipantsPage';

export default MobileParticipantsPage;

*/

import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../../../lib/firebase'; // 正しいパスに修正
import styles from './participants.module.css';
import Link from 'next/link';

interface Participant {
  id: string;
  name: string;
  school: string;
  grade: string;
  subject: string | null; // subject の型を string | null に変更
}

export const getStaticProps: GetStaticProps<{ participants: Participant[] }> = async () => {
  const participantsRef = collection(db, 'participants');
  const q = query(participantsRef, orderBy('name', 'asc')); // 必要であればソート条件を追加
  const querySnapshot = await getDocs(q);

  const participants: Participant[] = querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.name,
      school: data.school,
      grade: data.grade,
      subject: data.subject ?? null, // subject が undefined の場合は null に
      // または
      // subject: data.subject || '', // subject が undefined/null/空文字 の場合は 空文字 に
    };
  });

  return {
    props: {
      participants,
    },
    revalidate: 60,
  };
};

const MobileParticipantsPage = ({
  participants,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>参加者一覧</h1>
      <ul className={styles.list}>
        {participants.map((participant) => (
          <Link
            href={`/mobile/participant/detail/${participant.id}`}
            key={participant.id}
            passHref
          >
            <li className={styles.listItem}>
              <div className={styles.participantInfo}>
                <span className={styles.participantName}>
                  {participant.name}
                </span>
                <span className={styles.participantGrade}>
                  {participant.grade}
                </span>
                <span className={styles.participantSubject}>
                  {/* Nullish coalescing operator (??) を使用 */}
                  {participant.subject ?? ''}
                  {/* または、デフォルト値を設定 */}
                  {/* {participant.subject || '未設定'} */}
                </span>
              </div>
              <div className={styles.participantInfo}>
                <span className={styles.participantSchool}>
                  {participant.school}
                </span>
              </div>
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
};

MobileParticipantsPage.displayName = 'MobileParticipantsPage';

export default MobileParticipantsPage;