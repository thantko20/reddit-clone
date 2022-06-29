import { Button, Form, TextInputField } from 'components';
import { Formik } from 'formik';
import * as yup from 'yup';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

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

export const LoginForm = () => {
  return (
    <Formik
      initialValues={{
        email: '',
        password: '',
      }}
      onSubmit={async (value, { resetForm, setSubmitting }) => {
        setSubmitting(true);
        await sleep(1000);
        alert(JSON.stringify(value, null, 2));
        resetForm();
      }}
      validationSchema={validationSchema}
    >
      {({ isSubmitting }) => (
        <Form>
          <TextInputField label='Email' name='email' id='email' type='email' />
          <TextInputField
            label='Password'
            name='password'
            id='password'
            type='password'
          />
          <Button type='submit' isLoading={isSubmitting}>
            Log in
          </Button>
        </Form>
      )}
    </Formik>
  );
};
