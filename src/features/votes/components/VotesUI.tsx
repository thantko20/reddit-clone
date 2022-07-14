/* eslint-disable react-hooks/exhaustive-deps */
import { BiUpvote, BiDownvote } from 'react-icons/bi';
import { useVote } from '../api';
import clsx from 'clsx';
import { VoteOrigin } from '../types';
import { useAuth } from 'providers';

export interface VoteProps {
  originId: string;
  type: VoteOrigin;
  upvotes: string[];
  downvotes: string[];
}

export const VotesUI = ({ originId, type, upvotes, downvotes }: VoteProps) => {
  const { user } = useAuth();
  const { vote } = useVote(type, originId);

  return (
    <div className='flex flex-col items-center gap-2 text-zinc-400'>
      <button
        onClick={async (e) => {
          e.stopPropagation();
          await vote('UPVOTE');
        }}
        className='p-1 hover:bg-gray-600/50 hover:text-mainRed'
      >
        <BiUpvote
          className={clsx(
            'h-6 w-6',
            upvotes.includes(user?.id as string) && 'text-mainRed',
          )}
        />
      </button>
      <span className='font-bold'>{upvotes.length - downvotes.length}</span>
      <button
        className='p-1 hover:bg-gray-600/50 hover:text-indigo-500'
        onClick={async (e) => {
          e.stopPropagation();
          await vote('DOWNVOTE');
        }}
      >
        <BiDownvote
          className={clsx(
            'h-6 w-6',
            downvotes.includes(user?.id as string) && 'text-indigo-500',
          )}
        />
      </button>
    </div>
  );
};
