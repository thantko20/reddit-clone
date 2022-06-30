import { useAuth } from 'providers';
import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

export const PublicRoutes = () => {
  const { auth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (auth?.currentUser) {
      navigate('/app');
    }
  }, [auth?.currentUser, navigate]);

  return <Outlet />;
};
