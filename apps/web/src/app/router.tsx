import { NotationInputPage, RepositoryHomePage, RepositoryListPage } from '@/pages';
import { Navigate, createBrowserRouter } from 'react-router';

export const createAppRouter = () =>
  createBrowserRouter([
    {
      path: '/',
      element: <Navigate to="/repositories" replace />,
    },
    {
      path: '/repositories',
      element: <RepositoryListPage />,
    },
    {
      path: '/repositories/:repositoryId',
      element: <RepositoryHomePage />,
    },
    {
      path: '/repositories/:repositoryId/new',
      element: <NotationInputPage />,
    },
  ]);
