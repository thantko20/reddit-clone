import { VotesUI } from 'features/votes/components';
import { Link } from 'react-router-dom';
import { calcTimePast } from 'utils';
import { ThreadType } from '../types';
import { useNavigate } from 'react-router-dom';
import { Button } from 'components';
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
}: ThreadType) => {
  const navigate = useNavigate();

  return (
    <div className='pt-4'>
      <div className='flex justify-between items-center px-1 py-3'>
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
      <div className='bg-body rounded-lg overflow-hidden flex w-full text-left'>
        <div className=' py-1 flex flex-col gap-2 flex-grow'>
          <div className='px-4 py-1 space-y-4'>
            <div className='flex items-center gap-2 text-xs sm:text-sm text-zinc-400'>
              <h3 className='font-semibold'>
                <button>
                  <Link
                    className='text-zinc-400'
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
            <h2 className='text-xl font-semibold'>{title}</h2>
          </div>
          <div>
            {!!imageURL && (
              <img
                src={imageURL}
                alt={title}
                className='w-full max-h-[400px] object-contain bg-zinc-900'
              />
            )}
          </div>
          <div>
            <VotesUI
              downvotes={downvotes}
              upvotes={upvotes}
              originId={id}
              type='THREAD'
              alignment='horizontal'
            />
          </div>
        </div>
      </div>
    </div>
  );
};
