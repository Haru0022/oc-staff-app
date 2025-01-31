import { NextApiRequest, NextApiResponse } from 'next';
import { collection, query, where, getDocs, Query, DocumentData, QueryConstraint } from 'firebase/firestore';
import { db } from '../../lib/firebase';

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
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
      try {
        const searchQuery = req.query.search as string;
  
        // Firestore クエリの基本形
        let q: Query<DocumentData> = collection(db, 'participants');
  
        // 検索キーワードがある場合、クエリに追加のフィルタ条件を加える
        if (searchQuery) {
          const keywords = searchQuery.trim().split(/\s+/); // 空白文字で分割
          const queryConstraints: QueryConstraint[] = [];
          
          // 各キーワードを部分一致検索の条件として追加する
          keywords.forEach((keyword) => {
            queryConstraints.push(
              where('name', '>=', keyword),
              where('name', '<=', keyword + '\uf8ff')
            );
          });
  
          // クエリ制約を適用する
          q = query(q, ...queryConstraints);
        }
  
        // 最終的なクエリでドキュメントを取得
        const participantsSnapshot = await getDocs(q);
  
        // 取得したドキュメントから参加者データの配列を作成
        const participantsData: Participant[] = participantsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Participant[];
  
        res.status(200).json(participantsData);
      } catch (error) {
        console.error('Error fetching participants: ', error);
        res.status(500).json({ error: 'Failed to fetch data' });
      }
    } else {
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }