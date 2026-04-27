import { NotationInputPage } from '@/pages/notation-input-page';
import { createBrowserRouter } from 'react-router';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <NotationInputPage />,
  },
]);
