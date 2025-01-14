import { useRouter } from 'next/router';
import React from 'react';
import styles from '../../../styles/ParticipantDetail.module.css'; // 修正されたパス

interface Participant {
  id: string;
  name: string;
  furigana: string;
  gender: string;
  highSchool: string;
  grade: string;
}

// ダミーデータ
const participantsData: Participant[] = [
  {
    id: '1',
    name: '伊藤 翔',
    furigana: 'イトウ ショウ',
    gender: '男性',
    highSchool: '福島東稜高校',
    grade: '2年',
  },
  // ... 必要に応じて他の参加者データも追加
];

const ParticipantDetail: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  // id に一致する参加者データを取得
  const participant = participantsData.find((p) => p.id === id);

  if (!participant) {
    return <div>参加者が見つかりません</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{participant.name} さんの詳細</h1>
      <div className={styles.profileContainer}>
        <div className={styles.profileItem}>
          <span className={styles.profileLabel}>フリガナ:</span>
          <span className={styles.profileValue}>{participant.furigana}</span>
        </div>
        <div className={styles.profileItem}>
          <span className={styles.profileLabel}>性別:</span>
          <span className={styles.profileValue}>{participant.gender}</span>
        </div>
        <div className={styles.profileItem}>
          <span className={styles.profileLabel}>高校:</span>
          <span className={styles.profileValue}>{participant.highSchool}</span>
        </div>
        <div className={styles.profileItem}>
          <span className={styles.profileLabel}>学年:</span>
          <span className={styles.profileValue}>{participant.grade}</span>
        </div>
      </div>
    </div>
  );
};

export default ParticipantDetail;