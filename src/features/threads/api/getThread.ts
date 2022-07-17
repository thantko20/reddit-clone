import { doc, getDoc } from 'firebase/firestore';
import { db } from 'lib/firebase/firebase';
import { useState } from 'react';
import { ThreadType } from '../types';

export const useGetThread = () => {
  const [loading, setLoading] = useState(false);

  const getThread = async (threadId: string) => {
    try {
      setLoading(true);

      const threadRef = doc(db, 'threads', threadId);

      const threadDoc = await getDoc(threadRef);
      setLoading(false);

      if (!threadDoc) throw new Error('Thread does not exist');

      return threadDoc.data() as ThreadType;
    } catch (err: unknown) {
      setLoading(false);
      if (err instanceof Error) {
        throw new Error(err.message);
      }
    }
  };

  return {
    loading,
    getThread,
  };
};
