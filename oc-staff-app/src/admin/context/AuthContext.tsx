// src/admin/context/AuthContext.tsx


import { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../../lib/firebase';
import {
  onAuthStateChanged,
  User as FirebaseUser,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail
} from 'firebase/auth';

interface User extends FirebaseUser {
  role?: string;
}

interface AuthContextProps {
  currentUser: User | null;
  loading: boolean;
  signInWithEmailAndPassword: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  sendPasswordResetEmail: (email: string) => Promise<void>; // 追加
}

const AuthContext = createContext<AuthContextProps>({
  currentUser: null,
  loading: true,
  signInWithEmailAndPassword: async () => {},
  logout: async () => {},
  sendPasswordResetEmail: async () => {} // 追加
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // メールとパスワードでログインする関数
  const signInWithEmailAndPasswordFn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Error during Email/Password sign in:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  // パスワードリセットメールを送信する関数
  const sendPasswordResetEmailFn = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error('Error sending password reset email: ', error);
      throw error; // エラーをスローして呼び出し元で処理
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const idTokenResult = await user.getIdTokenResult();
        const role = idTokenResult.claims.role as string;

        const userWithRole: User = {
          ...user,
          role,
        };
        setCurrentUser(userWithRole);
      } else {
        setCurrentUser(null);
      }
      setLoading(false);

      console.log("userの中身", user);
    });
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, loading, signInWithEmailAndPassword: signInWithEmailAndPasswordFn, logout, sendPasswordResetEmail: sendPasswordResetEmailFn }}>
      {children}
    </AuthContext.Provider>
  );
};


/*
import { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../../lib/firebase';
import {
  onAuthStateChanged,
  User as FirebaseUser,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  

} from 'firebase/auth';

interface User extends FirebaseUser {
  role?: string;
}

interface AuthContextProps {
  currentUser: User | null;
  loading: boolean;
  signInWithEmailAndPassword: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserPassword: (newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextProps>({
  currentUser: null,
  loading: true,
  signInWithEmailAndPassword: async () => {},
  logout: async () => {},
  updateUserPassword: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  //const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentUser, setCurrentUser] = useState<User>({} as User); // User型で初期化

  const [loading, setLoading] = useState(true);

  // メールとパスワードでログインする関数
  const signInWithEmailAndPasswordFn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Error during Email/Password sign in:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };



  // パスワードリセットメールを送信する関数
  const sendPasswordResetEmailFn = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error('Error sending password reset email: ', error);
      throw error; // エラーをスローして呼び出し元で処理
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const idTokenResult = await user.getIdTokenResult();
          const role = idTokenResult.claims.role as string;
  
          // user を User 型にキャスト
          const userWithRole: User = user as User;
          userWithRole.role = role; 
  
          setCurrentUser(userWithRole); 
        } catch (error) {
          console.error('Error getting ID token result:', error);
          await signOut(auth);
        }
      } else {
        setCurrentUser({} as User);
      }
      setLoading(false);
  
      console.log("userの中身", user);
    });
    return unsubscribe;
  }, []);
  return (
    <AuthContext.Provider value={{ currentUser, loading, signInWithEmailAndPassword: signInWithEmailAndPasswordFn, logout, updateUserPassword:sendPasswordResetEmailFn }}>
      {children}
    </AuthContext.Provider>
  );
};
*/


