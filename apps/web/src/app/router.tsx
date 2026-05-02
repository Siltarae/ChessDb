import { NotationInputPage } from '@/pages';
import { createBrowserRouter } from 'react-router';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <NotationInputPage />,
  },
]);
