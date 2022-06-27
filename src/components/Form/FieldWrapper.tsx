import clsx from 'clsx';
import { LabelHTMLAttributes } from 'react';

export type FieldWrapperProps = LabelHTMLAttributes<HTMLLabelElement> & {
  label?: string;
};

export const FieldWrapper = ({
  htmlFor,
  label = '',
  className = '',
  children,
  ...props
}: FieldWrapperProps) => {
  return (
    <label
      htmlFor={htmlFor}
      className={clsx('font-semibold text-inherit block', className)}
    >
      {label}
      <div className='mt-2'>{children}</div>
    </label>
  );
};
