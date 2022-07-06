import { Avatar, Button } from 'components';
import { CreateSubreddit } from 'features/subreddit/components';
import { useAuth } from 'providers';

export const MainPage = () => {
  const { user } = useAuth();
  return (
    <main className='max-w-2xl w-full mx-auto px-1 pt-10'>
      <div className='w-full flex flex-col gap-y-6 sm:flex-row sm:justify-between sm:items-center bg-body rounded-lg p-4'>
        <div className='flex items-center gap-2 self-center'>
          <Avatar url={user?.avatarURL as string} />
          <div className='font-semibold text-xs'>u/{user?.username}</div>
        </div>
        <div className='flex flex-col gap-2 sm:flex-row'>
          <Button>Post a thread</Button>
          <CreateSubreddit />
        </div>
      </div>
    </main>
  );
};
