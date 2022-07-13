/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { BiUpvote, BiDownvote } from 'react-icons/bi';
import { useGetVotes, useUpvote } from '../api';
import { Votes } from '../types';
import clsx from 'clsx';
import { useAuth } from 'providers';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from 'lib/firebase/firebase';

export interface VoteProps {
  referId: string;
  type: 'THREAD' | 'COMMENT';
}

export const VotesUI = ({ referId, type }: VoteProps) => {
  const [votes, setVotes] = useState<Votes | null>(null);
  const { getVotes } = useGetVotes();
  const { user } = useAuth();
  const { vote } = useUpvote();

  useEffect(() => {
    getVotes(referId, type).then((res) => setVotes(res as Votes));
  }, []);

  useEffect(() => {
    if (votes?.id) {
      const unsubscribe = onSnapshot(
        doc(db, 'votes', votes?.id as string),
        (doc) => {
          setVotes(doc.data() as Votes);
        },
      );

      return () => unsubscribe();
    }
  }, [votes?.id]);

  return (
    <div className='flex flex-col items-center gap-2 text-zinc-400'>
      <button
        onClick={async (e) => {
          e.stopPropagation();
          await vote(referId, type, 'upvotes');
        }}
        className='p-1 hover:bg-gray-600/50 hover:text-mainRed'
      >
        <BiUpvote
          className={clsx(
            'h-6 w-6',
            votes?.upvotes.includes(user?.id as string) && 'text-mainRed',
          )}
        />
      </button>
      <span className='font-bold'>
        {votes && votes.upvotes.length - votes.downvotes.length}
      </span>
      <button
        className='p-1 hover:bg-gray-600/50 hover:text-indigo-500'
        onClick={async (e) => {
          e.stopPropagation();
          await vote(referId, type, 'downvotes');
        }}
      >
        <BiDownvote
          className={clsx(
            'h-6 w-6',
            votes?.downvotes.includes(user?.id as string) && 'text-indigo-500',
          )}
        />
      </button>
    </div>
  );
};
