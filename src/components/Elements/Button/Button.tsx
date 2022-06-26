import clsx from 'clsx';
import { ButtonHTMLAttributes } from 'react';
import { Spinner } from '../Spinner';

const variants = {
  primary: 'bg-red-500 text-red-50 hover:bg-red-400',
  secondary:
    'bg-transparent text-red-50 border border-red-50 hover:bg-red-500 hover:text-red-50',
};

const sizes = {
  sm: 'px-4 py-1 text-sm',
  md: 'px-5 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  isLoading?: boolean;
};

export const Button = ({
  type = 'button',
  className = '',
  variant = 'primary',
  size = 'md',
  isLoading = false,
  ...props
}: ButtonProps) => {
  return (
    <button
      type={type}
      className={clsx(
        'flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed rounded-full tracking-wide font-semibold transition-colors focus:outline focus:outline-2 focus:outline-gray-50 focus:outline-offset-2',
        variants[variant],
        sizes[size],
        className,
      )}
      disabled={isLoading}
    >
      {isLoading && <Spinner size='sm' />}
      <span className='ml-2'>{isLoading ? 'Loading' : props.children}</span>
    </button>
  );
};
