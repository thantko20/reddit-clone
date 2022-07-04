import {
  arrayUnion,
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from 'lib/firebase/firebase';
import { useAuth } from 'providers';
import { useState } from 'react';
import uniqid from 'uniqid';

export const useCreateSubreddit = () => {
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();

  const create = async (name: string) => {
    if (!user) throw new Error('User has not logged in');

    setLoading(true);

    const subredditsRef = collection(db, 'subreddits');
    const userRef = doc(db, 'users', user.id);

    const q = query(subredditsRef, where('name', '==', name));

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      setLoading(false);
      throw new Error(`r/${name} already exists`);
    }

    const id = uniqid();

    // Set the doc in 'subreddits' collection including user.id
    await setDoc(doc(db, 'subreddits', id), {
      name,
      members: [user.id],
      createdAt: Date.now(),
      id,
      threads: [],
    });

    // Update the user's doc's 'joinedSubreddits' array, adding newly created subreddit's id
    await updateDoc(userRef, {
      joinedSubreddits: arrayUnion(id),
    });
    setLoading(false);
  };

  return {
    loading,
    create,
  };
};
