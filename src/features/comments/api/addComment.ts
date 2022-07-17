import { useCallback, useState } from 'react';
import { useAuth } from 'providers';
import { doc, increment, setDoc, updateDoc } from 'firebase/firestore';
import { db } from 'lib/firebase/firebase';
import uniqid from 'uniqid';
import { CommentType } from '../types';

export const useAddComment = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const addComment = useCallback(
    async (description: string, threadId: string) => {
      try {
        if (!user) return;

        setLoading(true);
        const id = uniqid();
        const commentRef = doc(db, 'comments', id);

        await setDoc(commentRef, {
          author: {
            id: user.id,
            name: user.name,
            avatarURL: user.avatarURL,
          },
          description,
          threadId,
          upvotes: [user.id],
          downvotes: [],
          createdAt: Date.now(),
          id,
          voteCounts: 1,
        } as CommentType);

        await updateDoc(doc(db, 'threads', threadId), {
          commentCounts: increment(1),
        });

        setLoading(false);
      } catch (err: unknown) {
        setLoading(false);
        if (err instanceof Error) {
          throw new Error(err.message);
        }
      }
    },
    [user],
  );

  return {
    loading,
    addComment,
  };
};
