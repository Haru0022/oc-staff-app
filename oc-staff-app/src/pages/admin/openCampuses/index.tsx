import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from '../../../styles/openCampuses.module.css';
import { collection, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebase';

interface OpenCampus {
  id: string;
  title: string;
  memo: string;
  date: Date;
  participantsCount: number;
  staffCount: number;
}

const OpenCampuses: React.FC = () => {
  const [openCampuses, setOpenCampuses] = useState<OpenCampus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOpenCampuses = async () => {
      try {
        const openCampusesCollection = collection(db, 'openCampuses');
        const openCampusesSnapshot = await getDocs(openCampusesCollection);
        const openCampusesData: OpenCampus[] = openCampusesSnapshot.docs.map(
          (doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              title: data.title,
              memo: data.memo,
              date: data.date.toDate(),
              participantsCount: data.participantsCount,
              staffCount: data.staffCount,
            };
          }
        );

        setOpenCampuses(openCampusesData);
      } catch (error) {
        console.error('Error fetching open campuses: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOpenCampuses();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.searchArea}>
        <h1 className={styles.title}>オープンキャンパス一覧</h1>
        <div className={styles.searchBar}>
          <input
            type="text"
            placeholder="検索..."
            className={styles.searchInput}
          />
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
        <Link href="/openCampuses/add">
          <button className={styles.addButton}>
            オープンキャンパス追加
          </button>
        </Link>
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
            {openCampuses.map((oc) => (
              <tr key={oc.id} className={styles.tableRow}>
                <td>{oc.title}</td>
                <td>
                  {oc.date
                    .toLocaleDateString('ja-JP')
                    .replace(/\//g, '/')}
                </td>
                <td>{oc.participantsCount}</td>
                <td>{oc.staffCount}</td>
                <td>
                  <Link href={`/admin/openCampuses/detail/${oc.id}`}>
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