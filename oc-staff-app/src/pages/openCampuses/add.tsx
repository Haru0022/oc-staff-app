import React, { useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../../styles/openCampusesAdd.module.css';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import * as XLSX from 'xlsx';

type Member = {
  名前: string;
  フリガナ: string;
  性別: string;
  高校名: string;
  学年: string;
  参加学科: string; // 変更
  参加回数: string; //数値の場合あり
  /*
  同伴者: string;
  同伴者人数: string; //数値の場合あり
  */
};

const OpenCampusesAdd: React.FC = () => {
  const [title, setTitle] = useState('');
  const [memo, setMemo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [importedData, setImportedData] = useState<Member[]>([]);
  const router = useRouter();

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleMemoChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMemo(event.target.value);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (!file) {
      alert("ファイルを選択してください");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const data = event.target?.result;
      if (!data) return;

      const workbook = XLSX.read(data, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const members: Member[] = XLSX.utils.sheet_to_json(sheet);
      console.log("インポートしたデータ (members):", members); // members 配列の内容をコンソールに出力
      setImportedData(members); // インポートしたデータをステートに設定
    };

    reader.onerror = (error) => {
      console.error("Error reading file: ", error);
      setError('ファイルの読み込みに失敗しました');
    };

    reader.readAsBinaryString(file);
  };

  const handleRegister = async () => {
    // TODO: 登録処理を実装
    alert('登録処理 (未実装)');
  };

  

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleInputArea}>
          <label htmlFor="title">タイトル</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={handleTitleChange}
            className={styles.input}
          />
        </div>
        <div className={styles.memoInputArea}>
          <label htmlFor="memo">メモ</label>
          <textarea
            id="memo"
            value={memo}
            onChange={handleMemoChange}
            className={styles.textarea}
          />
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.tableArea}>
          {/* インポートしたデータを表示するテーブル */}
          <table className={styles.table}>
            <thead>
              <tr className={styles.tableHeader}>
              <th>名前</th>
                <th>フリガナ</th>
                <th>性別</th>
                <th>高校名</th>
                <th>学年</th>
                <th>参加学科</th>
                <th>参加回数</th>
                {/* <th>同伴者</th> 削除 */}
                {/* <th>同伴者人数</th> 削除 */}
                {/* <th></th> 詳細ボタン用の空ヘッダ */}
              </tr>
            </thead>
            <tbody>
              {importedData.map((member, index) => (
                <tr key={index} className={styles.tableRow}>
                  <td>{member.名前}</td>
                  <td>{member.フリガナ}</td>
                  <td>{member.性別}</td>
                  <td>{member.高校名}</td>
                  <td>{member.学年}</td>
                  <td>{member.参加学科}</td>
                  <td>{member.参加回数}</td>
                  {/* <td>{member.同伴者}</td> 削除 */}
                  {/* <td>{member.同伴者人数}</td> 削除 */}
                  {/* <td></td> 詳細ボタン用の空セル */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={styles.rightArea}>
          <div className={styles.importArea}>
            <input type="file" id="fileInput" accept=".xlsx, .xls" style={{ display: 'none' }} onChange={handleImport} />
            <label htmlFor="fileInput" className={styles.importButton}>
              ここでExcelファイルをインポート
            </label>
          </div>
          <div className={styles.countArea}>
            <p>
              参加者<span>{importedData.length}人</span>
            </p>
            <p>
              スタッフ<span>0人</span>
            </p>
          </div>
          <button
            className={styles.registerButton}
            onClick={handleRegister}
            disabled={isLoading}
          >
            {isLoading ? '登録中...' : '登録'}
          </button>
          {error && <p className={styles.error}>{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default OpenCampusesAdd;