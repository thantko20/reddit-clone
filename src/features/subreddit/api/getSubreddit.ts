import { doc, getDoc } from 'firebase/firestore';
import { db } from 'lib/firebase/firebase';
import { useState } from 'react';
import { Subreddit } from '../types';

export const useGetSubreddit = () => {
  const [loading, setLoading] = useState(true);

  const getSubreddit = async (id: string): Promise<Subreddit | null> => {
    try {
      const subredditDoc = await getDoc(doc(db, 'subreddits', id));

      if (!subredditDoc.exists()) return null;

      return subredditDoc.data() as Subreddit;
    } finally {
      setLoading(false);
    }
  };

  return { loading, getSubreddit };
};
