import { Login } from './Login';
import { Register } from './Register';

export const authRoutes = [
  { path: 'login', element: <Login /> },
  { path: 'register', element: <Register /> },
];
