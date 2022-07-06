import { doc, getDoc } from 'firebase/firestore';
import { db } from 'lib/firebase/firebase';
import { useState } from 'react';
import { Subreddit } from '../types';

export const useGetSubreddit = () => {
  const [loading, setLoading] = useState(true);

  const getSubreddit = async (id: string) => {
    const subredditRef = doc(db, 'subreddits', id);

    const subredditDoc = await getDoc(subredditRef);

    setLoading(false);

    return subredditDoc.data() as Subreddit;
  };

  return { loading, getSubreddit };
};
