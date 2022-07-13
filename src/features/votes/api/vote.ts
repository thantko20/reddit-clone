import { arrayRemove, arrayUnion, doc, updateDoc } from 'firebase/firestore';
import { db } from 'lib/firebase/firebase';
import { useAuth } from 'providers';
import { useState } from 'react';
import { VotesOrigin } from '../types';
import { useGetVotes } from './getVotes';

export const useUpvote = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const { getVotes } = useGetVotes();

  const vote = async (
    referId: string,
    type: VotesOrigin,
    voteType: 'upvotes' | 'downvotes',
  ) => {
    if (!user) return;

    try {
      setLoading(true);

      const counterVoteType = voteType === 'upvotes' ? 'downvotes' : 'upvotes';

      const votes = await getVotes(referId, type);

      if (!votes) throw new Error('Something went wrong');

      if (votes?.[voteType].includes(user.id)) {
        await updateDoc(doc(db, 'votes', votes.id), {
          [voteType]: arrayRemove(user.id),
        });
      } else {
        await updateDoc(doc(db, 'votes', votes.id), {
          [voteType]: arrayUnion(user.id),
          [counterVoteType]: arrayRemove(user.id),
        });
      }
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
