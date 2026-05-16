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

import { useDraftStore } from '@/entities/draft';
import { useGameStore } from '@/entities/game';
import { useMoveHistoryStore } from '@/entities/move-history';
import { CHESS_DB_DRAFT_KEY } from '@/shared/lib/storage/draft-storage';
import { useDraftAutosave } from './use-draft-autosave';

const SAVED_AT_FIXTURE = '2026-05-16T00:00:00.000Z';

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

const getStoredDraft = () => {
  const serializedDraft = localStorage.getItem(CHESS_DB_DRAFT_KEY);

  if (serializedDraft === null) {
    throw new Error('저장된 초안이 없습니다.');
  }

  return JSON.parse(serializedDraft) as Record<string, unknown>;
};

describe('useDraftAutosave', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(SAVED_AT_FIXTURE));
    localStorage.clear();
    useGameStore.setState({
      gameState: createInitialGameState(),
      repetitionHistory: {},
    });
    useMoveHistoryStore.getState().clearMoveHistory();
    useDraftStore.getState().clearDraftComments();
    useDraftStore.getState().clearDraftAnnotations();
    useDraftStore.getState().clearGameMetadata();
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  describe('초안 상태가 바뀔 때', () => {
    it('수순과 현재 보드 상태를 localStorage에 저장해야 한다', () => {
      const { result } = renderHook(() => useDraftAutosave());

      act(() => {
        appendMove(
          createInitialGameState(),
          createMove(SQUARE.E2, SQUARE.E4, MOVE_KIND.DOUBLE_PAWN_PUSH),
          'e4',
        );
      });

      const storedDraft = getStoredDraft();

      expect(storedDraft.savedAt).toBe(SAVED_AT_FIXTURE);
      expect(storedDraft.gameState).toEqual(useGameStore.getState().gameState);
      expect(storedDraft.historyItems).toEqual(useMoveHistoryStore.getState().historyItems);
      expect(result.current.lastSavedAt).toBe(SAVED_AT_FIXTURE);
      expect(result.current.isSaveNoticeVisible).toBe(true);
    });

    it('코멘트와 평가 기호를 저장 대상에 포함해야 한다', () => {
      renderHook(() => useDraftAutosave());

      act(() => {
        useDraftStore.getState().updateMoveComment(0, '중앙 장악');
        useDraftStore.getState().updateMoveAnnotation(0, MOVE_ANNOTATION.GOOD);
      });

      const storedDraft = getStoredDraft();

      expect(storedDraft.moveComments).toEqual([{ halfMoveIndex: 0, comment: '중앙 장악' }]);
      expect(storedDraft.moveAnnotations).toEqual([
        { halfMoveIndex: 0, annotation: MOVE_ANNOTATION.GOOD },
      ]);
    });

    it('기보 메타데이터를 저장 대상에 포함해야 한다', () => {
      renderHook(() => useDraftAutosave());

      act(() => {
        useDraftStore.getState().updateGameMetadata({
          result: GAME_RECORD_RESULT.WHITE_WIN,
          terminationReason: GAME_TERMINATION_REASON.CHECKMATE,
          playedAt: '2026-05-16',
        });
      });

      const storedDraft = getStoredDraft();

      expect(storedDraft.metadata).toEqual({
        result: GAME_RECORD_RESULT.WHITE_WIN,
        terminationReason: GAME_TERMINATION_REASON.CHECKMATE,
        playedAt: '2026-05-16',
      });
    });

    it('저장 대상 밖의 UI 상태와 보조 상태를 포함하지 않아야 한다', () => {
      renderHook(() => useDraftAutosave());

      act(() => {
        appendMove(
          createInitialGameState(),
          createMove(SQUARE.E2, SQUARE.E4, MOVE_KIND.DOUBLE_PAWN_PUSH),
          'e4',
        );
        useMoveHistoryStore.getState().selectHalfMove(0);
      });

      const serializedDraft = localStorage.getItem(CHESS_DB_DRAFT_KEY);

      expect(serializedDraft).not.toBeNull();
      expect(serializedDraft).not.toContain('selectedHalfMoveIndex');
      expect(serializedDraft).not.toContain('repetitionHistory');
      expect(serializedDraft).not.toContain('boardOrientation');
      expect(serializedDraft).not.toContain('activeTab');
    });
  });

  describe('동일한 상태로 다시 렌더링될 때', () => {
    it('localStorage 저장을 반복하지 않아야 한다', () => {
      const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');
      const { rerender } = renderHook(() => useDraftAutosave());

      act(() => {
        useDraftStore.getState().updateMoveComment(0, '한 번만 저장');
      });
      expect(setItemSpy).toHaveBeenCalledTimes(1);

      rerender();

      expect(setItemSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('초안 저장 알림을 표시할 때', () => {
    it('저장 직후 표시하고 2초 뒤 숨겨야 한다', () => {
      const { result } = renderHook(() => useDraftAutosave());

      act(() => {
        useDraftStore.getState().updateMoveComment(0, '저장 알림');
      });

      expect(result.current.isSaveNoticeVisible).toBe(true);

      act(() => {
        vi.advanceTimersByTime(2000);
      });

      expect(result.current.isSaveNoticeVisible).toBe(false);
    });
  });
});
