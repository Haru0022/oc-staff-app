import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from '../../../styles/staffs.module.css';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../../../lib/firebase';

interface Staff {
  id: string;
  name: string;
  furigana: string;
  gender: string;
  department: string;
  grade: string;
  // pastEvents プロパティを削除
}

// PastEvent インターフェースも不要なので削除

const Staffs: React.FC = () => {
  const [staffs, setStaffs] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const fetchStaffs = async () => {
      try {
        const staffsCollectionRef = collection(db, 'staffs');
        const staffsQuery = query(staffsCollectionRef); // 必要に応じて where で条件を指定
        const staffsSnapshot = await getDocs(staffsQuery);

        const staffsData: Staff[] = [];
        for (const doc of staffsSnapshot.docs) {
          const staffData = doc.data();
          // getPastEvents の呼び出しを削除

          staffsData.push({
            id: doc.id,
            name: staffData.name,
            furigana: staffData.furigana,
            gender: staffData.gender,
            department: staffData.department,
            grade: staffData.grade,
            // pastEvents へのデータ格納を削除
          });
        }

        setStaffs(staffsData);
      } catch (error) {
        console.error('Error fetching staffs: ', error);
        setError('スタッフデータの取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    fetchStaffs();
  }, []);

  // getPastEvents 関数自体を削除

  // 検索実行用の関数
  const performSearch = () => {
    setSearchQuery(inputValue);
  };

  // 検索キーワードに基づいてデータをフィルタリング
  const filteredStaffs = searchQuery === ''
    ? staffs
    : staffs.filter((staff) => {
        const searchableText = `${staff.name} ${staff.furigana} ${staff.department}`;
        return searchableText.toLowerCase().includes(searchQuery.toLowerCase());
      });

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.searchArea}>
        <h1 className={styles.title}>スタッフ一覧</h1>
        <div className={styles.searchBarContainer}>
          <div className={styles.searchBar}>
            <input
              type="text"
              placeholder="検索..."
              className={styles.searchInput}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <button className={styles.searchButton} onClick={performSearch}>
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
            {filteredStaffs.map((staff) => (
              <tr key={staff.id} className={styles.tableRow}>
                <td>{staff.name}</td>
                <td>{staff.furigana}</td>
                <td>{staff.gender}</td>
                <td>{staff.department}</td>
                <td>{staff.grade}</td>
                <td>
                  <Link href={`/admin/staff/detail/${staff.id}`}>
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

export default Staffs;
