import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from 'lib/firebase/firebase';
import { useAuth } from 'providers';
import { useState } from 'react';
import { Subreddit } from '../types';

export const useGetUserSubreddits = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const getUserSubreddits = async () => {
    if (!user) return;

    try {
      setLoading(true);

      const subredditsRef = collection(db, 'subreddits');
      const q = query(
        subredditsRef,
        where('members', 'array-contains', user.id),
      );

      const querySnapshot = await getDocs(q);

      let data: Subreddit[] = [];

      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => data.push(doc.data() as Subreddit));
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

  return {
    loading,
    getUserSubreddits,
  };
};
