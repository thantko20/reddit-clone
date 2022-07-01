import { useAuth } from 'providers';
import { useEffect } from 'react';
import { Route, useNavigate } from 'react-router-dom';
import { Login } from './Login';
import { Register } from './Register';

export const authRoutes = [
  { path: 'login', element: <Login /> },
  { path: 'register', element: <Register /> },
];
