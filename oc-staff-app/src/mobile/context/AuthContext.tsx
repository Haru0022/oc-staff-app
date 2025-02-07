// src/mobile/contexts/AuthContext.tsx
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  sendPasswordResetEmail,
  User,
} from 'firebase/auth';
import { db } from '../../lib/firebase'; // モバイル側のFirebase設定へのパス

interface MobileAuthContextProps {
  user: User | null;
  signInWithEmailAndPassword: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  sendPasswordResetEmail: (email: string) => Promise<void>;
}

const MobileAuthContext = createContext<MobileAuthContextProps | undefined>(
  undefined
);
interface Props{
  children:ReactNode
}

export const MobileAuthProvider: React.FC<Props> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const auth = getAuth();
    await signInWithEmailAndPassword(auth, email, password);
  };

  const handleSignOut = async () => {
    const auth = getAuth();
    await signOut(auth);
  };

  const handleSendPasswordResetEmail = async (email: string) => {
    const auth = getAuth();
    await sendPasswordResetEmail(auth, email);
  };

  const value: MobileAuthContextProps = {
    user,
    signInWithEmailAndPassword: signIn,
    signOut: handleSignOut,
    sendPasswordResetEmail: handleSendPasswordResetEmail,
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <MobileAuthContext.Provider value={value}>
      {children}
    </MobileAuthContext.Provider>
  );
};

export const useMobileAuth = () => {
  const context = useContext(MobileAuthContext);
  if (!context) {
    throw new Error('useMobileAuth must be used within a MobileAuthProvider');
  }
  return context;
};


