import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { collection, getDocs, Timestamp, Query, DocumentData, QueryConstraint, where ,query} from 'firebase/firestore';
import { db } from '../../lib/firebase';

interface OpenCampus {
  id: string;
  title: string;
  memo: string;
  date: Date;
  participantsCount: number;
  staffCount: number;
}

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

interface Staff {
  id: string;
  name: string;
  furigana: string;
  gender: string;
  department: string;
  grade: string;
  role: string;
}

interface DataContextProps {
  openCampuses: OpenCampus[];
  participants: Participant[];
  staffs: Staff[];
  loading: boolean;
  error: string | null;
  fetchData: (searchQuery?: string) => Promise<void>;
}

const DataContext = createContext<DataContextProps | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [openCampuses, setOpenCampuses] = useState<OpenCampus[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [staffs, setStaffs] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (searchQuery: string = "") => {
    setLoading(true);
    setError(null);

    try {
      // OpenCampuses データを取得
      let openCampusesQuery: Query<DocumentData> = collection(db, 'openCampuses');
      const openCampusesSnapshot = await getDocs(openCampusesQuery);
      const openCampusesData: OpenCampus[] = openCampusesSnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title,
          memo: data.memo,
          date: (data.date as Timestamp).toDate(),
          participantsCount: data.participantsCount,
          staffCount: data.staffCount,
        };
      });

      // Participants データを取得
      let participantsQuery: Query<DocumentData> = collection(db, 'participants');
      if (searchQuery) {
          const keywords = searchQuery.trim().split(/\s+/);
          const queryConstraints: QueryConstraint[] = [];
          keywords.forEach((keyword) => {
              queryConstraints.push(where('name', '>=', keyword));
              queryConstraints.push(where('name', '<=', keyword + '\uf8ff'));
          });
          participantsQuery = query(participantsQuery, ...queryConstraints);
      }
      const participantsSnapshot = await getDocs(participantsQuery);
      const participantsData: Participant[] = participantsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
      })) as Participant[];

      // Staffs データを取得
      let staffsQuery: Query<DocumentData> = collection(db, 'staffs');
      const staffsSnapshot = await getDocs(staffsQuery);
      const staffsData: Staff[] = staffsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
      })) as Staff[];

      setOpenCampuses(openCampusesData);
      setParticipants(participantsData);
      setStaffs(staffsData);
    } catch (error) {
      console.error('Error fetching data: ', error);
      setError('データの取得に失敗しました');
    } finally {
      setLoading(false);
    }
};


  useEffect(() => {
    fetchData();
  }, []);

  const value = {
    openCampuses,
    participants,
    staffs,
    loading,
    error,
    fetchData,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};