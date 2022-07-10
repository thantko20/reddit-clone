import { Link } from 'components';
import { VotesUI } from 'features/votes/components';
import { calcTimePast } from 'utils';
import { ThreadType } from '../types';

export const ThreadCard = (props: ThreadType) => {
  return (
    <div
      className='bg-body rounded-lg overflow-hidden flex w-full text-left cursor-pointer border border-gray-600 hover:border-gray-400'
      onClick={() => console.log('hi')}
    >
      <div className='flex-shrink-0 p-3'>
        <VotesUI referId={props.id} type='THREAD' />
      </div>
      <div className=' py-1 flex flex-col gap-2 flex-grow'>
        <div className='px-4 py-1 space-y-4'>
          <div className='flex items-center gap-2 text-xs sm:text-sm text-zinc-400'>
            <h3 className='font-semibold'>
              <button onClick={(e) => e.stopPropagation()}>
                <Link
                  className='text-inherit'
                  to={`/app/subreddits/${props.subreddit.id}`}
                >
                  r/{props.subreddit.name}
                </Link>
              </button>
            </h3>
            <span>&bull;</span>
            <span className='text-zinc-400 font-light'>
              Posted by u/{props.author.name}
            </span>
            <span className='text-zinc-400 font-light'>
              {calcTimePast(props.createdAt)}
            </span>
          </div>
          <h2 className='text-xl font-semibold'>{props.title}</h2>
        </div>
        <div>
          {!!props.imageURL && (
            <img
              src={props.imageURL}
              alt={props.title}
              className='w-full max-h-[400px] object-contain bg-zinc-900'
            />
          )}
        </div>
      </div>
    </div>
  );
};
