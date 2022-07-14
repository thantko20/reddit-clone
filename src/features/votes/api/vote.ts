import { CommentType } from 'features/comments/types';
import { ThreadType } from 'features/threads/types';
import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  updateDoc,
} from 'firebase/firestore';
import { db } from 'lib/firebase/firebase';
import { useAuth } from 'providers';
import { useState } from 'react';
import { VoteOrigin, VoteType } from '../types';

export const useVote = (voteOrigin: VoteOrigin, originId: string) => {
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);

  const vote = async (voteType: VoteType) => {
    if (!user) return;

    try {
      setLoading(true);
      type originType = ThreadType | CommentType;

      const voteTypeKey = voteType === 'UPVOTE' ? 'upvotes' : 'downvotes';
      const counterVoteTypeKey =
        voteType === 'UPVOTE' ? 'downvotes' : 'upvotes';

      const colPath = voteOrigin === 'THREAD' ? 'threads' : 'comments';
      const originRef = doc(db, colPath, originId);
      const originDoc = await getDoc(originRef);

      const originData: originType = originDoc.data() as originType;

      if (originData[voteTypeKey].includes(user.id)) {
        await updateDoc(originRef, {
          [voteTypeKey]: arrayRemove(user.id),
        });
      } else {
        await updateDoc(originRef, {
          [voteTypeKey]: arrayUnion(user.id),
          [counterVoteTypeKey]: arrayRemove(user.id),
        });
      }

      const updatedOriginDoc = await getDoc(originRef);
      const updatedData: originType = updatedOriginDoc.data() as originType;
      await updateDoc(originRef, {
        voteCounts: updatedData.upvotes.length - updatedData.downvotes.length,
      });

      setLoading(false);
    } catch (err: unknown) {
      setLoading(false);
      if (err instanceof Error) {
        throw new Error(err.message);
      }
    }
  };

  return {
    loading,
    vote,
  };
};
