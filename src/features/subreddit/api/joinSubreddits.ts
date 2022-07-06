import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from 'lib/firebase/firebase';
import { useAuth } from 'providers';
import { useState } from 'react';

export const hasJoinedSubreddit = async (
  userId: string,
  subredditId: string,
) => {
  const subredditsRef = collection(db, 'subreddits');

  const q = query(
    subredditsRef,
    where('members', 'array-contains', userId),
    where('id', '==', subredditId),
  );

  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) return false;

  return true;
};

export const useJoinSubreddit = () => {
  const [loading, setLoading] = useState(false);

  const joinSubreddit = async (subredditId: string, userId: string) => {
    const subredditRef = doc(db, 'subreddits', subredditId);

    setLoading(true);

    const hasJoined = await hasJoinedSubreddit(userId, subredditId);

    await updateDoc(subredditRef, {
      members: hasJoined ? arrayRemove(userId) : arrayUnion(userId),
    });

    setLoading(false);
  };

  return { loading, joinSubreddit };
};
