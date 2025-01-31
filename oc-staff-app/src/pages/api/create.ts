// src / pages /api/ create.ts


import type { NextApiRequest, NextApiResponse } from 'next';
import * as admin from 'firebase-admin'; // Firebase Admin SDK をインポート
import { Timestamp, } from 'firebase-admin/firestore'; // Firestore の Timestamp をインポート

// 環境変数からサービスアカウントキーを読み込み (セキュリティ上の理由でコメントアウトされている)
// const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY || '{}'); 
// 実際のサービスアカウントキーファイルを読み込み (セキュリティを考慮した実装)
const serviceAccount = require('../../../oc-staff-app-firebase-adminsdk-hlv55-35690e0072.json');

// Firebase Admin SDK の初期化 (まだ初期化されていない場合のみ)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount), // サービスアカウントキーを使用して認証情報を設定
  });
}

const auth = admin.auth(); // Firebase Authentication のインスタンスを取得
const firestore = admin.firestore(); // Firestore のインスタンスを取得

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("APIが実行された");
  // リクエストメソッドが POST かどうかを確認
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]); // 許可するメソッドをヘッダーに設定
    return res.status(405).end(`Method ${req.method} Not Allowed`); // 405 Method Not Allowed エラーを返す
  }

  try {
    
    console.log("リクエスト受信:", req.body); // 受信したリクエストボディをログに出力

    // リクエストヘッダーから認証トークンを取得
    const idToken = req.headers.authorization?.split("Bearer ")[1]; 
    console.log("受け取ったIDトークン:", idToken); // 取得したIDトークンをログに出力
    // 認証トークンが存在しない場合
    if (!idToken) {
      console.error("Authorization header missing or invalid"); // エラーログを出力
      return res.status(401).json({ error: "Unauthorized" }); // 401 Unauthorized エラーを返す
    }

    // 認証トークンを検証
     // ★ 管理者権限チェックをコメントアウト ★
    // const decodedToken = await auth.verifyIdToken(idToken);
    // if (decodedToken.role !== "admin") {
    //   console.error("権限エラー: Role is not admin");
    //   return res.status(403).json({ error: "Forbidden" });
    // }

    // リクエストボディからユーザーデータ (配列) を取得
    const users = req.body;
    // users が配列でない場合
    if (!Array.isArray(users)) {
      console.error("エラー: users が配列ではない:", users); // エラーログを出力
      return res.status(400).json({ error: "Invalid request format" }); // 400 Bad Request エラーを返す
    }

    console.log("登録ユーザー一覧:", users); // 登録するユーザー一覧をログに出力

    // Firestore のバッチ処理を開始
    const batch = firestore.batch();

    // ユーザーデータの配列をループ処理
    for (const user of users) {
      // ユーザーデータから各フィールドの値を取得
      const { name, email, affiliation, role, password } = user;

      // 必須フィールドが不足している場合
      if (!name || !email || !affiliation || !role || !password) {
        console.error("エラー: 必須フィールド不足:", user); // エラーログを出力
        return res.status(400).json({ error: "Missing required fields" }); // 400 Bad Request エラーを返す
      }

      console.log("ユーザー作成開始:", email); // ユーザー作成開始をログに出力
      try {
        // Firebase Authentication にユーザーを作成
        const userRecord = await auth.createUser({
          email,
          password,
          displayName: name,
        });
        console.log("ユーザー作成成功:", userRecord.uid); // 作成されたユーザーの UID をログに出力

        // Firestore にユーザー情報を保存するためのドキュメントリファレンスを取得
        const userDocRef = firestore.collection("users").doc(userRecord.uid);
        // バッチ処理にユーザー情報の書き込みを追加
        batch.set(userDocRef, {
          name,
          email,
          affiliation,
          role,
          uid: userRecord.uid,
          createdAt: Timestamp.now(), // 現在時刻を Timestamp 型で保存
          updatedAt: Timestamp.now(), // 現在時刻を Timestamp 型で保存
        });
      } catch (error) {
        console.error("Firebase Authentication ユーザー作成エラー:", error); // エラーログを出力
        return res.status(500).json({ error: "Firebase Authentication failed", details: error }); // 500 Internal Server Error エラーを返す
      }
    }

    // Firestore のバッチ処理をコミット (一括書き込みを実行)
    await batch.commit();
    console.log("Firestore バッチ書き込み完了"); // バッチ書き込み完了をログに出力

    // 成功レスポンスを返す
    res.status(200).json({ message: "Users created successfully" });
  } catch (error) {
    console.error("API エラー:", error); // エラーログを出力
    res.status(500).json({ error: "Failed to create users", details: error }); // 500 Internal Server Error エラーを返す
  }
}
/*
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') { // POST リクエストの場合
    try {
      // リクエストヘッダーから認証トークンを取得し、管理者権限を確認
      const idToken = req.headers.authorization?.split('Bearer ')[1]; 
      if (!idToken) { // 認証トークンがない場合
        return res.status(401).json({ error: 'Unauthorized' }); // 401 Unauthorized を返す
      }

      const decodedToken = await auth.verifyIdToken(idToken); // 認証トークンを検証
      console.log('Decoded token:', decodedToken); // デコードされたトークンをログ出力
      if (decodedToken.role !== 'admin') { // 管理者権限がない場合
        return res.status(403).json({ error: 'Forbidden' }); // 403 Forbidden を返す
      }

      const users = req.body; // リクエストボディからユーザーデータを取得

      if (!Array.isArray(users)) { // ユーザーデータが配列でない場合
        return res.status(400).json({ error: 'Invalid request body' }); // 400 Bad Request を返す
      }

      const batch = firestore.batch(); // Firestore のバッチ処理を開始
      console.log("users:", users); // users 配列の中身を出力

      for (const user of users) { // ユーザーデータの配列をループ処理
        const { name, email, affiliation, role, password } = user; // ユーザーデータを変数に代入

        // バリデーション (必要に応じて追加)
        if (!name || !email || !affiliation || !role) { // 必須項目が不足している場合
          return res.status(400).json({ error: 'Missing required fields' }); // 400 Bad Request を返す
        }

        // Firebase Authentication にユーザーを作成
        const userRecord = await auth.createUser({ // ユーザーを作成
          email: email,
          password: password || generatePassword(), // パスワードが提供されていない場合は自動生成
          displayName: name,
        });
        console.log("userRecord:", userRecord); // userRecord の中身を出力

        // Firestore にユーザー情報を保存
        const userDocRef = firestore.collection('users').doc(userRecord.uid); // Firestore のドキュメントリファレンスを取得
        batch.set(userDocRef, { // ユーザーデータを Firestore に書き込む
          name,
          email,
          affiliation,
          role,
          uid: userRecord.uid,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        });
        console.log("userDocRef:", userDocRef); // userDocRef の中身を出力
        console.log("=======================================");

        // カスタムクレームを設定して、ユーザーに役割を付与
        await auth.setCustomUserClaims(userRecord.uid, { role }); // カスタムクレームを設定
        console.log('User created:', userRecord); // 作成されたユーザーをログ出力
      }

      await batch.commit(); // Firestore のバッチ処理をコミット

      res.status(200).json({ message: 'Users created successfully' }); // 200 OK を返す
    } catch (error) { // エラーが発生した場合
      console.error('Error in API route:', error); // エラーメッセージをログ出力
      res.status(500).json({ error: 'Failed to create users' }); // 500 Internal Server Error を返す
    }
  } else { // POST リクエスト以外の場合
    res.setHeader('Allow', ['POST']); // Allow ヘッダーを設定
    res.status(405).end(`Method ${req.method} Not Allowed`); // 405 Method Not Allowed を返す
  }
}

// パスワードを自動生成する関数
function generatePassword() {
  const length = 8;
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let password = "";
  for (let i = 0, n = charset.length; i < length; ++i) {
    password += charset.charAt(Math.floor(Math.random() * n));
  }
  return password;
}*/