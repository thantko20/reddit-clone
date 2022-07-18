import { Landing, MainPage } from 'features/misc';
import { Outlet, useRoutes } from 'react-router-dom';
import { PublicRoutes } from './public';
import { ProtectedRoutes } from './protected';
import { authRoutes } from 'features/auth/routes';
import { SubredditPage, Subreddits } from 'features/subreddit/routes';
import { ThreadPage } from 'features/threads/routes/ThreadPage';

const routes = [
  {
    path: '/',
    element: <Landing />,
  },
  {
    path: '/app/',
    element: <ProtectedRoutes />,
    children: [
      { index: true, element: <MainPage /> },
      {
        path: 'subreddits',
        element: <Outlet />,
        children: [
          { index: true, element: <Subreddits /> },
          {
            path: ':subredditId',
            element: <Outlet />,
            children: [
              { index: true, element: <SubredditPage /> },
              { path: ':threadId', element: <ThreadPage /> },
            ],
          },
        ],
      },
    ],
  },
  {
    path: '/auth/',
    element: <PublicRoutes />,
    children: authRoutes,
  },
];

export const AppRoutes = () => {
  const appRoutes = useRoutes(routes);

  return <div className='font-poppins text-lightGray'>{appRoutes}</div>;
};
