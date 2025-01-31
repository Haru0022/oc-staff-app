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
  if (req.method === 'PUT') {
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

      const { userId, role } = req.body;

      // Firestore のユーザー情報を更新
      await firestore.collection('users').doc(userId).update({ role });

      // Firebase Authentication のカスタムクレームを更新
      await auth.setCustomUserClaims(userId, { role });

      res.status(200).json({ message: 'User role updated successfully' });
    } catch (error) {
      console.error('Error updating user role: ', error);
      res.status(500).json({ error: 'Failed to update user role' });
    }
  } else {
    res.setHeader('Allow', ['PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}