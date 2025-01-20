import React from 'react';
import styles from '../../../styles/openCampusesAdd.module.css';

type Props = {
  handleImport: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const ImportArea: React.FC<Props> = ({ handleImport }) => {
  return (
    <div className={styles.importArea}>
      <input
        type="file"
        id="fileInput"
        accept=".xlsx, .xls"
        style={{ display: 'none' }}
        onChange={handleImport}
      />
      <label htmlFor="fileInput" className={styles.importButton}>
        ここでExcelファイルをインポート
      </label>
    </div>
  );
};

export default ImportArea;