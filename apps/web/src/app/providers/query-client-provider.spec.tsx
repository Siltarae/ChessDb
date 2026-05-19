import { render, screen } from '@testing-library/react';
import { useQueryClient } from '@tanstack/react-query';
import { describe, expect, it } from 'vitest';

import { AppQueryClientProvider } from './query-client-provider';

const QueryClientStatus = () => {
  const queryClient = useQueryClient();

  return <div>{queryClient ? 'query client ready' : 'query client missing'}</div>;
};

describe('AppQueryClientProvider', () => {
  it('하위 컴포넌트에 QueryClient를 제공해야 한다', () => {
    render(
      <AppQueryClientProvider>
        <QueryClientStatus />
      </AppQueryClientProvider>,
    );

    expect(screen.getByText('query client ready')).toBeInTheDocument();
  });
});
