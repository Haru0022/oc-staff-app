

/*
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import styles from './staff.module.css'; // CSS モジュール名を変更
import Link from 'next/link';

// Staff 型の定義
interface Staff {
  id: string;
  name: string;
  furigana: string; // スタッフにはフリガナがある
  gender: string;
  department: string; // 所属部署
  grade: string;
  role: string;
}

// getStaticProps で staffs コレクションからデータを取得
export const getStaticProps: GetStaticProps<{ staffs: Staff[] }> = async () => {
  const staffsRef = collection(db, 'staffs'); // コレクション名を変更
  const q = query(staffsRef, orderBy('name', 'asc')); // 必要に応じてソート順を変更
  const querySnapshot = await getDocs(q);

  const staffs: Staff[] = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    name: doc.data().name,
    furigana: doc.data().furigana, // スタッフ用のフィールド
    gender: doc.data().gender,
    department: doc.data().department, // スタッフ用のフィールド
    grade: doc.data().grade,
    role: doc.data().role, // スタッフ用のフィールド

  }));

  return {
    props: {
      staffs, // props の名前を staffs に変更
    },
    revalidate: 60,
  };
};

// コンポーネント名を MobileStaffPage に変更
const MobileStaffPage = ({
  staffs, // props の名前を staffs に変更
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>スタッフ一覧</h1> 
      <ul className={styles.list}>
        {staffs.map((staff) => (
          <Link
            href={`/mobile/staff/detail/${staff.id}`} // リンク先を修正
            key={staff.id}
          >
            <li  className={styles.listItem}>
              <div className={styles.staffInfo}>
                <span className={styles.staffName}>{staff.name}</span>
                <span className={styles.staffFurigana}>
                  {staff.furigana}
                </span>
                <span className={styles.staffDepartment}>
                    {staff.department}
                </span>
                <span className={styles.staffGrade}>{staff.grade}</span>
                
                <span className={styles.staffRole}>{staff.role}</span>
              </div>
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
};

MobileStaffPage.displayName = 'MobileStaffPage';

export default MobileStaffPage;

*/


import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import styles from './staff.module.css'; // CSS モジュール名を変更
import Link from 'next/link';

interface Staff {
  id: string;
  name: string;
  furigana?: string; // オプショナルにする
  gender: string;
  department: string;
  grade: string;
  role?: string | null; // string | null またはオプショナルにする
}

export const getStaticProps: GetStaticProps<{ staffs: Staff[] }> = async () => {
  const staffsRef = collection(db, 'staffs');
  const q = query(staffsRef, orderBy('name', 'asc')); // 必要に応じてソート
  const querySnapshot = await getDocs(q);

  const staffs: Staff[] = querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.name,
      furigana: data.furigana, // undefined の可能性あり
      gender: data.gender,
      department: data.department,
      grade: data.grade,
      role: data.role ?? null, // undefined の場合は null (または "" など)
    };
  });

  return {
    props: {
      staffs,
    },
    revalidate: 60,
  };
};

const MobileStaffsPage = ({
  staffs,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>スタッフ一覧</h1>
      <ul className={styles.list}>
        {staffs.map((staff) => (
          <Link href={`/mobile/staff/detail/${staff.id}`} key={staff.id} passHref>
            <li className={styles.listItem}>
              <div className={styles.staffInfo}>
                <span className={styles.staffName}>{staff.name}</span>
                {staff.furigana && (
                  <span className={styles.staffFurigana}>
                    ({staff.furigana})
                  </span>
                )}
              </div>
              <div className={styles.staffInfo}>
                <span className={styles.staffDepartment}>
                  {staff.department}
                </span>
                <span className={styles.staffGrade}>{staff.grade}</span>
                {staff.role && (
                    <span className={styles.staffRole}>
                      {staff.role}
                    </span>
                  )}
              </div>
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
};

MobileStaffsPage.displayName = 'MobileStaffsPage';

export default MobileStaffsPage;