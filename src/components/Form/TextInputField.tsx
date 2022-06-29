import clsx from 'clsx';
import { useField } from 'formik';

export type TextInputFieldProps = {
  type?: 'email' | 'text' | 'password';
  id?: string;
  name: string;
  label: string;
  placeholder?: string;
  className?: string;
};

export const TextInputField = ({
  type = 'text',
  label,
  className = '',
  ...props
}: TextInputFieldProps) => {
  const [field, meta] = useField(props);

  return (
    <div>
      <label
        htmlFor={props.id || props.name}
        className='font-semibold text-lightGray block'
      >
        {label}
      </label>
      <input
        className={clsx(
          'mt-2 w-full px-3 py-2 outline-none rounded bg-gray-800 text-mediumGray border border-gray-600 transition-colors focus:border-green-300 invalid:border-red-400',
          className,
        )}
        type={type}
        {...field}
        {...props}
      />
      {meta.touched && meta.error ? (
        <div className='mt-1 text-red-400 text-sm max-w-full' role='alert'>
          {meta.error}
        </div>
      ) : null}
    </div>
  );
};
