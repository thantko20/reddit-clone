import { deleteDoc, doc } from 'firebase/firestore';
import { db } from 'lib/firebase/firebase';
import { useAuth } from 'providers';
import { useState } from 'react';

export const useDeleteThread = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const deleteThread = async (threadId: string) => {
    try {
      if (!user) throw new Error('User is not signed in');

      setLoading(true);

      const threadRef = doc(db, 'threads', threadId);

      await deleteDoc(threadRef);
      setLoading(false);
    } catch (err: unknown) {
      setLoading(false);
      if (err instanceof Error) {
        throw new Error(err.message);
      }
    }
  };
};
