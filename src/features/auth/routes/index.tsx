import { useAuth } from 'providers';
import { useEffect } from 'react';
import { Route, useNavigate } from 'react-router-dom';
import { Login } from './Login';
import { Register } from './Register';

export const AuthRoute = () => {
  const navigate = useNavigate();
  const { auth } = useAuth();

  return (
    <>
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
    </>
  );
};
