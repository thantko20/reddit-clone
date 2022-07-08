/* eslint-disable react-hooks/exhaustive-deps */
import {
  Button,
  FileInput,
  Link,
  Select,
  TextareaField,
  TextInputField,
} from 'components';
import { FormDialog } from 'components/Form/FormDialog';
import { useGetUserSubreddits } from 'features/subreddit/api/getUserSubreddits';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

import * as yup from 'yup';
import { useCreateThread } from '../api';

export type SelectOptionType = { label: string; value: string };

const validationSchema = yup.object().shape({
  title: yup.string().required(),
  description: yup.string(),
  image: yup
    .mixed()
    .test(
      'fileSize',
      'File is too large. Maximum file size is 2MB',
      (value) => !value || (value && value.size <= 2097152),
    ),

  subredditInfo: yup.object().shape({
    label: yup.string().required(),
    value: yup.string().required(),
  }),
});

export const CreateThread = () => {
  const [subredditOptions, setSubredditOptions] = useState<SelectOptionType[]>(
    [],
  );
  const { loading, getUserSubreddits } = useGetUserSubreddits();
  const { loading: creating, createThread } = useCreateThread();

  useEffect(() => {
    getUserSubreddits().then((res) =>
      setSubredditOptions(() => {
        const temp: SelectOptionType[] = [];

        res?.forEach((opt) => temp.push({ label: opt.name, value: opt.id }));

        return temp;
      }),
    );
  }, []);

  return (
    <FormDialog
      title='Create A Thread'
      triggerButton={<Button type='submit'>Post A Thread</Button>}
      initialValues={{
        title: '',
        description: '',
        image: null,
        subredditInfo: {
          label: '',
          name: '',
        },
      }}
      submitState={creating}
      onSubmit={async (values, close) => {
        try {
          await createThread(values);
          toast.success(
            `Thread successfully posted in r/${
              (values.subredditInfo as SelectOptionType).label
            }`,
          );
          close();
        } catch (err: unknown) {
          if (err instanceof Error) {
            toast.error(err.message);
          }
        }
      }}
      validationSchema={validationSchema}
    >
      <TextInputField
        label='Title'
        name='title'
        autoComplete='off'
        id='title'
      />
      <TextareaField
        label='Description'
        name='description'
        autoComplete='off'
        id='description'
        placeholder='Tell people your thoughts (Optional)'
      />

      {loading ? (
        <div>Fetching Subreddits. Please Wait</div>
      ) : subredditOptions.length !== 0 ? (
        <Select name='subredditInfo' options={subredditOptions} />
      ) : (
        <div>
          You haven't joined any subreddits. Click{' '}
          <Link to='/app/subreddits'>here</Link> to join some.
        </div>
      )}

      <FileInput
        fileType='image/png, image/jpeg, image/jpg'
        label='Choose an image to Upload'
        name='image'
        id='
      image'
      />
    </FormDialog>
  );
};
