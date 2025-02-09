// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
import * as admin from 'firebase-admin';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCDYWibtI7gKpXPeb-YiipE6YvAQDVNKc8",
  authDomain: "oc-staff-app.firebaseapp.com",
  projectId: "oc-staff-app",
  storageBucket: "oc-staff-app.firebasestorage.app",
  messagingSenderId: "685850679529",
  appId: "1:685850679529:web:36f89c64dce237764c3878",
  measurementId: "G-PMXYST247L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY || '{}');
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}
export { db ,auth};

