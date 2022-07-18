import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { db } from 'lib/firebase/firebase';
import { useCallback, useState } from 'react';
import { CommentType } from '../types';

export const useGetComments = () => {
  const [loading, setLoading] = useState(false);

  const getComments = useCallback(async (threadId: string) => {
    try {
      setLoading(true);

      const commentsRef = collection(db, 'comments');
      const q = query(commentsRef, where('threadId', '==', threadId));

      const data: CommentType[] = [];

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setLoading(false);
        return data;
      }

      querySnapshot.forEach((doc) => data.push(doc.data() as CommentType));

      setLoading(false);

      return data;
    } catch (err: unknown) {
      setLoading(false);
      if (err instanceof Error) {
        throw new Error(err.message);
      }
    }
  }, []);

  return {
    loading,
    getComments,
  };
};
