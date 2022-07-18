/* eslint-disable react-hooks/exhaustive-deps */
import { Avatar, Button, Link, Spinner } from 'components';
import { CreateSubreddit } from 'features/subreddit/components';
import { CreateThread, ThreadsContainer } from 'features/threads/components';
import { useAuth } from 'providers';
import { useGetJoinedSubThreads } from 'features/threads/api';
import { useEffect, useState } from 'react';
import { ThreadType } from 'features/threads/types';
import { useGetSubreddits } from 'features/subreddit/api';
import { Subreddit } from 'features/subreddit/types';
import { JoinSubreddit } from 'features/subreddit/components/JoinSubreddit';
import { randomItemsFromArray } from 'utils';

export const MainPage = () => {
  const { user } = useAuth();
  const { loading, getJoinedSubThreads } = useGetJoinedSubThreads();
  const [threads, setThreads] = useState<ThreadType[]>([]);
  const [subreddits, setSubreddits] = useState<Subreddit[]>([]);
  const { getSubreddits } = useGetSubreddits();

  useEffect(() => {
    getJoinedSubThreads().then((res) => setThreads(res as ThreadType[]));
  }, [user]);

  useEffect(() => {
    const fetchSubreddits = async () => {
      const data: Subreddit[] = await getSubreddits();
      setSubreddits(randomItemsFromArray(data, 5));
    };

    fetchSubreddits();
  }, []);

  return (
    <main className='max-w-6xl w-full mx-auto px-1 pt-10 grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-x-3'>
      <div>
        <div className='bg-body px-2 py-4 flex justify-between rounded-lg md:hidden'>
          <h2 className='font-semibold text-lg'>Explore communities</h2>
          <Link to='/app/subreddits'>
            <Button className='mx-auto'>View More</Button>
          </Link>
        </div>
        <div className='w-full flex flex-col gap-y-6 sm:flex-row sm:justify-between sm:items-center bg-body rounded-lg p-4 mt-8 md:mt-0'>
          <div className='flex items-center gap-2 self-center'>
            <Avatar url={user?.avatarURL as string} />
            <div className='font-semibold text-xs'>u/{user?.username}</div>
          </div>
          <div className='flex flex-col gap-2 sm:flex-row'>
            <CreateThread />
            <CreateSubreddit />
          </div>
        </div>
        <div className='pt-10'>
          {loading && (
            <div className='flex justify-center pt-4'>
              <Spinner />
            </div>
          )}
          {!loading && <ThreadsContainer threads={threads} />}
        </div>
      </div>
      <div className='bg-body hidden md:flex md:flex-col md:gap-6 rounded-lg h-max p-4 '>
        <h2 className='text-sm lg:text-base font-bold'>
          Communities that you might like
        </h2>
        <ul className='space-y-4'>
          {subreddits.map((subreddit) => {
            return (
              <li
                key={subreddit.id}
                className='flex justify-between items-center'
              >
                <Link to={`/app/subreddits/${subreddit.id}`}>
                  r/{subreddit.name}
                </Link>
                <JoinSubreddit
                  subreddit={subreddit}
                  userId={user?.id as string}
                />
              </li>
            );
          })}
        </ul>
        <Link to='/app/subreddits'>
          <Button className='mx-auto'>View More</Button>
        </Link>
      </div>
    </main>
  );
};
