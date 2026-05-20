import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import type { RepositorySummary } from '@/entities/repository';
import { RepositoryListPage } from './repository-list-page';

const useRepositoryListQueryMock = vi.fn<
  () => {
    readonly data?: readonly RepositorySummary[];
    readonly isLoading: boolean;
  }
>();

vi.mock('@/entities/repository', () => ({
  useRepositoryListQuery: () => useRepositoryListQueryMock(),
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
});
