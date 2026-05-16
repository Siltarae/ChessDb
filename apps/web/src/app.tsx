import { RouterProvider } from 'react-router';

import { DraftRestoreProvider } from './app/providers/draft-restore-provider';
import { router } from './app/router';

export const App = () => {
  return (
    <DraftRestoreProvider>
      <RouterProvider router={router} />
    </DraftRestoreProvider>
  );
};
