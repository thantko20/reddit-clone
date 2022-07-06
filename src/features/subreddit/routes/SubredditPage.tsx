/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Spinner } from 'components';
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

  useEffect(() => {
    getSubreddit(params.subredditId as string).then((result) =>
      setSubredditInfo(result),
    );
  }, []);

  return (
    <>
      {loading && (
        <div className='fixed inset-0 h-screen bg-canvas flex items-center justify-center'>
          <Spinner size='lg' />
        </div>
      )}
      {!loading && subredditInfo !== null && (
        <div>
          <div className='px-6 py-10 text-3xl bg-mainRed rounded-b-lg font-semibold flex justify-between'>
            <h2>r/{subredditInfo.name}</h2>
            <JoinSubreddit
              subreddit={subredditInfo}
              userId={user?.id as string}
            />
          </div>
        </div>
      )}
    </>
  );
};
