import { Button } from 'components';
import { useAuth } from 'providers';
import { useState } from 'react';
import { useJoinSubreddit, hasJoinedSubreddit } from '../api';
import { Subreddit } from '../types';

interface JoinSubredditProps {
  subreddit: Subreddit;
  userId: string;
}

export const JoinSubreddit = ({ subreddit, userId }: JoinSubredditProps) => {
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
    <>
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
    </>
  );
};
