import clsx from 'clsx';
import { useField } from 'formik';

export type TextareaFieldProps = {
  id?: string;
  name: string;
  label: string;
  placeholder?: string;
  className?: string;
  autoComplete?: 'on' | 'off';
};

export const TextareaField = ({
  label,
  className = '',
  ...props
}: TextareaFieldProps) => {
  const [field, meta] = useField(props);

  return (
    <div>
      <label
        htmlFor={props.id || props.name}
        className='font-semibold text-lightGray block'
      >
        {label}
      </label>
      <textarea
        className={clsx(
          'mt-2 w-full px-3 py-2 outline-none rounded bg-gray-800 text-mediumGray border border-gray-600 transition-colors focus:border-green-300 invalid:border-red-400 placeholder-gray-600 placeholder:text-sm',
          className,
        )}
        rows={4}
        {...field}
        {...props}
      />
      {meta.touched && meta.error ? (
        <div className='mt-1 text-red-400 text-sm max-w-full' role='alert'>
          {meta.error}
        </div>
      ) : (
        <div>&nbsp;</div>
      )}
    </div>
  );
};
