import { ChangeEvent } from 'react';
import { useField, useFormikContext } from 'formik';
import { useState } from 'react';

export interface FileInputProps {
  label: string;
  name: string;
  fileType: string;
  id?: string;
}

export const FileInput = ({ label, name, ...props }: FileInputProps) => {
  const [, meta] = useField(name);
  const [filename, setFilename] = useState('');
  const { setFieldValue } = useFormikContext();

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      console.log(file);
      if (file) {
        setFilename(file.name);

        setFieldValue(name, file);
      }
    } else {
      setFilename('');
    }
  };

  const handleRemove = () => {
    setFilename('');
    setFieldValue(name, null);
  };

  return (
    <div>
      <div className='flex items-center gap-4'>
        <label
          htmlFor={props.id || name}
          className='block bg-white/10 p-4 max-w-max rounded-lg cursor-pointer hover:bg-white/20'
        >
          {label}
          <input
            className='appearance-none hidden'
            type='file'
            id={props.id || name}
            name={name}
            accept={props.fileType}
            onChange={handleOnChange}
          />
        </label>
        <button type='button' onClick={handleRemove}>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-6 w-6'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
            strokeWidth={2}
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z'
            />
          </svg>
        </button>
      </div>

      <span>{filename || ' '}</span>

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
