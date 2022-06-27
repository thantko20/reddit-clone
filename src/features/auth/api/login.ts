import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase/firebase';
import toast from 'react-hot-toast';
import { useState } from 'react';

export type LoginCredentials = {
  email: string;
  password: string;
};

export const useLoginWithEmailAndPassword = () => {
  const [isLoading, setIsLoading] = useState(false);

  const loginWithEmailAndPassword = async ({
    email,
    password,
  }: LoginCredentials) => {
    try {
      setIsLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      setIsLoading(false);
    } catch {
      toast.error('There was a problem logging in');
      setIsLoading(false);
    }
  };

  return {
    loginWithEmailAndPassword,
    isLoading,
  };
};
