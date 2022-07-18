import { useCreateSubreddit } from '../api';
import { useNavigate } from 'react-router-dom';
import { Button, TextInputField } from 'components';
import { FormDialog } from 'components/Form/FormDialog';
import * as yup from 'yup';
import toast from 'react-hot-toast';

const validationSchema = yup.object().shape({
  name: yup
    .string()
    .trim()
    .required()
    .min(2)
    .max(20)
    .matches(/^[^\s-]+$/, 'White spaces and hyphen are not allowed'),
});

export const CreateSubreddit = () => {
  const createSubreddit = useCreateSubreddit();
  const navigate = useNavigate();

  return (
    <FormDialog
      triggerButton={<Button variant='secondary'>Create a Community</Button>}
      submitState={createSubreddit.loading}
      title='Create A Community'
      initialValues={{
        name: '',
      }}
      validationSchema={validationSchema}
      onSubmit={async (values, close) => {
        try {
          await createSubreddit.create(values.name);
          toast.success(`r/${values.name} is created.`);
          close();
          setTimeout(() => navigate(0), 150);
        } catch (err: unknown) {
          if (err instanceof Error) {
            toast.error(err.message);
          }
        }
      }}
    >
      <TextInputField label='Name' id='name' name='name' autoComplete='off' />
    </FormDialog>
  );
};
