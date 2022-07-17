import { VotesUI } from 'features/votes/components';
import { Link } from 'react-router-dom';
import { calcTimePast } from 'utils';
import { ThreadType } from '../types';
import { useNavigate } from 'react-router-dom';
import { Button } from 'components';
import { AddComment } from 'features/comments/components';
import { CommentsSection } from 'features/comments/components/CommentsSection';
// shows:
// Title, description, optional image and comments
// can upvote or downvote comments
// delete the thread
// delete the comment
export const Thread = ({
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
  const navigate = useNavigate();

  return (
    <div className='py-4 w-full max-w-3xl mx-auto'>
      <div className='relative'>
        <div className='sticky top-[4rem] flex justify-between items-center px-1 py-3 bg-canvas/80'>
          <VotesUI
            downvotes={downvotes}
            upvotes={upvotes}
            originId={id}
            type='THREAD'
            alignment='horizontal'
          />
          <Button variant='secondary' onClick={() => navigate(-1)}>
            Close
          </Button>
        </div>
        <div className='bg-body rounded-lg overflow-hidden w-full text-left'>
          <div className='px-4 py-1 flex flex-col gap-2 flex-grow'>
            <div className=' space-y-4'>
              <div className='flex items-center gap-2 text-xs sm:text-sm text-zinc-400'>
                <h3 className='font-semibold'>
                  <button>
                    <Link
                      className='text-zinc-400 hover:text-lightGray'
                      to={`/app/subreddits/${subreddit.id}`}
                    >
                      r/{subreddit.name}
                    </Link>
                  </button>
                </h3>
                <span>&bull;</span>
                <span className='text-zinc-400 font-light'>
                  Posted by u/{author.name}
                </span>
                <span className='text-zinc-400 font-light'>
                  {calcTimePast(createdAt)}
                </span>
              </div>
              <div>
                <h2 className='text-2xl font-semibold'>{title}</h2>
                <p className='mt-4 text-zinc-300'>{description}</p>
              </div>
            </div>
            <div>
              {!!imageURL && (
                <img
                  src={imageURL}
                  alt={title}
                  className='w-full aspect-square object-cover bg-zinc-900'
                />
              )}
            </div>
            <div className='flex gap-6'>
              <VotesUI
                downvotes={downvotes}
                upvotes={upvotes}
                originId={id}
                type='THREAD'
                alignment='horizontal'
              />
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
        <CommentsSection threadId={id} />
      </div>
    </div>
  );
};
