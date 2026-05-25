import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { repositoryListQueryKey } from '@/entities/repository';
import { useDeleteRepository } from './use-delete-repository';

const renderUseDeleteRepository = (options?: Parameters<typeof useDeleteRepository>[0]) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      mutations: {
        retry: false,
      },
    },
  });
  const invalidateQueriesSpy = vi.spyOn(queryClient, 'invalidateQueries');
  const wrapper = ({ children }: { readonly children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  return {
    ...renderHook(() => useDeleteRepository(options), { wrapper }),
    invalidateQueriesSpy,
  };
};

describe('useDeleteRepository', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('삭제 성공 시 API를 호출하고 저장소 목록 query를 갱신해야 한다', async () => {
    const fetchMock = vi.fn<typeof fetch>();
    const onDeleted = vi.fn();
    fetchMock.mockResolvedValueOnce(new Response(null, { status: 204 }));
    vi.stubGlobal('fetch', fetchMock);
    const { result, invalidateQueriesSpy } = renderUseDeleteRepository({ onDeleted });
    let isDeleted = false;

    await act(async () => {
      isDeleted = await result.current.requestDeleteRepository('repository-1');
    });

    expect(fetchMock).toHaveBeenCalledWith('/api/repositories/repository-1', {
      method: 'DELETE',
    });
    expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: repositoryListQueryKey });
    expect(onDeleted).toHaveBeenCalledTimes(1);
    expect(result.current.deleteError).toBeNull();
    expect(isDeleted).toBe(true);
  });

  it('삭제 실패 시 목록 query를 갱신하지 않고 에러를 노출해야 한다', async () => {
    const fetchMock = vi.fn<typeof fetch>();
    const onDeleted = vi.fn();
    fetchMock.mockResolvedValueOnce(new Response('삭제 실패', { status: 500 }));
    vi.stubGlobal('fetch', fetchMock);
    const { result, invalidateQueriesSpy } = renderUseDeleteRepository({ onDeleted });
    let isDeleted = true;

    await act(async () => {
      isDeleted = await result.current.requestDeleteRepository('repository-1');
    });

    expect(invalidateQueriesSpy).not.toHaveBeenCalled();
    expect(onDeleted).not.toHaveBeenCalled();
    await waitFor(() => {
      expect(result.current.deleteError).toBe('저장소 삭제에 실패했습니다.');
    });
    expect(isDeleted).toBe(false);
  });
});
