import React from 'react';
import styles from '../styles/staffs.module.css';

// ダミーデータ
const participantsData = [
  {
    name: '大竹 陽輝',
    furigana: 'オオタケ ハルキ',
    gender: '男性',
    department: '高度情報工学科',
    grade: '4年',
  },
  // 必要に応じて、他の参加者データも追加
];

const Participants: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.searchArea}>
        <h1 className={styles.title}>スタッフリスト</h1>
        <div className={styles.searchBarContainer}>
          {/* 検索バー（見た目だけ） */}
          <div className={styles.searchBar}>
            <input type="text" placeholder="検索..." className={styles.searchInput} />
            <button className={styles.searchButton}>
              <svg
                className={styles.searchIcon}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      <div className={styles.tableArea}>
        <table className={styles.table}>
          <thead>
            <tr className={styles.tableHeader}>
              <th>名前</th>
              <th>フリガナ</th>
              <th>性別</th>
              <th>所属学科</th>
              <th>学年</th>
              <th>詳細</th>
            </tr>
          </thead>
          <tbody>
            {participantsData.map((participant, index) => (
              <tr key={index} className={styles.tableRow}>
                <td>{participant.name}</td>
                <td>{participant.furigana}</td>
                <td>{participant.gender}</td>
                <td>{participant.department}</td>
                <td>{participant.grade}</td>
                <td>
                  {/* 詳細ボタン（見た目だけ） */}
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
                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
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

export default Participants;