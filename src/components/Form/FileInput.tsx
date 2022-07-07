import { ChangeEvent, ChangeEventHandler } from 'react';
import { useField } from 'formik';
import { useState } from 'react';

export interface FileInputProps {
  label: string;
  name: string;
  fileType: string;
  id?: string;
  setFile: (
    field: string,
    value: any,
    shouldValidate?: boolean | undefined,
  ) => void;
}

export const FileInput = ({ label, name, ...props }: FileInputProps) => {
  const [, meta] = useField(name);
  const [filename, setFilename] = useState('');

  return (
    <div>
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
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            if (e.target.files) {
              const file = e.target.files[0];

              setFilename(file.name);

              props.setFile(name, file);
            } else {
              setFilename('');
            }
          }}
        />
      </label>

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
