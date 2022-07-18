import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from 'lib/firebase/firebase';
import { Auth, onAuthStateChanged } from 'firebase/auth';
import { UserType } from 'features/auth/types';
import { getUser } from 'features/auth/api';

export interface AuthContextValue {
  auth: Auth | null;
  user: UserType;
  isLoggedIn: boolean;
  checkingStatus: boolean;
}

const initialAuthValue: AuthContextValue = {
  auth: null,
  user: null,
  isLoggedIn: false,
  checkingStatus: false,
};

const AuthContext = createContext<AuthContextValue>(initialAuthValue);

// with useContext hook
export const useAuth = () => useContext(AuthContext);

export interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<UserType>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // For getting rid of the immediate redirect to auth pages while pulling
  // user creds from the server
  const [checkingStatus, setCheckingStatus] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsLoggedIn(true);
        const res = (await getUser()) as UserType;
        setUser(res);
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
      setCheckingStatus(false);
    });

    return () => unsubscribe();
  }, []);

  const value = { auth, user, isLoggedIn, checkingStatus };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
