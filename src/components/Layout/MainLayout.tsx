import { Button, Link, Spinner } from 'components/Elements';
import { Logo } from 'components/Logo';
import { Auth, signOut } from 'firebase/auth';
import { useAuth } from 'providers';
import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { user, auth } = useAuth();
  const navigate = useNavigate();

  return (
    <header className='w-full bg-body fixed top-0'>
      <nav className='max-w-6xl px-4 mx-auto w-full flex items-center justify-between'>
        <Link to='/'>
          <Logo />
        </Link>
        <div className='flex items-center gap-4'>
          <div className='flex items-center gap-2 text-sm'>
            <img
              className='bg-white rounded-full w-8 h-8 overflow-hidden'
              src={user?.avatarURL as string}
              alt='user avatar'
            />
            <div className='text-gray-100 text-xs font-semibold'>
              u/{user?.username}
            </div>
          </div>
          <Button
            variant='secondary'
            onClick={async () => {
              await signOut(auth as Auth);
              navigate('/auth/login');
            }}
          >
            Sign Out
          </Button>
        </div>
      </nav>
    </header>
  );
};
interface MainLayoutProps {
  children?: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className='h-screen bg-canvas relative'>
      <Header />
      <div className='pt-20 w-full max-w-5xl mx-auto'>{children}</div>
    </div>
  );
};
