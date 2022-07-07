import { Button, FileInput, Form, Link, TextInputField } from 'components';
import { useRegisterWithEmailAndPassword } from '../api';
import { Formik } from 'formik';
import * as yup from 'yup';
import toast from 'react-hot-toast';

const validationSchema = yup.object().shape({
  email: yup.string().email('Enter a valid email').required(),

  password: yup
    .string()
    .min(8, 'Password should have minimum 8 characters length')
    .required(),

  name: yup.string().required(),
  username: yup
    .string()
    .trim()
    .required()
    .min(2)
    .max(20)
    .matches(/^[^\s-]+$/, 'White spaces and hyphen are not allowed'),

  avatar: yup
    .mixed()
    .test(
      'fileSize',
      'File is too large. Maximum file size is 1MB',
      (value) => !value || (value && value.size <= 1048576),
    ),
});

interface RegisterFormProps {
  onSuccess: () => void;
}

export const RegisterForm = ({ onSuccess }: RegisterFormProps) => {
  const registerWithEmailAndPassword = useRegisterWithEmailAndPassword();

  return (
    <>
      <Formik
        initialValues={{
          email: '',
          password: '',
          name: '',
          username: '',
          avatar: null,
        }}
        onSubmit={async (values, { resetForm }) => {
          try {
            await registerWithEmailAndPassword.register(values);
            resetForm();
            onSuccess();
          } catch {
            toast.error('There was an error during registration');
          }
        }}
        validationSchema={validationSchema}
      >
        {({ setFieldValue }) => (
          <Form>
            <TextInputField
              label='Email'
              name='email'
              id='email'
              type='email'
            />
            <TextInputField
              label='Password'
              name='password'
              id='password'
              type='password'
            />
            <TextInputField label='Name' name='name' id='name' type='text' />
            <TextInputField
              label='Username'
              name='username'
              id='username'
              type='text'
            />

            <FileInput
              label='Choose a profile picture'
              id='avatar'
              name='avatar'
              fileType='image/png, image/jpeg'
              setFile={setFieldValue}
            />
            <Button
              type='submit'
              isLoading={registerWithEmailAndPassword.isLoading}
            >
              Register
            </Button>
          </Form>
        )}
      </Formik>
      <p className='mt-6 text-sm'>
        Already have an account? <Link to='/auth/login'>Login</Link>
      </p>
    </>
  );
};
