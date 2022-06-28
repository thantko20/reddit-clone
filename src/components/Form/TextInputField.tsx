import clsx from 'clsx';
import { useField } from 'formik';

export type InputFieldProps = {
  type?: 'email' | 'text' | 'password';
  id?: string;
  name: string;
  label: string;
  className?: string;
};

export const InputField = ({
  type = 'text',
  label,
  className = '',
  ...props
}: InputFieldProps) => {
  const [field, meta] = useField(props.name);

  return (
    <div>
      <label htmlFor={props.id || props.name}>{label}</label>
      <input className={clsx('mt-2', className)} {...field} {...props} />
      {meta.touched && meta.error ? (
        <div className='mt-1 text-rose-300'>{meta.error}</div>
      ) : null}
    </div>
  );
};
