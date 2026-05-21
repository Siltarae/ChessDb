import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { useCreateRepository } from './use-create-repository';

const renderUseCreateRepository = (options?: Parameters<typeof useCreateRepository>[0]) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      mutations: {
        retry: false,
      },
    },
  });
  const wrapper = ({ children }: { readonly children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  return renderHook(() => useCreateRepository(options), { wrapper });
};

describe('useCreateRepository', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('초기 상태는 빈 이름이고 제출할 수 없어야 한다', () => {
    const { result } = renderUseCreateRepository();

    expect(result.current.repositoryName).toBe('');
    expect(result.current.nameError).toBeNull();
    expect(result.current.canSubmit).toBe(false);
    expect(result.current.isCreating).toBe(false);
    expect(result.current.createError).toBeNull();
  });

  it('공백만 입력하면 에러를 노출하고 제출할 수 없어야 한다', () => {
    const { result } = renderUseCreateRepository();

    act(() => {
      result.current.setRepositoryName('   ');
    });

    expect(result.current.repositoryName).toBe('   ');
    expect(result.current.nameError).toBe('저장소 이름을 입력하세요.');
    expect(result.current.canSubmit).toBe(false);
  });

  it('유효한 이름이면 에러 없이 제출할 수 있어야 한다', () => {
    const { result } = renderUseCreateRepository();

    act(() => {
      result.current.setRepositoryName('오프닝 저장소');
    });

    expect(result.current.repositoryName).toBe('오프닝 저장소');
    expect(result.current.nameError).toBeNull();
    expect(result.current.canSubmit).toBe(true);
  });

  it('resetCreateRepositoryForm은 입력 상태를 초기화해야 한다', () => {
    const { result } = renderUseCreateRepository();

    act(() => {
      result.current.setRepositoryName('오프닝 저장소');
      result.current.resetCreateRepositoryForm();
    });

    expect(result.current.repositoryName).toBe('');
    expect(result.current.nameError).toBeNull();
    expect(result.current.canSubmit).toBe(false);
  });

  it('성공 시 trim된 이름으로 저장소 생성 API를 호출하고 onCreated를 실행한 뒤 입력을 초기화한다', async () => {
    const fetchMock = vi.fn<typeof fetch>();
    const onCreated = vi.fn();
    fetchMock.mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          id: 'repository-1',
          name: '오프닝 저장소',
          createdAt: '2026-05-21T00:00:00.000Z',
        }),
        { status: 201 },
      ),
    );
    vi.stubGlobal('fetch', fetchMock);
    const { result } = renderUseCreateRepository({ onCreated });

    act(() => {
      result.current.setRepositoryName('  오프닝 저장소  ');
    });
    let isCreated = false;

    await act(async () => {
      isCreated = await result.current.submitCreateRepository();
    });

    const [, init] = fetchMock.mock.calls[0] ?? [];

    expect(fetchMock).toHaveBeenCalledOnce();
    expect(init?.body).toBe(JSON.stringify({ name: '오프닝 저장소' }));
    expect(onCreated).toHaveBeenCalledTimes(1);
    expect(result.current.repositoryName).toBe('');
    expect(result.current.createError).toBeNull();
    expect(isCreated).toBe(true);
  });

  it('실패 시 에러를 노출하고 입력값을 유지해야 한다', async () => {
    const fetchMock = vi.fn<typeof fetch>();
    const onCreated = vi.fn();
    fetchMock.mockResolvedValueOnce(new Response('생성 실패', { status: 500 }));
    vi.stubGlobal('fetch', fetchMock);
    const { result } = renderUseCreateRepository({ onCreated });

    act(() => {
      result.current.setRepositoryName('오프닝 저장소');
    });
    let isCreated = true;

    await act(async () => {
      isCreated = await result.current.submitCreateRepository();
    });

    expect(fetchMock).toHaveBeenCalledOnce();
    expect(onCreated).not.toHaveBeenCalled();
    expect(result.current.repositoryName).toBe('오프닝 저장소');
    await waitFor(() => {
      expect(result.current.createError).toBe('저장소 생성에 실패했습니다.');
    });
    expect(isCreated).toBe(false);
  });

  it('공백 이름이면 저장소 생성 API를 호출하지 않아야 한다', async () => {
    const fetchMock = vi.fn<typeof fetch>();
    vi.stubGlobal('fetch', fetchMock);
    const { result } = renderUseCreateRepository();

    act(() => {
      result.current.setRepositoryName('   ');
    });
    let isCreated = true;

    await act(async () => {
      isCreated = await result.current.submitCreateRepository();
    });

    expect(fetchMock).not.toHaveBeenCalled();
    expect(isCreated).toBe(false);
  });
});
