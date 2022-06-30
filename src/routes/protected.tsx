import { useAuth } from 'providers';
import { Outlet, Navigate, useNavigate } from 'react-router-dom';
import { Auth, signOut } from 'firebase/auth';
import { Button, Link } from 'components';

const App = () => {
  const { auth, user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className='h-screen bg-canvas flex flex-col items-center justify-center'>
      <div className='text-mainRed'>{user?.email}</div>
      <Button
        onClick={async () => {
          await signOut(auth as Auth);
          navigate('/auth/login');
        }}
      >
        Sign Out
      </Button>
      <Outlet />
    </div>
  );
};

export const ProtectedRoutes = () => {
  const { auth } = useAuth();

  return auth?.currentUser ? <App /> : <Navigate to='/auth/login' />;
};
