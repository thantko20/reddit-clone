import { useState } from 'react';
import { useAuth } from 'providers';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { db } from 'lib/firebase/firebase';
import { ThreadType } from '../types';

export const useGetThreads = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const getThreads = async (subredditId?: string) => {
    setLoading(false);
    return [];
  };

  return { loading, getThreads };
};
