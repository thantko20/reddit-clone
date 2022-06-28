import { Logo } from 'components/Logo';
import { ReactNode } from 'react';

export const Layout = ({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) => {
  return (
    <div className='h-screen bg-canvas flex flex-col justify-center'>
      <div className='max-w-2xl'>
        <div className='flex flex-col items-center'>
          <Logo />
          <div>
            <h2 className='text-2xl sm:text-3xl font-bold text-lightGray'>
              {title}
            </h2>
            <div className='mt-4'>{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
