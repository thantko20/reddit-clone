import { Landing } from 'features/misc';
import { Route, Routes } from 'react-router-dom';
import { PublicRoutes } from './public';
import { ProtectedRoutes } from './protected';
import { Login } from 'features/auth/routes/Login';
import { Register } from 'features/auth/routes/Register';

export const AppRoutes = () => {
  return (
    <div className='font-poppins text-lightGray'>
      <Routes>
        <Route path='/' element={<Landing />} />
        <Route path='/app/' element={<ProtectedRoutes />}></Route>
        <Route path='/auth/' element={<PublicRoutes />}>
          <Route path='login' element={<Login />} />
          <Route path='register' element={<Register />} />
        </Route>
      </Routes>
    </div>
  );
};
