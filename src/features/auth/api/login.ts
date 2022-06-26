import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase/firebase';
import toast from 'react-hot-toast';

export type LoginCredentials = {
  email: string;
  password: string;
};

export const loginWithEmailAndPassword = async ({
  email,
  password,
}: LoginCredentials) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch {
    toast.error('There was a problem logging in');
  }
};
