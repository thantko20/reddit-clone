import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from 'lib/firebase/firebase';
import { useState } from 'react';
import toast from 'react-hot-toast';

export type RegisterCredentials = {
  email: string;
  password: string;
  name: string;
  username: string;
  avatarURL: string;
};

export const useRegisterWithEmailAndPassword = () => {
  const [isLoading, setIsLoading] = useState(false);

  const register = async ({
    email,
    password,
    name,
    username,
    avatarURL,
  }: RegisterCredentials) => {
    try {
      setIsLoading(true);
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      setIsLoading(false);

      // TODO : SAVE THE USER IN FIRESTORE AND STORAGE
    } catch {
      toast.error('There was an error during registration');
      setIsLoading(false);
    }
  };

  return {
    register,
    isLoading,
  };
};
