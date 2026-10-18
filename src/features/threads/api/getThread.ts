import { doc, getDoc } from 'firebase/firestore';
import { db } from 'lib/firebase/firebase';
import { useState } from 'react';
import { ThreadType } from '../types';

export const useGetThread = () => {
  const [loading, setLoading] = useState(false);

  const getThread = async (threadId: string): Promise<ThreadType | null> => {
    try {
      setLoading(true);

      const threadDoc = await getDoc(doc(db, 'threads', threadId));

      if (!threadDoc.exists()) return null;

      return threadDoc.data() as ThreadType;
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw new Error(err.message);
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    getThread,
  };
};
