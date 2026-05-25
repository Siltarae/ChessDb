import { RouterProvider } from 'react-router';
import { useMemo } from 'react';

import { DraftRestoreProvider } from './app/providers/draft-restore-provider';
import { AppQueryClientProvider } from './app/providers/query-client-provider';
import { createAppRouter } from './app/router';

export const App = () => {
  const router = useMemo(() => createAppRouter(), []);

  return (
    <AppQueryClientProvider>
      <DraftRestoreProvider>
        <RouterProvider router={router} />
      </DraftRestoreProvider>
    </AppQueryClientProvider>
  );
};
