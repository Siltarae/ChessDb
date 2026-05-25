import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import type { RepositorySummary } from '@/entities/repository';
import { RepositoryListPage } from './repository-list-page';

const useRepositoryListQueryMock = vi.fn<
  () => {
    readonly data?: readonly RepositorySummary[];
    readonly isLoading: boolean;
  }
>();
const invalidateQueriesMock = vi.fn();
const requestDeleteRepositoryMock = vi.fn<(repositoryId: string) => Promise<boolean>>();
let deleteRepositoryState: {
  readonly isDeleting: boolean;
  readonly deleteError: string | null;
} = {
  isDeleting: false,
  deleteError: null,
};

vi.mock('@tanstack/react-query', () => ({
  useQueryClient: () => ({
    invalidateQueries: invalidateQueriesMock,
  }),
}));

vi.mock('@/entities/repository', () => ({
  repositoryListQueryKey: ['repositories'],
  useRepositoryListQuery: () => useRepositoryListQueryMock(),
}));

vi.mock('@/features/repository-create', () => ({
  CreateRepositoryDialog: ({
    isOpen,
    onOpenChange,
  }: {
    readonly isOpen: boolean;
    readonly onOpenChange: (open: boolean) => void;
    readonly onCreated: () => void;
  }) =>
    isOpen ? (
      <section aria-label="저장소 생성 다이얼로그">
        <button type="button" onClick={() => onOpenChange(false)}>
          취소
        </button>
      </section>
    ) : null,
}));

vi.mock('@/features/repository-delete', () => ({
  DeleteRepositoryDialog: ({
    open,
    onOpenChange,
    onConfirmDelete,
    isDeleting,
  }: {
    readonly open: boolean;
    readonly onOpenChange: (open: boolean) => void;
    readonly onConfirmDelete: () => void | Promise<void>;
    readonly isDeleting?: boolean;
  }) =>
    open ? (
      <section aria-label="저장소 삭제 다이얼로그">
        <div>{isDeleting ? 'deleting' : 'idle'}</div>
        <button type="button" onClick={() => onOpenChange(false)}>
          삭제 취소
        </button>
        <button type="button" onClick={() => void onConfirmDelete()}>
          삭제 확인
        </button>
      </section>
    ) : null,
  useDeleteRepository: () => ({
    requestDeleteRepository: requestDeleteRepositoryMock,
    isDeleting: deleteRepositoryState.isDeleting,
    deleteError: deleteRepositoryState.deleteError,
  }),
}));

vi.mock('@/features/repository-select', () => ({
  useOpenRepository: () => vi.fn(),
}));

vi.mock('@/widgets/repository-list', () => ({
  RepositoryList: ({
    repositories,
    isLoading,
    onRepositoryDeleteRequest,
  }: {
    readonly repositories: readonly RepositorySummary[];
    readonly isLoading: boolean;
    readonly onRepositoryDeleteRequest?: (repository: RepositorySummary) => void;
  }) => (
    <section aria-label="저장소 목록 위젯">
      <div>{isLoading ? 'loading' : 'loaded'}</div>
      <div>{repositories.map((repository) => repository.name).join(', ')}</div>
      {repositories.map((repository) => (
        <button
          key={repository.id}
          type="button"
          onClick={() => onRepositoryDeleteRequest?.(repository)}
        >
          {repository.name} 삭제
        </button>
      ))}
    </section>
  ),
}));

describe('RepositoryListPage', () => {
  afterEach(() => {
    cleanup();
    useRepositoryListQueryMock.mockReset();
    invalidateQueriesMock.mockReset();
    requestDeleteRepositoryMock.mockReset();
    deleteRepositoryState = {
      isDeleting: false,
      deleteError: null,
    };
  });

  it('저장소 목록 조회 결과를 목록 위젯에 전달해야 한다', () => {
    useRepositoryListQueryMock.mockReturnValue({
      data: [
        {
          id: 'repository-1',
          name: '오프닝 저장소',
          createdAt: '2026-05-20T00:00:00.000Z',
        },
      ],
      isLoading: false,
    });

    render(<RepositoryListPage />);

    expect(screen.getByRole('heading', { name: '저장소 선택' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: '저장소 목록 위젯' })).toHaveTextContent(
      '오프닝 저장소',
    );
    expect(screen.getByRole('region', { name: '저장소 목록 위젯' })).toHaveTextContent('loaded');
  });

  it('조회 데이터가 없으면 빈 배열을 목록 위젯에 전달해야 한다', () => {
    useRepositoryListQueryMock.mockReturnValue({
      isLoading: true,
    });

    render(<RepositoryListPage />);

    expect(screen.getByRole('region', { name: '저장소 목록 위젯' })).toHaveTextContent('loading');
  });

  it('생성 버튼 클릭 시 저장소 생성 다이얼로그가 열린다', async () => {
    const user = userEvent.setup();
    useRepositoryListQueryMock.mockReturnValue({
      data: [],
      isLoading: false,
    });

    render(<RepositoryListPage />);

    expect(
      screen.queryByRole('region', { name: '저장소 생성 다이얼로그' }),
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '새 저장소' }));

    expect(screen.getByRole('region', { name: '저장소 생성 다이얼로그' })).toBeInTheDocument();
  });

  it('저장소 생성 다이얼로그에서 취소하면 다이얼로그가 닫힌다', async () => {
    const user = userEvent.setup();
    useRepositoryListQueryMock.mockReturnValue({
      data: [],
      isLoading: false,
    });

    render(<RepositoryListPage />);

    await user.click(screen.getByRole('button', { name: '새 저장소' }));
    await user.click(screen.getByRole('button', { name: '취소' }));

    expect(
      screen.queryByRole('region', { name: '저장소 생성 다이얼로그' }),
    ).not.toBeInTheDocument();
  });

  it('목록에서 삭제를 요청하면 저장소 삭제 다이얼로그가 열린다', async () => {
    const user = userEvent.setup();
    useRepositoryListQueryMock.mockReturnValue({
      data: [
        {
          id: 'repository-1',
          name: '오프닝 저장소',
          createdAt: '2026-05-20T00:00:00.000Z',
        },
      ],
      isLoading: false,
    });

    render(<RepositoryListPage />);

    await user.click(screen.getByRole('button', { name: '오프닝 저장소 삭제' }));

    expect(screen.getByRole('region', { name: '저장소 삭제 다이얼로그' })).toBeInTheDocument();
  });

  it('삭제 확인 시 선택된 저장소 id로 삭제를 요청하고 성공하면 다이얼로그를 닫는다', async () => {
    const user = userEvent.setup();
    requestDeleteRepositoryMock.mockResolvedValueOnce(true);
    useRepositoryListQueryMock.mockReturnValue({
      data: [
        {
          id: 'repository-1',
          name: '오프닝 저장소',
          createdAt: '2026-05-20T00:00:00.000Z',
        },
      ],
      isLoading: false,
    });

    render(<RepositoryListPage />);

    await user.click(screen.getByRole('button', { name: '오프닝 저장소 삭제' }));
    await user.click(screen.getByRole('button', { name: '삭제 확인' }));

    expect(requestDeleteRepositoryMock).toHaveBeenCalledWith('repository-1');
    expect(
      screen.queryByRole('region', { name: '저장소 삭제 다이얼로그' }),
    ).not.toBeInTheDocument();
  });

  it('삭제 실패 상태이면 에러를 표시하고 열린 다이얼로그를 유지한다', async () => {
    const user = userEvent.setup();
    requestDeleteRepositoryMock.mockResolvedValueOnce(false);
    deleteRepositoryState = {
      isDeleting: false,
      deleteError: '저장소 삭제에 실패했습니다.',
    };
    useRepositoryListQueryMock.mockReturnValue({
      data: [
        {
          id: 'repository-1',
          name: '오프닝 저장소',
          createdAt: '2026-05-20T00:00:00.000Z',
        },
      ],
      isLoading: false,
    });

    render(<RepositoryListPage />);

    await user.click(screen.getByRole('button', { name: '오프닝 저장소 삭제' }));
    await user.click(screen.getByRole('button', { name: '삭제 확인' }));

    expect(screen.getByRole('alert')).toHaveTextContent('저장소 삭제에 실패했습니다.');
    expect(screen.getByRole('region', { name: '저장소 삭제 다이얼로그' })).toBeInTheDocument();
  });
});
