import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from 'lib/firebase/firebase';
import { Auth, onAuthStateChanged } from 'firebase/auth';
import { UserType } from 'features/auth/types';
import { doc, getDoc } from 'firebase/firestore';

export interface AuthContextValue {
  auth: Auth | null;
  user: UserType;
}

const initialAuthValue: AuthContextValue = {
  auth: null,
  user: null,
};

const AuthContext = createContext<AuthContextValue>(initialAuthValue);

// with useContext hook
export const useAuth = () => useContext(AuthContext);

export interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<UserType>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async () => {
      await getUser();
    });

    return () => unsubscribe();
  }, []);

  const getUser = async () => {
    if (!auth.currentUser) {
      setUser(null);
      return;
    }

    const userRef = doc(db, 'users', auth.currentUser.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) setUser(userSnap.data() as UserType);
  };

  const value = { auth, user };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
