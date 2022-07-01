import { Button, Form, Link, TextInputField } from 'components';
import { useLoginWithEmailAndPassword } from '../api';
import { Formik } from 'formik';
import * as yup from 'yup';

// const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const validationSchema = yup.object({
  email: yup
    .string()
    .email('Enter a valid email')
    .required('This field is required'),

  password: yup
    .string()
    .min(8, 'Password should have minimum 8 characters length')
    .required('This field is required'),
});

interface LoginFormProps {
  onSuccess: () => void;
}

export const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const loginWithEmailAndPassword = useLoginWithEmailAndPassword();

  return (
    <>
      <Formik
        initialValues={{
          email: '',
          password: '',
        }}
        onSubmit={async (value, { resetForm }) => {
          await loginWithEmailAndPassword.login(value);
          resetForm();
          onSuccess();
        }}
        validationSchema={validationSchema}
      >
        <Form>
          <TextInputField label='Email' name='email' id='email' type='email' />
          <TextInputField
            label='Password'
            name='password'
            id='password'
            type='password'
          />
          <Button type='submit' isLoading={loginWithEmailAndPassword.isLoading}>
            Log in
          </Button>
        </Form>
      </Formik>
      <p className='mt-6 text-sm'>
        Don't have an account? <Link to='/auth/register'>Create One</Link>
      </p>
    </>
  );
};
