import { Landing, MainPage } from 'features/misc';
import { Route, Routes } from 'react-router-dom';
import { PublicRoutes } from './public';
import { ProtectedRoutes } from './protected';
import { authRoutes } from 'features/auth/routes';
import { SubredditPage, Subreddits } from 'features/subreddit/routes';

export const AppRoutes = () => {
  return (
    <div className='font-poppins text-lightGray'>
      <Routes>
        <Route path='/' element={<Landing />} />
        <Route path='/app/' element={<ProtectedRoutes />}>
          <Route index element={<MainPage />} />
          <Route path='subreddits/' element={<Subreddits />} />
          <Route path='subreddits/:subredditId' element={<SubredditPage />} />
        </Route>
        <Route path='/auth/' element={<PublicRoutes />}>
          {authRoutes.map((route, id) => (
            <Route key={id} path={route.path} element={route.element} />
          ))}
        </Route>
      </Routes>
    </div>
  );
};
