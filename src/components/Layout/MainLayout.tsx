import { Avatar, Button, Link } from 'components/Elements';
import { Logo } from 'components/Logo';
import { SignOut } from 'features/auth/components/SignOut';
import { Auth, signOut } from 'firebase/auth';
import { useAuth } from 'providers';
import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { user, auth } = useAuth();
  const navigate = useNavigate();

  return (
    <header className='w-full bg-body sticky top-0 border-b border-gray-600 z-50'>
      <nav className='max-w-6xl px-4 mx-auto w-full flex items-center justify-between'>
        <Link to='/'>
          <Logo />
        </Link>
        <div className='flex items-center gap-4'>
          <div className='flex items-center gap-2 text-sm'>
            <Avatar url={user?.avatarURL as string} />
            <div className='text-gray-100 text-xs font-semibold'>
              u/{user?.username}
            </div>
          </div>
          <SignOut />
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
      <div className='w-full max-w-5xl mx-auto'>{children}</div>
    </div>
  );
};
