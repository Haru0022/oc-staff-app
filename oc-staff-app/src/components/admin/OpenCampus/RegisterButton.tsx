import React from 'react';
import styles from '../../../styles/openCampusesAdd.module.css';

type Props = {
  isLoading: boolean;
  handleRegister: () => void;
};

const RegisterButton: React.FC<Props> = ({ isLoading, handleRegister }) => {
  return (
    <button
      className={styles.registerButton}
      onClick={handleRegister}
      disabled={isLoading}
    >
      {isLoading ? '登録中...' : '登録'}
    </button>
  );
};

export default RegisterButton;