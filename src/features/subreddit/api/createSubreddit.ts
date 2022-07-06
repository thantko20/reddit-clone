import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from 'firebase/firestore';
import { db } from 'lib/firebase/firebase';
import { useAuth } from 'providers';
import { useState } from 'react';
import uniqid from 'uniqid';
import { Subreddit } from '../types';

export const useCreateSubreddit = () => {
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();

  const create = async (name: string) => {
    if (!user) throw new Error('User has not logged in');

    setLoading(true);

    const subredditsRef = collection(db, 'subreddits');

    const q = query(subredditsRef, where('name', '==', name));

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      setLoading(false);
      throw new Error(`r/${name} already exists`);
    }

    const id = uniqid();

    // Set the doc in 'subreddits' collection including user.id
    await setDoc(doc(db, 'subreddits', id), {
      name,
      members: [user.id],
      createdAt: Date.now(),
      id,
    } as Subreddit);
    setLoading(false);
  };

  return {
    loading,
    create,
  };
};
