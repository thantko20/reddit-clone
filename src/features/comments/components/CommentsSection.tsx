import { Avatar, Spinner } from 'components';
import { VotesUI } from 'features/votes/components';
import { calcTimePast } from 'utils';
import { AddComment } from './AddComment';
import { CommentType } from '../types';
import { useGetComments } from '../api';
import { useCallback, useEffect, useRef, useState } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from 'lib/firebase/firebase';
import { orderCommentsByVotes } from 'features/utils';

type CommentProps = CommentType;

const Comment = ({
  upvotes,
  downvotes,
  author,
  createdAt,
  description,
  id,
  voteCounts,
}: CommentProps) => {
  return (
    <div className='px-4 flex flex-col gap-3'>
      <div>
        <div className='flex items-center justify-start gap-2 text-sm text-zinc-400'>
          <Avatar size='sm' url={author.avatarURL} alt='avatar' />
          <span>{author.name}</span>
          <span>&bull;</span>
          <span>{calcTimePast(createdAt)}</span>
        </div>
      </div>
      <p>{description}</p>
      <VotesUI
        type='COMMENT'
        upvotes={upvotes}
        downvotes={downvotes}
        originId={id}
        alignment='horizontal'
      />
    </div>
  );
};

export interface CommentsSectionProps {
  threadId: string;
}

export const CommentsSection = ({ threadId }: CommentsSectionProps) => {
  const [comments, setComments] = useState<CommentType[]>([]);
  const { getComments, loading } = useGetComments();

  const scrollRef = useRef<null | HTMLDivElement>(null);

  const executeScroll = () => {
    if (scrollRef.current)
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchComments = useCallback(async () => {
    const data = await getComments(threadId);
    setComments(orderCommentsByVotes(data as CommentType[]));
  }, [getComments, threadId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  // Attach and detach listener to comments collection
  useEffect(() => {
    const q = query(
      collection(db, 'comments'),
      where('threadId', '==', threadId),
    );
    const unsubscribe = onSnapshot(q, async () => {
      await fetchComments();
    });

    return () => unsubscribe();
  }, [fetchComments, threadId]);

  return (
    <div className='bg-body mt-4 rounded-lg divide-y divide-zinc-700/40'>
      <div className='p-6'>
        <AddComment threadId={threadId} scrollToBottom={executeScroll} />
      </div>
      {loading && !comments ? (
        <div className='flex justify-center pt-10'>
          <Spinner />
        </div>
      ) : comments.length > 0 ? (
        <div className='relative flex flex-col gap-8 py-6'>
          {comments.map((comment) => (
            <Comment key={comment.id} {...comment} />
          ))}
          <div ref={scrollRef} className='absolute bottom-0'></div>
        </div>
      ) : (
        <div className='flex py-20 justify-center w-full'>
          <p>No Comments Yet</p>
        </div>
      )}
    </div>
  );
};
