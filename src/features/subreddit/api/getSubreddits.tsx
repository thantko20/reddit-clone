import { collection, getDocs } from 'firebase/firestore';
import { db } from 'lib/firebase/firebase';
import { useState } from 'react';

export const useGetSubreddits = () => {
  const [loading, setLoading] = useState(false);

  const get = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, 'subreddits'));
      setLoading(false);

      if (querySnapshot.empty) {
        return [];
      }

      const data: any = [];

      querySnapshot.forEach((doc) => {
        data.push(doc.data());
      });

      return data;
    } catch {
      setLoading(false);
    }
  };

  return { get, loading };
};
