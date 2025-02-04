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