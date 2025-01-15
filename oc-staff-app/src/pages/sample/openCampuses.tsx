import React from 'react';
import Link from 'next/link';
import styles from '../styles/openCampuses.module.css';

// オープンキャンパス一覧用ダミーデータ
const openCampusesData = [
  {
    id: '1',
    title: '夏のオープンキャンパス',
    date: '2024/8/1',
    participantsCount: 50,
    staffCount: 10
  },
  {
    id: '2',
    title: '秋のオープンキャンパス',
    date: '2024/10/15',
    participantsCount: 80,
    staffCount: 15
  },
  {
    id: '3',
    title: 'オンラインオープンキャンパス',
    date: '2024/11/20',
    participantsCount: 120,
    staffCount: 5
  },
  // ... 必要に応じて他のオープンキャンパスデータも追加
];

const OpenCampuses: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.searchArea}>
        <h1 className={styles.title}>オープンキャンパス一覧</h1>
        <div className={styles.searchBarContainer}>
          {/* 検索バー */}
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
          {/* オープンキャンパス追加ボタン */}
          <Link href="/openCampuses/add">
            <button className={styles.addButton}>
              オープンキャンパス追加
            </button>
          </Link>
        </div>
      </div>

      <div className={styles.tableArea}>
        <table className={styles.table}>
          <thead>
            <tr className={styles.tableHeader}>
              <th>タイトル</th>
              <th>年月日</th>
              <th>参加者数</th>
              <th>スタッフ数</th>
              <th>詳細</th>
            </tr>
          </thead>
          <tbody>
            {openCampusesData.map((oc) => (
              <tr key={oc.id} className={styles.tableRow}>
                <td>{oc.title}</td>
                <td>{oc.date}</td>
                <td>{oc.participantsCount}</td>
                <td>{oc.staffCount}</td>
                <td>
                  <Link href={`/openCampuses/detail/${oc.id}`}>
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
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OpenCampuses;