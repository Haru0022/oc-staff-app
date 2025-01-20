import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../../lib/firebase';

interface Participant {
  id: string;
  name: string;
  school: string;
  grade: string;
  subject: string;
}

export const getStaticProps: GetStaticProps<{ participants: Participant[] }> = async () => {
  const participantsRef = collection(db, 'participants');
  const q = query(participantsRef, orderBy('name', 'asc')); // 名前で昇順にソート (必要に応じて変更)
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
    revalidate: 60, // データの再取得間隔 (秒) 必要に応じて変更
  };
};

const MobileParticipantsPage = ({ participants }: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <div style={{ padding: '16px' }}>
      <h1 style={{ marginBottom: '16px' }}>参加者一覧 (スマホ版)</h1>
      <ul>
        {participants.map((participant) => (
          <li key={participant.id} style={{ marginBottom: '8px', borderBottom: '1px solid #ccc', paddingBottom: '8px' }}>
            <p>名前: {participant.name}</p>
            <p>学校: {participant.school}</p>
            <p>学年: {participant.grade}</p>
            <p>参加学科: {participant.subject}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MobileParticipantsPage;