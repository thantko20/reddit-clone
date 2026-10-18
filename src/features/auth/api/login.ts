import { FirebaseError } from 'firebase/app';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from 'lib/firebase/firebase';
import toast from 'react-hot-toast';
import { useState } from 'react';

export type LoginCredentials = {
  email: string;
  password: string;
};

const loginErrorMessage = (err: unknown): string => {
  if (err instanceof FirebaseError) {
    switch (err.code) {
      case 'auth/invalid-credential':
      case 'auth/wrong-password':
      case 'auth/user-not-found':
      case 'auth/invalid-email':
        return 'Incorrect email or password';
      case 'auth/too-many-requests':
        return 'Too many attempts. Try again later.';
      case 'auth/user-disabled':
        return 'This account has been disabled.';
      default:
        return 'There was a problem logging in';
    }
  }

  return 'There was a problem logging in';
};

export const useLoginWithEmailAndPassword = () => {
  const [isLoading, setIsLoading] = useState(false);

  const login = async ({ email, password }: LoginCredentials) => {
    try {
      setIsLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      setIsLoading(false);
    } catch (err: unknown) {
      const message = loginErrorMessage(err);
      toast.error(message);
      setIsLoading(false);
      throw new Error(message);
    }
  };

  return {
    login,
    isLoading,
  };
};
