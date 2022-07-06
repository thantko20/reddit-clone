import { Button, Link } from 'components';
import { useAuth } from 'providers';
import { useEffect, useState } from 'react';
import { useGetSubreddits } from '../api/getSubreddits';
import { useJoinSubreddit, hasJoinedSubreddit } from '../api/joinSubreddit';
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

  useEffect(() => {
    getSubreddits().then((data) => setSubreddits(data as SubredditsType));
  }, []);

  return (
    <div className='pt-10'>
      <ul className='w-full flex flex-col gap-6'>
        {!subreddits && <div>No Subreddits Here</div>}
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
