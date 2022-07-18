import { createUserWithEmailAndPassword } from 'firebase/auth';
import {
  arrayUnion,
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { auth, db, saveFileInStorage } from 'lib/firebase/firebase';
import { useState } from 'react';

type FileType = File | null | undefined;

interface SaveUserParameters {
  email: string;
  name: string;
  username: string;
  avatarURL: string;
  id: string;
}

const saveUser = async ({ avatarURL = '', ...info }: SaveUserParameters) => {
  // TODO: SAVE USER INFO IN FIRESTORE

  await setDoc(doc(db, 'users', info.id), {
    ...info,
    avatarURL,
    createdAt: Date.now(),
  });
};

export type RegisterCredentials = {
  email: string;
  password: string;
  name: string;
  username: string;
  avatar: FileType;
};

export const useRegisterWithEmailAndPassword = () => {
  const [isLoading, setIsLoading] = useState(false);

  const register = async ({
    email,
    password,
    name,
    username,
    avatar,
  }: RegisterCredentials) => {
    try {
      setIsLoading(true);

      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('username', '==', username));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        setIsLoading(false);
        throw new Error('Username already exists');
      }

      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );

      const id = result.user.uid;

      const avatarURL = avatar
        ? ((await saveFileInStorage(avatar, 'images')) as string)
        : 'https://firebasestorage.googleapis.com/v0/b/reddit-clone-marco1.appspot.com/o/default_avatar.png?alt=media&token=15dcbbf2-3e3d-4d26-a064-ce37d9425fe3';

      saveUser({ name, username, avatarURL, email, id });

      // Automatically joins newly registered user to MarcoSubreddit subreddit
      await updateDoc(doc(db, 'subreddits', 'iOZUHNglgKnNTkxkp24B'), {
        members: arrayUnion(id),
      });

      setIsLoading(false);
    } catch (err: unknown) {
      setIsLoading(false);
      if (err instanceof Error) {
        throw new Error(err.message);
      }
    }
  };

  return {
    register,
    isLoading,
  };
};
