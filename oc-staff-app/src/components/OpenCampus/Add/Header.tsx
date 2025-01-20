import React from 'react';
import styles from '../../../styles/openCampusesAdd.module.css';

type Props = {
  title: string;
  date: string;
  memo: string;
  handleTitleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleDateChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleMemoChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
};

const Header: React.FC<Props> = ({
  title,
  date,
  memo,
  handleTitleChange,
  handleDateChange,
  handleMemoChange,
}) => {
  return (
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
      <div className={styles.dateInputArea}>
        <label htmlFor="date">開催日</label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={handleDateChange}
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
  );
};

export default Header;