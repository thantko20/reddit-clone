/* eslint-disable react-hooks/exhaustive-deps */
import { Spinner } from 'components';
import { useGetSubThreads } from 'features/threads/api';
import { ThreadsContainer } from 'features/threads/components';
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
