import React, { useState } from 'react';
import styles from '../../styles/openCampusesAdd.module.css';

const OpenCampusesAdd: React.FC = () => {
  const [title, setTitle] = useState('');
  const [memo, setMemo] = useState('');

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleMemoChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMemo(event.target.value);
  };

  const handleImport = () => {
    // TODO: Excel ファイルインポート処理を実装
    alert('Excel ファイルインポート処理 (未実装)');
  };

  const handleAddParticipant = () => {
    // TODO: 参加者追加処理を実装
    alert('参加者追加処理 (未実装)');
  };

  const handleRegister = () => {
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
          {/* 仮のテーブル */}
          <table className={styles.table}>
            <thead>
              <tr className={styles.tableHeader}>
                <th>名前</th>
                <th>フリガナ</th>
                <th>性別</th>
                <th>高校</th>
                <th>学年</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {/* 仮データ */}
              <tr className={styles.tableRow}>
                <td>伊藤 翔</td>
                <td>イトウ ショウ</td>
                <td>男性</td>
                <td>福島東稜高校</td>
                <td>2年</td>
                <td></td>
              </tr>
              <tr className={styles.tableRow}>
                <td>伊藤 翔</td>
                <td>イトウ ショウ</td>
                <td>男性</td>
                <td>福島東稜高校</td>
                <td>2年</td>
                <td></td>
              </tr>
              <tr className={styles.tableRow}>
                <td>伊藤 翔</td>
                <td>イトウ ショウ</td>
                <td>男性</td>
                <td>福島東稜高校</td>
                <td>2年</td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className={styles.rightArea}>
          <div className={styles.importArea}>
            <button className={styles.importButton} onClick={handleImport}>ここでExcelファイルをインポート</button>
          </div>
          <div className={styles.countArea}>
            <p>参加者<span>1人</span></p>
            <p>スタッフ<span>0人</span></p>
          </div>
          <div className={styles.registrationArea}>
            <button className={styles.registerButton} onClick={handleRegister}>登録</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpenCampusesAdd;