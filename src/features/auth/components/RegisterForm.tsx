import { Button, Form, Link, TextInputField } from 'components';
import { useRegisterWithEmailAndPassword } from '../api';
import { Formik } from 'formik';
import * as yup from 'yup';

// const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const validationSchema = yup.object().shape({
  email: yup.string().email('Enter a valid email').required(),

  password: yup
    .string()
    .min(8, 'Password should have minimum 8 characters length')
    .required(),

  name: yup.string().required(),
  username: yup
    .string()
    .min(2, 'Username should have minimum 2 characters length')
    .required(),
});

interface RegisterFormProps {
  onSuccess: () => void;
}

export const RegisterForm = ({ onSuccess }: RegisterFormProps) => {
  const registerWithEmailAndPassword = useRegisterWithEmailAndPassword();

  return (
    <div>
      <Formik
        initialValues={{
          email: '',
          password: '',
          name: '',
          username: '',
          avatar: null,
        }}
        onSubmit={async (values, { resetForm }) => {
          console.log(values.avatar);
          await registerWithEmailAndPassword.register(values);
          resetForm();
          onSuccess();
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
            <div>
              <label htmlFor='avatar' className='block'>
                Choose Profile Picture
              </label>

              <input
                className='mt-1'
                type='file'
                id='avatar'
                name='avatar'
                accept='image/png, image/jpeg'
                onChange={(e) => {
                  if (!e.target.files) return;
                  const file = e.target.files[0];
                  console.log(file);
                  setFieldValue('avatar', file);
                }}
              />
            </div>

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
    </div>
  );
};
