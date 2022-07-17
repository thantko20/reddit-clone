/* eslint-disable react-hooks/exhaustive-deps */
import { Spinner } from 'components';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from 'lib/firebase/firebase';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGetThread } from '../api';
import { Thread } from '../components';
import { ThreadType } from '../types';

export const ThreadPage = () => {
  const params = useParams();
  const [thread, setThread] = useState<ThreadType | null>(null);
  const { getThread, loading: gettingThread } = useGetThread();

  // Get thread on mount
  useEffect(() => {
    const fetchThread = async () => {
      const data = await getThread(params.threadId as string);
      setThread(data as ThreadType);
    };

    fetchThread();
  }, []);

  // Listen to thread changes
  useEffect(() => {
    if (!thread) return;
    const unsubscribe = onSnapshot(doc(db, 'threads', thread?.id), (doc) => {
      setThread(doc.data() as ThreadType);
    });

    return () => unsubscribe();
  }, [thread?.id]);

  return (
    <>
      {gettingThread || !thread ? (
        <div className='flex justify-center pt-10'>
          <Spinner />
        </div>
      ) : (
        <Thread {...thread} />
      )}
    </>
  );
};
