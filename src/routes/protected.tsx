import { useAuth } from 'providers';
import { Navigate, Outlet } from 'react-router-dom';
import { MainLayout, Spinner } from 'components';

const App = () => {
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
};

export const ProtectedRoutes = () => {
  const { isLoggedIn, checkingStatus } = useAuth();

  return (
    <>
      {checkingStatus ? (
        <div className='w-full h-screen flex items-center justify-center bg-black'>
          <Spinner size='lg' />
        </div>
      ) : isLoggedIn ? (
        <App />
      ) : (
        <Navigate to='/auth/login' />
      )}
    </>
  );
};
