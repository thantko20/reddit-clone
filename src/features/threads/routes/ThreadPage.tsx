/* eslint-disable react-hooks/exhaustive-deps */
import { Link, Spinner } from 'components';
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
  const [missing, setMissing] = useState(false);
  const { getThread, loading: gettingThread } = useGetThread();

  // Get thread on mount
  useEffect(() => {
    let active = true;

    getThread(params.threadId as string)
      .then((data) => {
        if (!active) return;
        if (!data) {
          setThread(null);
          setMissing(true);
          return;
        }
        setMissing(false);
        setThread(data);
      })
      .catch(() => {
        if (active) setMissing(true);
      });

    return () => {
      active = false;
    };
  }, []);

  // Listen to thread changes
  useEffect(() => {
    if (!thread?.id) return;
    const unsubscribe = onSnapshot(doc(db, 'threads', thread.id), (snapshot) => {
      if (!snapshot.exists()) {
        setThread(null);
        setMissing(true);
        return;
      }
      setThread(snapshot.data() as ThreadType);
    });

    return () => unsubscribe();
  }, [thread?.id]);

  if (missing) {
    return (
      <div className='max-w-3xl mx-auto px-4 py-16 text-center'>
        <h1 className='text-2xl font-semibold'>Thread not found</h1>
        <p className='mt-2 text-zinc-400'>
          This thread does not exist or was removed.
        </p>
        <Link to='/app' colour='red' className='inline-block mt-6'>
          Back to home
        </Link>
      </div>
    );
  }

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
