import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from '../../../styles/participants.module.css';
import { collection, query, where, getDocs, Query, DocumentData, QueryConstraint } from 'firebase/firestore';
import { db } from '../../../lib/firebase';

interface Participant {
  id: string;
  name: string;
  furigana: string;
  gender: string;
  highSchool: string;
  grade: string;
  subject: string;
  count: number;
}

const Participants: React.FC = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState<string>(''); // 検索バーの入力値用の状態
  const [searchQuery, setSearchQuery] = useState<string>(''); // 実際の検索キーワード用の状態

  // データ取得処理を関数として切り出し
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      let q: Query<DocumentData> = collection(db, 'participants');
      const querySnapshot = await getDocs(q);

      const participantsData: Participant[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        participantsData.push({
          id: doc.id,
          name: data.name,
          furigana: data.furigana,
          gender: data.gender,
          highSchool: data.school,
          grade: data.grade,
          subject: data.subject,
          count: data.count,
        });
      });

      setParticipants(participantsData);
    } catch (error) {
      console.error('Error fetching participants: ', error);
      setError('参加者データの取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  // 初回レンダリング時にデータ取得
  useEffect(() => {
    fetchData();
  }, []);

  // 検索実行用の関数
  const performSearch = () => {
    setSearchQuery(inputValue); // fetchDataに検索キーワードを渡す
  };

  // 検索キーワードは、検索ボタンがクリックされるまで更新しない
  const filteredParticipants = searchQuery === ''
  ? participants
  : participants.filter((participant) => {
      const searchableText = `${participant.name} ${participant.furigana} ${participant.highSchool}`;
      return searchableText.toLowerCase().includes(searchQuery.toLowerCase());
    });

  return (
    <div className={styles.container}>
      <div className={styles.searchArea}>
        <h1 className={styles.title}>参加者リスト</h1>
        <div className={styles.searchBarContainer}>
          <div className={styles.searchBar}>
            {/* 検索バー */}
            <input
              type="text"
              placeholder="検索..."
              className={styles.searchInput}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)} // 入力値の変更を inputValue ステートに反映
            />
            {/* 検索アイコンの onClick で performSearch を呼び出す */}
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
              <th>高校</th>
              <th>学年</th>
              <th>参加学科</th>
              <th>参加回数</th>
              <th>詳細</th>
            </tr>
          </thead>
          <tbody>
            {/* 検索結果でフィルタリングしたデータでテーブルをレンダリング*/}
            {filteredParticipants.map((participant) => (
              <tr key={participant.id} className={styles.tableRow}>
                <td>{participant.name}</td>
                <td>{participant.furigana}</td>
                <td>{participant.gender}</td>
                <td>{participant.highSchool}</td>
                <td>{participant.grade}</td>
                <td>{participant.subject}</td>
                <td>{participant.count}</td>
                <td>
                  {/* 詳細ページへのリンクは `/admin` を含めたパスに修正 */}
                  <Link href={`/admin/participant/detail/${participant.id}`}>
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

export default Participants;











/*
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from '../../../styles/participants.module.css';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../../lib/firebase';

interface Participant {
  id: string; // Firestore ドキュメント ID 用のフィールドを追加
  name: string;
  furigana: string;
  gender: string;
  highSchool: string;
  grade: string;
  subject: string;
  count: number;
}

const Participants: React.FC = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const participantsCollectionRef = collection(db, 'participants');
        const q = query(participantsCollectionRef); // 検索条件があればここで where を使う
        const querySnapshot = await getDocs(q);

        const participantsData: Participant[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          participantsData.push({
            id: doc.id, // Firestore ドキュメント ID を追加
            name: data.name,
            furigana: data.furigana,
            gender: data.gender,
            highSchool: data.school,
            grade: data.grade,
            subject: data.subject,
            count: data.count,
          });
        });

        setParticipants(participantsData);
      } catch (error) {
        console.error('Error fetching participants: ', error);
        setError('参加者データの取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    fetchParticipants();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.searchArea}>
        <h1 className={styles.title}>参加者リスト</h1>
        <div className={styles.searchBarContainer}>
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
        </div>
      </div>

      <div className={styles.tableArea}>
        <table className={styles.table}>
          <thead>
            <tr className={styles.tableHeader}>
              <th>名前</th>
              <th>フリガナ</th>
              <th>性別</th>
              <th>高校</th>
              <th>学年</th>
              <th>参加学科</th>
              <th>参加回数</th>
              <th>詳細</th>
            </tr>
          </thead>
          <tbody>
            {participants.map((participant) => (
              <tr key={participant.id} className={styles.tableRow}>
                <td>{participant.name}</td>
                <td>{participant.furigana}</td>
                <td>{participant.gender}</td>
                <td>{participant.highSchool}</td>
                <td>{participant.grade}</td>
                <td>{participant.subject}</td>
                <td>{participant.count}</td>
                <td>
                  <Link href={`/admin//participant/detail/${participant.id}`}>
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

export default Participants;*/