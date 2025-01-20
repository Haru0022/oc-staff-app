import React from 'react';
import styles from '../../../styles/openCampusesAdd.module.css';

type Member = {
    名前: string;
    フリガナ: string;
    性別: string;
    高校名: string;
    学年: string;
    参加学科: string;
    参加回数: string;
  };
  
  // スタッフ用データ型を定義
  type Staff = {
    学科名: string;
    名前: string;
    フリガナ: string;
    学年: string;
    性別: string;
    役割: string; // 使われていないが、型定義には残しておく
  };

type Props = {
  displayData: 'participants' | 'staffs';
  currentData: Member[] | Staff[];
};

const Table: React.FC<Props> = ({ displayData, currentData }) => {
  return (
    <div className={styles.tableArea}>
      <table className={styles.table}>
        <thead>
          <tr className={styles.tableHeader}>
            <th>名前</th>
            {/*{displayData === 'staffs' && <th>フリガナ</th>}*/}
            <th>性別</th>
            <th>{displayData === 'participants' ? '高校名' : '所属学科'}</th>
            <th>学年</th>
            <th>{displayData === 'participants' ? '参加学科' : '役割'}</th>
            <th>{displayData === 'participants' ? '回数' : ''}</th>
            {/*{displayData === 'staffs' && <th>役割</th>}*/}
          </tr>
        </thead>
        <tbody>
          {currentData.map((member, index) => (
            <tr key={index} className={styles.tableRow}>
              <td>
                {/* 
                <div className={styles.nameContainer}>
                  {displayData === 'staffs' && (
                    <span className={styles.furigana}>
                      {member.フリガナ}
                    </span>
                  )}
                  <span className={styles.name}>{member.名前}</span>
                </div>*/}

                <div className={styles.nameContainer}>
                    <span className={styles.furigana}>
                      {member.フリガナ}
                    </span>
                  <span className={styles.name}>{member.名前}</span>
                </div>

              </td>
              <td><div className={styles.innerCell}>{member.性別}</div></td>
              <td>
                <div className={styles.innerCell}>
                  {displayData === 'participants'
                    ? (member as Member).高校名
                    : (member as Staff).学科名}
                </div>
              </td>
              <td><div className={styles.innerCell}>{member.学年}</div></td>
              <td>
                {displayData === 'participants' && (
                  <div className={styles.innerCell}>
                    {displayData === 'participants'
                    ? (member as Member).参加学科
                    : (member as Staff).役割}
                  </div>
                )}
              </td>
              <td>
                {displayData === 'participants' && (
                  <div className={styles.innerCell}>
                    {(member as Member).参加回数}
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;