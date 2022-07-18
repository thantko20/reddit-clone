/* eslint-disable react-hooks/exhaustive-deps */
import { Link } from 'components';
import { useAuth } from 'providers';
import { useCallback, useEffect, useState } from 'react';
import { useGetSubreddits } from '../api/getSubreddits';
import { JoinSubreddit } from '../components/JoinSubreddit';
import { Subreddit } from '../types';

export interface SubredditListItemProps {
  subreddit: Subreddit;
  userId: string;
}

export const SubredditListItem = ({
  subreddit,
  userId,
}: SubredditListItemProps) => {
  return (
    <li className='px-6 py-8 bg-body text-lg rounded-lg flex justify-between'>
      <Link to={subreddit.id}>r/{subreddit.name}</Link>
      <JoinSubreddit subreddit={subreddit} userId={userId} />
    </li>
  );
};

type SubredditsType = Subreddit[];

export const Subreddits = () => {
  const { user } = useAuth();

  const [subreddits, setSubreddits] = useState<SubredditsType>([]);
  const { getSubreddits } = useGetSubreddits();

  const fetchSubreddits = useCallback(async () => {
    const data = await getSubreddits();
    setSubreddits(data as SubredditsType);
  }, []);

  useEffect(() => {
    fetchSubreddits();
  }, [fetchSubreddits]);

  return (
    <div className='pt-10 w-full max-w-3xl mx-auto'>
      <ul className='w-full flex flex-col gap-6'>
        {subreddits.length === 0 && (
          <p className='text-center'>No Subreddits Created</p>
        )}
        {subreddits.map((subreddit) => (
          <SubredditListItem
            key={subreddit.id}
            userId={user?.id as string}
            subreddit={subreddit}
          />
        ))}
      </ul>
    </div>
  );
};
