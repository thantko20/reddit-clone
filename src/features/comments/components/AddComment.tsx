import { Button, TextareaField } from 'components';
import { Formik, Form } from 'formik';
import toast from 'react-hot-toast';
import { useAddComment } from '../api';
import * as yup from 'yup';

const validationSchema = yup.object().shape({
  description: yup.string().required(),
});

interface AddCommentProps {
  threadId: string;
  scrollToBottom: () => void;
}

export const AddComment = ({ threadId, scrollToBottom }: AddCommentProps) => {
  const { addComment, loading } = useAddComment();

  const handleSubmit = async (description: string) => {
    try {
      await addComment(description, threadId);
      scrollToBottom();
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      }
    }
  };

  return (
    <Formik
      initialValues={{
        description: '',
      }}
      onSubmit={async (values, { resetForm }) => {
        await handleSubmit(values.description);
        resetForm();
      }}
      validationSchema={validationSchema}
    >
      <Form className='py-4'>
        <TextareaField
          name='description'
          id='description'
          autoComplete='off'
          placeholder='Express your thoughts'
        />
        <Button type='submit' className='float-right' isLoading={loading}>
          Comment
        </Button>
      </Form>
    </Formik>
  );
};
