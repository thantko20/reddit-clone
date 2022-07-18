import { Button } from 'components';
import { useEffect, useState } from 'react';
import { ThreadType } from '../types';
import { ThreadCard } from './ThreadCard';

// Filter Components for future
interface FilterThreadsProps {
  setFilterThreads: (threads: ThreadType[]) => void;
  threads: ThreadType[];
}

export const FilterThreads = ({
  setFilterThreads,
  threads,
}: FilterThreadsProps) => {
  const [filterId, setFilterId] = useState(0);

  const filterLatest = () => {
    const output = [...threads];
    const currTime = Date.now();

    return output.sort((a, b) => {
      if (currTime - a.createdAt < currTime - b.createdAt) {
        return -1;
      }

      if (currTime - a.createdAt > currTime - b.createdAt) {
        return 1;
      }

      return 0;
    });
  };

  useEffect(() => {
    switch (filterId) {
      case 0: {
        setFilterThreads(filterLatest());
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterId, threads]);

  return (
    <div className='flex gap-8 px-1 py-6'>
      <Button size='lg' variant='primary'>
        Latest
      </Button>
      <Button size='lg' variant='secondary'>
        Best
      </Button>
      <Button size='lg' variant='secondary'>
        Controversial
      </Button>
    </div>
  );
};

interface ThreadsContainerProps {
  threads: ThreadType[];
}

export const ThreadsContainer = ({ threads }: ThreadsContainerProps) => {
  const [filteredThreads, setFilteredThreads] = useState<ThreadType[]>([]);

  useEffect(() => {
    setFilteredThreads(threads);
  }, [threads]);

  return (
    <div className='max-w-3xl mx-auto'>
      {/* <FilterThreads setFilterThreads={setFilteredThreads} threads={threads} /> */}
      <div className='space-y-8'>
        {filteredThreads.map((thread) => (
          <ThreadCard key={thread.id} {...thread} />
        ))}
      </div>
    </div>
  );
};
