import React, { createContext, useContext } from 'react';
import { auth } from '@/lib/firebase/firebase';
import { Auth } from 'firebase/auth';

export interface AuthContextValue {
  auth: Auth | null;
}

const initialAuthValue: AuthContextValue = {
  auth: null,
};

const AuthContext = createContext<AuthContextValue>(initialAuthValue);

// with useContext hook
export const useAuth = () => useContext(AuthContext);

export interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const value = { auth };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
