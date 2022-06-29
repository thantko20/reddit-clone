import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { auth, db, storage } from 'lib/firebase/firebase';
import { useState } from 'react';
import toast from 'react-hot-toast';
import uniqid from 'uniqid';

type FileType = File | null | undefined;

const saveAvatar = async (file: FileType) => {
  if (!file) return;

  const imgRef = ref(storage, `avatars/${uniqid()}`);

  await uploadBytes(imgRef, file);

  const downloadURL = await getDownloadURL(imgRef);

  return downloadURL;
};

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
    joinedSubreddits: [],
    threads: [],
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
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );

      const id = result.user.uid;

      const avatarURL = (await saveAvatar(avatar)) as string;

      saveUser({ name, username, avatarURL, email, id });

      setIsLoading(false);
    } catch (err) {
      toast.error('There was an error during registration');
      console.log(err);
      setIsLoading(false);
    }
  };

  return {
    register,
    isLoading,
  };
};
