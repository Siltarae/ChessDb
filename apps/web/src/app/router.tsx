import { NotationInputPage, RepositoryListPage } from '@/pages';
import { createBrowserRouter } from 'react-router';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <NotationInputPage />,
  },
  {
    path: '/repositories',
    element: <RepositoryListPage />,
  },
]);
