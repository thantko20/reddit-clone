import { doc, setDoc } from 'firebase/firestore';
import { db, saveFileInStorage } from 'lib/firebase/firebase';
import { useAuth } from 'providers';
import { useState } from 'react';
import uniqid from 'uniqid';

interface CreateThreadFormValues {
  title: string;
  description?: string;
  image?: File | null;
  subredditInfo: {
    label: string;
    value: string;
  };
}

export const useCreateThread = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const createThread = async ({
    title,
    description = '',
    image = null,
    subredditInfo,
  }: CreateThreadFormValues) => {
    try {
      setLoading(true);
      const imageURL = image
        ? await saveFileInStorage(image, 'thread_images')
        : '';

      const threadId = uniqid();
      const threadRef = doc(db, 'threads', threadId);

      await setDoc(threadRef, {
        title,
        description,
        imageURL,
        upvotes: [],
        downvotes: [],
        author: {
          name: user?.username,
          id: user?.id,
        },
        subreddit: {
          name: subredditInfo.label,
          id: subredditInfo.value,
        },
        id: threadId,
      });

      setLoading(false);
    } catch (err: unknown) {
      setLoading(false);
      if (err instanceof Error) {
        throw new Error(err.message);
      }
    }

    // Create Comments Subcollection
    // But subcollections can't be created without creating a doc in them
    // So comments subcollection will only be created upon adding the very first comment of this thread
  };

  return { loading, createThread };
};
