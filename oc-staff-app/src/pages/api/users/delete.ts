import type { NextApiRequest, NextApiResponse } from 'next';
import * as admin from 'firebase-admin';

// Firebase Admin SDK の初期化
if (!admin.apps.length) {
  const serviceAccount = require('../../../../oc-staff-app-firebase-adminsdk-hlv55-35690e0072.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const auth = admin.auth();
const firestore = admin.firestore();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'DELETE') {
    try {
      // 管理者権限の確認
      const idToken = req.headers.authorization?.split('Bearer ')[1];
      if (!idToken) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const decodedToken = await auth.verifyIdToken(idToken);
      if (decodedToken.role !== 'admin') {
        return res.status(403).json({ error: 'Forbidden' });
      }

      const userId = req.query.id as string;

      // Firebase Authentication からユーザーを削除
      await auth.deleteUser(userId);

      // Firestore からユーザー情報を削除
      await firestore.collection('users').doc(userId).delete();

      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error('Error deleting user: ', error);
      res.status(500).json({ error: 'Failed to delete user' });
    }
  } else {
    res.setHeader('Allow', ['DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}