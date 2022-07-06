import { Button } from 'components';
import { useAuth } from 'providers';
import { useEffect, useState } from 'react';
import { useGetSubreddits } from '../api/getSubreddits';
import { useJoinSubreddit, hasJoinedSubreddit } from '../api/joinSubreddits';
import { Subreddit } from '../types';

export interface SubredditListItemProps {
  subreddit: Subreddit;
  userId: string;
}

export const SubredditListItem = ({
  subreddit,
  userId,
}: SubredditListItemProps) => {
  const [userHasJoined, setUserHasJoined] = useState(
    subreddit.members.includes(userId),
  );

  const { joinSubreddit, loading } = useJoinSubreddit();

  const handleOnJoinClick = async () => {
    await joinSubreddit(subreddit.id, userId);
    const hasJoined = await hasJoinedSubreddit(userId, subreddit.id);

    setUserHasJoined(hasJoined);
  };

  return (
    <li className='px-6 py-8 bg-body text-lg rounded-lg flex justify-between'>
      <span>r/{subreddit.name}</span>
      {userHasJoined ? (
        <Button
          variant='primary'
          onClick={handleOnJoinClick}
          isLoading={loading}
        >
          Joined
        </Button>
      ) : (
        <Button
          variant='secondary'
          onClick={handleOnJoinClick}
          isLoading={loading}
        >
          Join
        </Button>
      )}
    </li>
  );
};

type SubredditsType = Subreddit[];

export const Subreddits = () => {
  const { user } = useAuth();

  const [subreddits, setSubreddits] = useState<SubredditsType>([]);
  const { getSubreddits, loading } = useGetSubreddits();

  useEffect(() => {
    getSubreddits().then((data) => setSubreddits(data as SubredditsType));
  }, []);

  return (
    <div>
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
