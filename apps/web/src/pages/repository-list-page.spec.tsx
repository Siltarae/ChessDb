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

vi.mock('@/widgets/repository-list', () => ({
  RepositoryList: ({
    repositories,
    isLoading,
  }: {
    readonly repositories: readonly RepositorySummary[];
    readonly isLoading: boolean;
  }) => (
    <section aria-label="저장소 목록 위젯">
      <div>{isLoading ? 'loading' : 'loaded'}</div>
      <div>{repositories.map((repository) => repository.name).join(', ')}</div>
    </section>
  ),
}));

describe('RepositoryListPage', () => {
  afterEach(() => {
    cleanup();
    useRepositoryListQueryMock.mockReset();
    invalidateQueriesMock.mockReset();
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
});
