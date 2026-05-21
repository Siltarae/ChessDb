import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { CreateRepositoryDialog } from './create-repository-dialog';

const renderCreateRepositoryDialog = ({
  isOpen = true,
  onCreated = vi.fn(),
  onOpenChange = vi.fn(),
}: {
  readonly isOpen?: boolean;
  readonly onCreated?: () => void;
  readonly onOpenChange?: (open: boolean) => void;
} = {}) => {
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

  return {
    ...render(
      <CreateRepositoryDialog isOpen={isOpen} onOpenChange={onOpenChange} onCreated={onCreated} />,
      { wrapper },
    ),
    onCreated,
    onOpenChange,
  };
};

describe('CreateRepositoryDialog shell', () => {
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it('열려 있으면 저장소 생성 shell을 표시해야 한다', () => {
    renderCreateRepositoryDialog();

    expect(screen.getByRole('dialog', { name: '새 저장소' })).toBeInTheDocument();
    expect(screen.getByLabelText('저장소 이름')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '생성' })).toBeDisabled();
    expect(screen.getByRole('button', { name: '취소' })).toBeInTheDocument();
  });

  it('닫혀 있으면 저장소 생성 shell을 표시하지 않아야 한다', () => {
    renderCreateRepositoryDialog({ isOpen: false });

    expect(screen.queryByRole('dialog', { name: '새 저장소' })).not.toBeInTheDocument();
  });

  it('취소 시 다이얼로그가 닫힌다', async () => {
    const user = userEvent.setup();
    const { onOpenChange } = renderCreateRepositoryDialog();

    await user.click(screen.getByRole('button', { name: '취소' }));

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('공백만 입력하면 에러를 보여주고 생성 버튼을 비활성화한다', async () => {
    const user = userEvent.setup();

    renderCreateRepositoryDialog();

    await user.type(screen.getByLabelText('저장소 이름'), '   ');

    expect(screen.getByText('저장소 이름을 입력하세요.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '생성' })).toBeDisabled();
  });

  it('유효한 이름을 입력하면 에러를 숨기고 생성 버튼을 활성화한다', async () => {
    const user = userEvent.setup();

    renderCreateRepositoryDialog();

    await user.type(screen.getByLabelText('저장소 이름'), '오프닝 저장소');

    expect(screen.queryByText('저장소 이름을 입력하세요.')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: '생성' })).toBeEnabled();
  });

  it('생성 성공 시 onCreated를 실행하고 다이얼로그를 닫는다', async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn<typeof fetch>();
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
    const { onCreated, onOpenChange } = renderCreateRepositoryDialog();

    await user.type(screen.getByLabelText('저장소 이름'), '오프닝 저장소');
    await user.click(screen.getByRole('button', { name: '생성' }));

    expect(fetchMock).toHaveBeenCalledOnce();
    expect(onCreated).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('생성 실패 시 에러를 보여주고 다이얼로그를 닫지 않는다', async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn<typeof fetch>();
    fetchMock.mockResolvedValueOnce(new Response('생성 실패', { status: 500 }));
    vi.stubGlobal('fetch', fetchMock);
    const { onCreated, onOpenChange } = renderCreateRepositoryDialog();

    await user.type(screen.getByLabelText('저장소 이름'), '오프닝 저장소');
    await user.click(screen.getByRole('button', { name: '생성' }));

    expect(fetchMock).toHaveBeenCalledOnce();
    expect(onCreated).not.toHaveBeenCalled();
    expect(onOpenChange).not.toHaveBeenCalledWith(false);
    expect(screen.getByText('저장소 생성에 실패했습니다.')).toBeInTheDocument();
    expect(screen.getByLabelText('저장소 이름')).toHaveValue('오프닝 저장소');
  });
});
