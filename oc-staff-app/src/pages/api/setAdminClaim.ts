// pages/api/setAdminClaim.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  const serviceAccount = require('../../../oc-staff-app-firebase-adminsdk-hlv55-35690e0072.json'); // サービスアカウントキーのパス
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { uid } = req.body;

  if (!uid) {
    return res.status(400).json({ error: 'Missing uid' });
  }

  try {
    await admin.auth().setCustomUserClaims(uid, { role: 'admin' });
    return res.status(200).json({ message: `Successfully set admin role for user: ${uid}` });
  } catch (error) {
    console.error('Error setting admin role:', error);
    return res.status(500).json({ error: 'Failed to set admin role' });
  }
}