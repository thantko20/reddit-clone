/* eslint-disable react-hooks/exhaustive-deps */
import { Avatar, Spinner } from 'components';
import { useGetSubThreads } from 'features/threads/api';
import { CreateThread, ThreadsContainer } from 'features/threads/components';
import { ThreadType } from 'features/threads/types';
import { useAuth } from 'providers';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGetSubreddit } from '../api';
import { JoinSubreddit } from '../components/JoinSubreddit';
import { Subreddit } from '../types';

export const SubredditPage = () => {
  const params = useParams();
  const { loading, getSubreddit } = useGetSubreddit();
  const { user } = useAuth();

  const [subredditInfo, setSubredditInfo] = useState<Subreddit | null>(null);
  const { getSubThreads, loading: gettingThreads } = useGetSubThreads();
  const [threads, setThreads] = useState<ThreadType[]>([]);

  useEffect(() => {
    getSubreddit(params.subredditId as string).then((result) =>
      setSubredditInfo(result),
    );
  }, []);

  useEffect(() => {
    if (!!subredditInfo?.id) {
      // Fetch the threads

      getSubThreads(subredditInfo.id).then((data) =>
        setThreads(data as ThreadType[]),
      );
    }
  }, [subredditInfo?.id]);

  return (
    <>
      {loading && (
        <div className='fixed inset-0 h-screen bg-canvas flex items-center justify-center'>
          <Spinner size='lg' />
        </div>
      )}
      {!loading && subredditInfo !== null && (
        <div>
          <div className='px-6 py-10 text-2xl  sm:text-3xl bg-body rounded-b-lg font-semibold flex justify-between'>
            <h2>r/{subredditInfo.name}</h2>
            <JoinSubreddit
              subreddit={subredditInfo}
              userId={user?.id as string}
            />
          </div>

          <div className='w-full max-w-3xl mx-auto flex flex-col gap-y-6 sm:flex-row sm:justify-between sm:items-center bg-body rounded-lg p-4 mt-4'>
            <div className='flex items-center gap-2 self-center'>
              <Avatar url={user?.avatarURL as string} />
              <div className='font-semibold text-xs'>u/{user?.username}</div>
            </div>
            <div className='flex flex-col gap-2 sm:flex-row'>
              <CreateThread subredditId={subredditInfo.id} />
            </div>
          </div>
          {/* Container to render threads */}
          {gettingThreads ? (
            <div className='pt-10 flex justify-center'>
              <Spinner />
            </div>
          ) : (
            <div className='mt-6'>
              <ThreadsContainer threads={threads} />
            </div>
          )}
        </div>
      )}
    </>
  );
};
