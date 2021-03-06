import { Link } from 'components';
import { VotesUI } from 'features/votes/components';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from 'lib/firebase/firebase';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { calcTimePast } from 'utils';
import { ThreadType } from '../types';

export const ThreadCard = ({
  author,
  id,
  subreddit,
  createdAt,
  title,
  imageURL,
  upvotes,
  downvotes,
  description,
  voteCounts,
  commentCounts,
}: ThreadType) => {
  const [syncData, setSyncData] = useState<ThreadType>({
    author,
    id,
    subreddit,
    createdAt,
    title,
    imageURL,
    upvotes,
    downvotes,
    description,
    voteCounts,
    commentCounts,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'threads', id), (doc) => {
      const data = doc.data() as ThreadType;
      setSyncData(data);
    });

    return () => unsubscribe();
  }, [id]);

  return (
    <div
      className='bg-body rounded-lg overflow-hidden flex w-full text-left cursor-pointer border border-gray-600 hover:border-gray-400'
      onClick={() => navigate(`/app/subreddits/${subreddit.id}/${id}`)}
    >
      <div className='flex-shrink-0 p-1 sm:p-3'>
        <VotesUI
          originId={syncData.id}
          type='THREAD'
          upvotes={syncData.upvotes}
          downvotes={syncData.downvotes}
        />
      </div>
      <div className=' py-1 flex flex-col gap-2 flex-grow'>
        <div className='px-4 py-1 space-y-4'>
          <div className='flex items-center gap-2 text-xs sm:text-sm text-zinc-400'>
            <h3 className='font-semibold'>
              <button onClick={(e) => e.stopPropagation()}>
                <Link
                  className='text-zinc-400'
                  to={`/app/subreddits/${syncData.subreddit.id}`}
                >
                  r/{syncData.subreddit.name}
                </Link>
              </button>
            </h3>
            <span>&bull;</span>
            <span className='text-zinc-400 font-light'>
              Posted by u/{syncData.author.name}
            </span>
            <span className='text-zinc-400 font-light'>
              {calcTimePast(syncData.createdAt)}
            </span>
          </div>
          <h2 className='text-xl font-semibold'>{syncData.title}</h2>
        </div>
        <div>
          {!!syncData.imageURL && (
            <img
              src={syncData.imageURL}
              alt={syncData.title}
              className='w-full aspect-square object-cover bg-zinc-900'
            />
          )}
        </div>
        <div>
          <button className='flex items-center gap-2 p-2 text-zinc-400 hover:bg-zinc-700/50 rounded'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-6 w-6'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
              strokeWidth={2}
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z'
              />
            </svg>
            <span>{commentCounts}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
