import { Button, Link, Spinner } from 'components';
import { Transition } from '@headlessui/react';
import { Logo } from 'components/Logo';
import { useAuth } from 'providers';
import { Navigate } from 'react-router-dom';

export const Landing = () => {
  const { checkingStatus, isLoggedIn } = useAuth();

  return (
    <div className='bg-canvas h-screen flex items-center'>
      {checkingStatus ? (
        <Spinner size='lg' className='mx-auto' />
      ) : isLoggedIn ? (
        <Navigate to='/app' />
      ) : (
        <div className='max-w-3xl mx-auto bg-transparent'>
          <Transition
            appear={true}
            show={true}
            enter='transition-opacity duration-1000'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='transition-opacity duration-150'
            leaveFrom='opacity-100'
            leaveTo='opacity-100'
          >
            <div className='flex flex-col gap-8 sm:items-center px-4 md:items-end '>
              <Link to='/' className='self-center'>
                <Logo />
              </Link>
              <h1 className='text-3xl mt-20 sm:text-5xl text-lightGray font-bold sm:text-center md:text-right'>
                a network of communities where{' '}
                <span className='text-mainRed'>people</span> can dive into their
                interests, hobbies and passions.
              </h1>
              <div className='mt-8 flex gap-4'>
                <Link to='/auth/login'>
                  <Button variant='secondary'>Login</Button>
                </Link>
                <Link to='/auth/register'>
                  <Button>Register</Button>
                </Link>
              </div>
            </div>
          </Transition>
        </div>
      )}
    </div>
  );
};
