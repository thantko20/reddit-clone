import clsx from 'clsx';
import { useField } from 'formik';

export type InputFieldProps = {
  type?: 'email' | 'text' | 'password';
  id?: string;
  name: string;
  label: string;
  placeholder?: string;
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
      <label
        htmlFor={props.id || props.name}
        className='font-semibold text-lightGray'
      >
        {label}
      </label>
      <input
        className={clsx(
          'mt-2 px-2 py-1 outline-none bg-gray-800 text-mediumGray border border-gray-600 transition-colors focus:border-green-300 invalid:border-red-400',
          className,
        )}
        {...field}
        {...props}
      />
      {meta.touched && meta.error ? (
        <div className='mt-1 text-red-400'>{meta.error}</div>
      ) : null}
    </div>
  );
};