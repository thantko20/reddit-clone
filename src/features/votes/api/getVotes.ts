import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from 'lib/firebase/firebase';
import { useState } from 'react';
import { Votes, VotesOrigin } from '../types';

export const useGetVotes = () => {
  const [loading, setLoading] = useState(false);

  const getVotes = async (referId: string, type: VotesOrigin) => {
    try {
      setLoading(true);

      const votesCol = collection(db, 'votes');
      const q = query(
        votesCol,
        where('referId', '==', referId),
        where('type', '==', type),
      );
      const querySnapshot = await getDocs(q);

      const votes = querySnapshot.docs[0].data() as Votes;

      return votes;
    } catch (err: unknown) {
      setLoading(false);
      if (err instanceof Error) {
        throw new Error(err.message);
      }
    }
  };

  return { loading, getVotes };
};
