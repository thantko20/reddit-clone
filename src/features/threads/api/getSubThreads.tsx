import { useState } from 'react';
import { useAuth } from 'providers';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from 'lib/firebase/firebase';
import { ThreadType } from '../types';

export const useGetSubThreads = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const getSubThreads = async (subredditId?: string) => {
    if (!user) return;

    try {
      setLoading(true);

      const threadsCol = collection(db, 'threads');

      const q = query(threadsCol, where('subreddit.id', '==', subredditId));

      const querySnapshot = await getDocs(q);

      const data: ThreadType[] = [];

      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => data.push(doc.data() as ThreadType));
      }

      setLoading(false);

      return data;
    } catch (err: unknown) {
      setLoading(false);

      if (err instanceof Error) {
        throw new Error(err.message);
      }
    }
  };

  return { loading, getSubThreads };
};
