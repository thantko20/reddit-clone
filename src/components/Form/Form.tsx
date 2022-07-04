import { Form as FormikForm } from 'formik';
import { ReactNode } from 'react';

export interface FormProps {
  children?: ReactNode;
}

export const Form = ({ children }: FormProps) => {
  return <FormikForm className='space-y-4'>{children}</FormikForm>;
};
