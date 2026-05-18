import { StrictMode } from 'react';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  GAME_RECORD_RESULT,
  GAME_TERMINATION_REASON,
  MOVE_ANNOTATION,
  MOVE_KIND,
  SQUARE,
  createInitialGameState,
  executeMove,
  type Move,
} from '@chess-db/shared';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useDraftStore } from '@/entities/draft';
import { useGameStore } from '@/entities/game';
import { useMoveHistoryStore, type MoveHistoryItem } from '@/entities/move-history';
import { CHESS_DB_DRAFT_KEY, serializeDraft } from '@/shared/lib/storage/draft-storage';
import { App } from './app';

const createMove = (
  from: Move['from'],
  to: Move['to'],
  kind: typeof MOVE_KIND.NORMAL | typeof MOVE_KIND.DOUBLE_PAWN_PUSH = MOVE_KIND.NORMAL,
): Move => ({
  from,
  to,
  kind,
});

const createDraftSnapshotFixture = () => {
  const beforeState = createInitialGameState();
  const move = createMove(SQUARE.E2, SQUARE.E4, MOVE_KIND.DOUBLE_PAWN_PUSH);
  const afterState = executeMove(beforeState, move);
  const historyItem = {
    halfMoveIndex: 0,
    moveNumber: 1,
    side: beforeState.turn,
    san: 'e4',
    move,
    beforeState,
    afterState,
  } satisfies MoveHistoryItem;

  return {
    gameState: afterState,
    historyItems: [historyItem],
    moveComments: [{ halfMoveIndex: 0, comment: '중앙을 잡는다' }],
    moveAnnotations: [{ halfMoveIndex: 0, annotation: MOVE_ANNOTATION.GOOD }],
    metadata: {
      result: GAME_RECORD_RESULT.WHITE_WIN,
      terminationReason: GAME_TERMINATION_REASON.CHECKMATE,
      playedAt: '2026-05-16',
    },
    savedAt: '2026-05-16T00:00:00.000Z',
  };
};

const resetStores = () => {
  useGameStore.setState({
    gameState: createInitialGameState(),
    repetitionHistory: {},
  });
  useMoveHistoryStore.getState().clearMoveHistory();
  useDraftStore.getState().clearDraftComments();
  useDraftStore.getState().clearDraftAnnotations();
  useDraftStore.getState().clearGameMetadata();
};

describe('App', () => {
  beforeEach(() => {
    localStorage.clear();
    resetStores();
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    localStorage.clear();
    resetStores();
  });

  it('루트 라우트에서 기보 입력 화면을 렌더링해야 한다', () => {
    window.history.pushState({}, '', '/');

    render(<App />);

    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('region', { name: '기보 입력 보드 영역' })).toBeInTheDocument();
    expect(
      screen.getByRole('complementary', { name: '기보 입력 사이드 패널' }),
    ).toBeInTheDocument();
  });

  it('새로고침 복원 시 저장 토스트를 먼저 표시하지 않아야 한다', async () => {
    window.history.pushState({}, '', '/');
    const draftSnapshot = createDraftSnapshotFixture();
    localStorage.setItem(CHESS_DB_DRAFT_KEY, serializeDraft(draftSnapshot));

    render(
      <StrictMode>
        <App />
      </StrictMode>,
    );

    expect(await screen.findByText('초안 복원됨')).toBeInTheDocument();
    expect(screen.queryByText('초안 저장됨')).not.toBeInTheDocument();
    expect(useGameStore.getState().gameState).toEqual(draftSnapshot.gameState);
    expect(useMoveHistoryStore.getState().historyItems).toEqual(draftSnapshot.historyItems);
    expect(useDraftStore.getState().moveComments).toEqual(draftSnapshot.moveComments);
    expect(useDraftStore.getState().moveAnnotations).toEqual(draftSnapshot.moveAnnotations);
    expect(useDraftStore.getState().metadata).toEqual(draftSnapshot.metadata);
  });

  it('새로고침 복원 토스트는 StrictMode에서도 2초 뒤 사라져야 한다', async () => {
    window.history.pushState({}, '', '/');
    localStorage.setItem(CHESS_DB_DRAFT_KEY, serializeDraft(createDraftSnapshotFixture()));

    render(
      <StrictMode>
        <App />
      </StrictMode>,
    );

    expect(await screen.findByText('초안 복원됨')).toBeInTheDocument();

    await waitFor(
      () => {
        expect(screen.queryByText('초안 복원됨')).not.toBeInTheDocument();
      },
      { timeout: 2500 },
    );
  });

  it('복원된 초안 초기화를 취소하면 기존 상태와 storage를 유지해야 한다', async () => {
    const user = userEvent.setup();
    window.history.pushState({}, '', '/');
    const draftSnapshot = createDraftSnapshotFixture();
    localStorage.setItem(CHESS_DB_DRAFT_KEY, serializeDraft(draftSnapshot));

    render(<App />);

    await waitFor(() => {
      expect(useGameStore.getState().gameState).toEqual(draftSnapshot.gameState);
    });

    await user.click(screen.getByRole('button', { name: '초기화' }));
    await user.click(screen.getByRole('button', { name: '취소' }));

    expect(screen.queryByRole('alertdialog', { name: '초안 초기화' })).not.toBeInTheDocument();
    expect(useGameStore.getState().gameState).toEqual(draftSnapshot.gameState);
    expect(useMoveHistoryStore.getState().historyItems).toEqual(draftSnapshot.historyItems);
    expect(useDraftStore.getState().moveComments).toEqual(draftSnapshot.moveComments);
    expect(useDraftStore.getState().moveAnnotations).toEqual(draftSnapshot.moveAnnotations);
    expect(useDraftStore.getState().metadata).toEqual(draftSnapshot.metadata);
    expect(localStorage.getItem(CHESS_DB_DRAFT_KEY)).toBe(serializeDraft(draftSnapshot));
  });

  it('복원된 초안 초기화를 확인하면 메모리 상태와 storage를 초기화해야 한다', async () => {
    const user = userEvent.setup();
    window.history.pushState({}, '', '/');
    const draftSnapshot = createDraftSnapshotFixture();
    localStorage.setItem(CHESS_DB_DRAFT_KEY, serializeDraft(draftSnapshot));

    render(<App />);

    await waitFor(() => {
      expect(useGameStore.getState().gameState).toEqual(draftSnapshot.gameState);
    });

    await user.click(screen.getByRole('button', { name: '초기화' }));
    await user.click(screen.getByRole('button', { name: '초기화' }));

    expect(useGameStore.getState().gameState).toEqual(createInitialGameState());
    expect(useMoveHistoryStore.getState().historyItems).toEqual([]);
    expect(useMoveHistoryStore.getState().selectedHalfMoveIndex).toBeNull();
    expect(useDraftStore.getState().moveComments).toEqual([]);
    expect(useDraftStore.getState().moveAnnotations).toEqual([]);
    expect(useDraftStore.getState().metadata).toEqual({
      result: null,
      terminationReason: null,
      playedAt: expect.any(String),
    });
    expect(localStorage.getItem(CHESS_DB_DRAFT_KEY)).toBeNull();
    expect(screen.queryByText('초안 저장됨')).not.toBeInTheDocument();
  });
});
