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

const PROFILE_RETRY_MS = [0, 300, 700, 1500];

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Registration writes the profile just after Auth signs the user in, so the
// first read often misses. Keep checking until it shows up or the retries end.
const loadProfile = async (
  uid: string,
  isStale: () => boolean,
): Promise<UserType> => {
  for (const delay of PROFILE_RETRY_MS) {
    if (isStale() || auth.currentUser?.uid !== uid) return null;
    if (delay > 0) await wait(delay);
    if (isStale() || auth.currentUser?.uid !== uid) return null;

    try {
      const profile = await getUser();
      if (profile) return profile;
    } catch {
      // Network or rules errors are retried with the next delay.
    }
  }

  return null;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<UserType>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // For getting rid of the immediate redirect to auth pages while pulling
  // user creds from the server
  const [checkingStatus, setCheckingStatus] = useState(true);

  useEffect(() => {
    let cancelled = false;
    let requestId = 0;

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      const current = ++requestId;

      if (!firebaseUser) {
        setIsLoggedIn(false);
        setUser(null);
        setCheckingStatus(false);
        return;
      }

      setIsLoggedIn(true);
      setCheckingStatus(true);

      void loadProfile(
        firebaseUser.uid,
        () => cancelled || current !== requestId,
      ).then((profile) => {
        if (cancelled || current !== requestId) return;
        setUser(profile);
        setCheckingStatus(false);
      });
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  const value = { auth, user, isLoggedIn, checkingStatus };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
