import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { COLOR, MOVE_KIND, SQUARE, createInitialGameState } from '@chess-db/shared';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router';

import { selectResetDraft, selectUpdateMoveComment, useDraftStore } from '@/entities/draft';
import { selectResetGameState, useGameStore } from '@/entities/game';
import { useMoveHistoryStore } from '@/entities/move-history';
import type { RepositorySummary } from '@/entities/repository';
import { RepositoryHomePage } from './repository-home-page';

const useRepositoryListQueryMock = vi.hoisted(() => vi.fn());

vi.mock('@/entities/repository', () => ({
  useRepositoryListQuery: () => useRepositoryListQueryMock(),
}));

const repositories: RepositorySummary[] = [
  {
    id: 'repository-1',
    name: '오프닝 저장소',
    createdAt: '2026-05-20T00:00:00.000Z',
  },
];

describe('RepositoryHomePage', () => {
  beforeEach(() => {
    useRepositoryListQueryMock.mockReturnValue({
      data: repositories,
      isLoading: false,
    });
  });

  afterEach(() => {
    cleanup();
    useRepositoryListQueryMock.mockReset();
    selectResetDraft(useDraftStore.getState())();
    selectResetGameState(useGameStore.getState())();
    useMoveHistoryStore.getState().clearMoveHistory();
  });

  it('저장소 기본 보드뷰를 렌더링한다', () => {
    renderRepositoryHomePage();

    expect(screen.getByRole('heading', { name: '저장소 보드' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: '기보 입력 보드 영역' })).toBeInTheDocument();
    expect(
      screen.getByRole('complementary', { name: '기보 입력 사이드 패널' }),
    ).toBeInTheDocument();
    expect(screen.getByText('repository-1')).toBeInTheDocument();
  });

  it('기존 기보 업데이트 저장 버튼 위치를 비활성 상태로 고정한다', () => {
    renderRepositoryHomePage();

    expect(screen.getByRole('button', { name: '기보 저장' })).toBeDisabled();
  });

  it('새 기보 작성 버튼 클릭 시 저장소 새 기보 입력 뷰로 이동한다', async () => {
    const user = userEvent.setup();

    renderRepositoryHomePage();

    await user.click(screen.getByRole('button', { name: '새 기보 작성' }));

    expect(screen.getByText('새 기보 입력')).toBeInTheDocument();
  });

  it('FEATURE-006 통계 분석 화면으로 렌더링하지 않는다', () => {
    renderRepositoryHomePage();

    expect(screen.queryByText('다음 수 후보')).not.toBeInTheDocument();
    expect(screen.queryByText('승률')).not.toBeInTheDocument();
  });

  it('목록에 없는 저장소 URL로 직접 접근하면 저장소 목록으로 이동한다', () => {
    renderRepositoryHomePage('/repositories/deleted-repository');

    expect(screen.getByText('저장소 목록 화면')).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: '저장소 보드' })).not.toBeInTheDocument();
  });

  it('기존 초안이 있으면 새 기보 작성 전에 초안 초기화 확인을 표시한다', async () => {
    const user = userEvent.setup();
    selectUpdateMoveComment(useDraftStore.getState())(0, '작성 중인 초안');

    renderRepositoryHomePage();

    await user.click(screen.getByRole('button', { name: '새 기보 작성' }));

    expect(screen.getByRole('alertdialog', { name: '초안 초기화' })).toBeInTheDocument();
    expect(screen.queryByText('새 기보 입력')).not.toBeInTheDocument();
  });

  it('저장소 홈 진입 시 이전 입력 보드 상태는 초기화하지만 초안 교체 확인은 유지한다', async () => {
    const user = userEvent.setup();
    useMoveHistoryStore.getState().appendMoveHistory({
      beforeState: createInitialGameState(),
      afterState: {
        ...createInitialGameState(),
        turn: COLOR.BLACK,
      },
      san: 'e4',
      move: {
        from: SQUARE.E2,
        to: SQUARE.E4,
        kind: MOVE_KIND.DOUBLE_PAWN_PUSH,
      },
    });

    renderRepositoryHomePage();

    expect(screen.getByText('아직 기록된 수가 없습니다.')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '새 기보 작성' }));

    expect(screen.getByRole('alertdialog', { name: '초안 초기화' })).toBeInTheDocument();
  });
});

const renderRepositoryHomePage = (initialEntry = '/repositories/repository-1') => {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route path="/repositories" element={<div>저장소 목록 화면</div>} />
        <Route path="/repositories/:repositoryId" element={<RepositoryHomePage />} />
        <Route path="/repositories/:repositoryId/new" element={<div>새 기보 입력</div>} />
      </Routes>
    </MemoryRouter>,
  );
};
