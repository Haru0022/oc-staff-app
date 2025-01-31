import React from 'react';
import styles from '../../../styles/openCampusesAdd.module.css';

type Props = {
  importedDataLength: number;
  staffDataLength: number;
  displayData: 'participants' | 'staffs';
  showParticipants: () => void;
  showStaffs: () => void;
};

const CountArea: React.FC<Props> = ({
  importedDataLength,
  staffDataLength,
  displayData,
  showParticipants,
  showStaffs,
}) => {
  return (
    <div className={styles.countArea}>
      <p>
        参加者
        <span
          className={displayData === 'participants' ? styles.activeCount : ''}
          onClick={showParticipants}
        >
          {importedDataLength}人
        </span>
      </p>
      <p>
        スタッフ
        <span
          className={displayData === 'staffs' ? styles.activeCount : ''}
          onClick={showStaffs}
        >
          {staffDataLength}人
        </span>
      </p>
    </div>
  );
};

export default CountArea;