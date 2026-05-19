import {
  GAME_RECORD_RESULT,
  GAME_TERMINATION_REASON,
  MOVE_ANNOTATION,
  MOVE_KIND,
  SQUARE,
  createInitialGameState,
  executeMove,
  type GameState,
  type Move,
} from '@chess-db/shared';
import { act, cleanup, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { selectGameMetadata, useDraftStore } from '@/entities/draft';
import { selectGameState, useGameStore } from '@/entities/game';
import { useMoveHistoryStore } from '@/entities/move-history';
import { CHESS_DB_DRAFT_KEY, saveDraft, serializeDraft } from '@/shared/lib/storage/draft-storage';
import { useResetDraft } from './use-reset-draft';

const SAVED_AT_FIXTURE = '2026-05-18T00:00:00.000Z';

const createMove = (
  from: Move['from'],
  to: Move['to'],
  kind: typeof MOVE_KIND.NORMAL | typeof MOVE_KIND.DOUBLE_PAWN_PUSH = MOVE_KIND.NORMAL,
): Move => ({
  from,
  to,
  kind,
});

const appendMove = (beforeState: GameState, move: Move, san: string) => {
  const afterState = executeMove(beforeState, move);

  useMoveHistoryStore.getState().appendMoveHistory({
    beforeState,
    move,
    afterState,
    san,
  });
  useGameStore.getState().applyGameState(afterState);

  return afterState;
};

const seedDraft = () => {
  const beforeState = createInitialGameState();
  const move = createMove(SQUARE.E2, SQUARE.E4, MOVE_KIND.DOUBLE_PAWN_PUSH);
  const afterState = appendMove(beforeState, move, 'e4');

  useDraftStore.getState().updateMoveComment(0, '중앙 장악');
  useDraftStore.getState().updateMoveAnnotation(0, MOVE_ANNOTATION.GOOD);
  useDraftStore.getState().updateGameMetadata({
    result: GAME_RECORD_RESULT.WHITE_WIN,
    terminationReason: GAME_TERMINATION_REASON.CHECKMATE,
    playedAt: '2026-05-17',
  });
  saveDraft(
    serializeDraft({
      gameState: afterState,
      historyItems: useMoveHistoryStore.getState().historyItems,
      moveComments: useDraftStore.getState().moveComments,
      moveAnnotations: useDraftStore.getState().moveAnnotations,
      metadata: useDraftStore.getState().metadata,
      savedAt: SAVED_AT_FIXTURE,
    }),
  );
};

const resetStores = () => {
  useGameStore.getState().resetGameState();
  useMoveHistoryStore.getState().clearMoveHistory();
  useDraftStore.getState().resetDraft();
};

describe('useResetDraft', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(SAVED_AT_FIXTURE));
    localStorage.clear();
    resetStores();
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('초기화 요청은 확인 다이얼로그 상태만 열어야 한다', () => {
    seedDraft();
    const { result } = renderHook(() => useResetDraft());

    act(() => {
      result.current.requestDraftReset();
    });

    expect(result.current.isResetDialogOpen).toBe(true);
    expect(localStorage.getItem(CHESS_DB_DRAFT_KEY)).not.toBeNull();
    expect(useMoveHistoryStore.getState().historyItems).toHaveLength(1);
  });

  it('초기화 취소는 메모리 store와 저장된 초안을 유지해야 한다', () => {
    seedDraft();
    const { result } = renderHook(() => useResetDraft());

    act(() => {
      result.current.requestDraftReset();
      result.current.cancelDraftReset();
    });

    expect(result.current.isResetDialogOpen).toBe(false);
    expect(localStorage.getItem(CHESS_DB_DRAFT_KEY)).not.toBeNull();
    expect(selectGameState(useGameStore.getState())).not.toEqual(createInitialGameState());
    expect(useMoveHistoryStore.getState().historyItems).toHaveLength(1);
    expect(useDraftStore.getState().moveComments).toEqual([
      { halfMoveIndex: 0, comment: '중앙 장악' },
    ]);
  });

  it('초기화 확인은 store를 새 draft 기준으로 되돌리고 저장된 초안을 삭제해야 한다', () => {
    seedDraft();
    const { result } = renderHook(() => useResetDraft());

    act(() => {
      result.current.requestDraftReset();
      result.current.confirmDraftReset();
    });

    expect(result.current.isResetDialogOpen).toBe(false);
    expect(selectGameState(useGameStore.getState())).toEqual(createInitialGameState());
    expect(useMoveHistoryStore.getState().historyItems).toEqual([]);
    expect(useMoveHistoryStore.getState().selectedHalfMoveIndex).toBeNull();
    expect(useDraftStore.getState().moveComments).toEqual([]);
    expect(useDraftStore.getState().moveAnnotations).toEqual([]);
    expect(selectGameMetadata(useDraftStore.getState())).toEqual({
      result: null,
      terminationReason: null,
      playedAt: '2026-05-18',
      resultSource: null,
    });
    expect(localStorage.getItem(CHESS_DB_DRAFT_KEY)).toBeNull();
  });
});
