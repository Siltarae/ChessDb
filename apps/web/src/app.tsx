import { RouterProvider } from 'react-router';

import { DraftRestoreProvider } from './app/providers/draft-restore-provider';
import { AppQueryClientProvider } from './app/providers/query-client-provider';
import { router } from './app/router';

export const App = () => {
  return (
    <AppQueryClientProvider>
      <DraftRestoreProvider>
        <RouterProvider router={router} />
      </DraftRestoreProvider>
    </AppQueryClientProvider>
  );
};
