import clsx from 'clsx';
import { ReactNode } from 'react';

export interface FieldWrapperProps {
  label: string;
  className?: string;
  htmlFor?: string;
  children?: ReactNode;
}

export const FieldWrapper = ({
  label,
  className,
  htmlFor,
  children,
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
