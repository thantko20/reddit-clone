import { Link } from 'components';
import { VotesUI } from 'features/votes/components';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from 'lib/firebase/firebase';
import { useEffect, useState } from 'react';
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
  });

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
      onClick={() => console.log('hi')}
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
              className='w-full max-h-[400px] object-contain bg-zinc-900'
            />
          )}
        </div>
      </div>
    </div>
  );
};
