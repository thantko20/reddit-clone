import { collection, getDocs } from 'firebase/firestore';
import { db } from 'lib/firebase/firebase';
import { useState } from 'react';
import { Subreddit } from '../types';

export const useGetSubreddits = () => {
  const [loading, setLoading] = useState(false);

  const getSubreddits = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, 'subreddits'));
      setLoading(false);

      if (querySnapshot.empty) {
        return [];
      }

      const data: Subreddit[] = [];

      querySnapshot.forEach((doc) => {
        data.push(doc.data() as Subreddit);
      });

      return data;
    } catch {
      setLoading(false);
    }
  };

  return { getSubreddits, loading };
};
