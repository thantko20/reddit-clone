import { useGetUserSubreddits } from 'features/subreddit/api/getUserSubreddits';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from 'lib/firebase/firebase';
import { useAuth } from 'providers';
import { useState } from 'react';
import { chunksArray } from 'utils';
import { ThreadType } from '../types';

export const useGetJoinedSubThreads = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const { getUserSubreddits } = useGetUserSubreddits();

  const getJoinedSubThreads = async () => {
    try {
      if (!user) return [];

      setLoading(true);

      const threadsRef = collection(db, 'threads');

      const userSubredditsRes = await getUserSubreddits();

      if (userSubredditsRes?.length === 0) {
        setLoading(false);
        return [];
      }

      const data: ThreadType[] = [];

      const subredditIdsChunks = chunksArray(
        userSubredditsRes?.map((subreddit) => subreddit.id) as string[],
        10,
      );

      for (let i = 0; i < subredditIdsChunks.length; i++) {
        const q = query(
          threadsRef,
          where('subreddit.id', 'in', subredditIdsChunks[i]),
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          querySnapshot.forEach((doc) => data.push(doc.data() as ThreadType));
        }
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

  return { loading, getJoinedSubThreads };
};
