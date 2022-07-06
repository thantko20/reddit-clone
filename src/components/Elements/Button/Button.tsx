import clsx from 'clsx';
import { ButtonHTMLAttributes, forwardRef } from 'react';
import { Spinner } from '../Spinner';

const variants = {
  primary: 'bg-lightGray text-body hover:bg-[#c4c9cb]',
  secondary:
    'bg-transparent text-lightGray border border-lightGray hover:bg-lightGray/20',
};

const sizes = {
  sm: 'px-3 py-1 text-xs',
  md: 'px-4 py-1 text-sm',
  lg: 'px-6 py-3 text-base',
};

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  isLoading?: boolean;
};

//   {
//     type = 'button',
//     className = '',
//     variant = 'primary',
//     size = 'md',
//     isLoading = false,
//     ...props
//   }: ButtonProps
// };

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      type = 'button',
      className = '',
      variant = 'primary',
      size = 'md',
      isLoading = false,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        className={clsx(
          'relative overflow-hidden flex justify-center items-center gap-4 disabled:cursor-not-allowed rounded-full tracking-wide font-semibold transition-colors focus:outline focus:outline-2 focus:outline-gray-50 focus:outline-offset-2',
          variants[variant],
          sizes[size],
          className,
        )}
        disabled={isLoading}
        {...props}
      >
        {isLoading && (
          <div className='absolute inset-0 flex items-center justify-center bg-gray-400'>
            <Spinner size='sm' />
          </div>
        )}
        {props.children}
      </button>
    );
  },
);
