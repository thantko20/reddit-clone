import { Link } from 'components';
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
    <div className='min-h-screen bg-canvas flex flex-col items-center p-4'>
      <Link to='/'>
        <Logo />
      </Link>
      <div className='max-w-2xl'>
        <div className='flex flex-col items-center'>
          <div className='mt-20'>
            <h2 className='text-2xl sm:text-3xl font-bold text-lightGray'>
              {title}
            </h2>
            <div className='mt-10 w-full'>{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
