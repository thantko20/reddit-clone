import clsx from 'clsx';
import { ButtonHTMLAttributes } from 'react';

const variants = {
  primary: 'bg-gray-50 text-gray-900 hover:bg-gray-100',
  secondary:
    'bg-transparent text-gray-50 border border-gray-50 hover:bg-gray-50 hover:text-gray-900',
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
    >
      {props.children}
    </button>
  );
};
