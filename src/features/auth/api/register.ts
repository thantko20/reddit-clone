import { FirebaseError } from 'firebase/app';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import {
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
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

const DEFAULT_COMMUNITY_ID = 'iOZUHNglgKnNTkxkp24B';

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

      const usernameRef = doc(db, 'usernames', username);
      const usernameSnap = await getDoc(usernameRef);
      if (usernameSnap.exists()) {
        throw new Error('Username already exists');
      }

      // Profiles are private under the new rules, so this list fails closed
      // once those rules are deployed. Until then it still sees usernames that
      // have not been copied into /usernames/{username}.
      try {
        const existingUsers = await getDocs(
          query(collection(db, 'users'), where('username', '==', username)),
        );
        if (!existingUsers.empty) {
          throw new Error('Username already exists');
        }
      } catch (err: unknown) {
        if (
          err instanceof Error &&
          err.message === 'Username already exists'
        ) {
          throw err;
        }
        if (
          !(err instanceof FirebaseError && err.code === 'permission-denied')
        ) {
          throw err;
        }
      }

      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );

      const id = result.user.uid;

      const avatarURL = avatar
        ? ((await saveFileInStorage(avatar, 'avatars')) as string)
        : 'https://firebasestorage.googleapis.com/v0/b/reddit-clone-marco1.appspot.com/o/default_avatar.png?alt=media&token=15dcbbf2-3e3d-4d26-a064-ce37d9425fe3';

      try {
        await setDoc(usernameRef, { uid: id });
      } catch (err: unknown) {
        if (
          err instanceof FirebaseError &&
          err.code === 'permission-denied'
        ) {
          throw new Error('Username already exists');
        }
        throw err;
      }

      try {
        await saveUser({ name, username, avatarURL, email, id });
      } catch (err: unknown) {
        await deleteDoc(usernameRef).catch(() => undefined);
        throw err;
      }

      // Best-effort. A missing default community must not fail registration.
      try {
        await updateDoc(doc(db, 'subreddits', DEFAULT_COMMUNITY_ID), {
          members: arrayUnion(id),
        });
      } catch {
        // The profile is already saved.
      }

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
