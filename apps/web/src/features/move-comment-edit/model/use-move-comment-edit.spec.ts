import {
  MOVE_KIND,
  SQUARE,
  createInitialGameState,
  executeMove,
  type GameState,
  type Move,
} from '@chess-db/shared';
import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

import { selectMoveCommentByHalfMoveIndex, useDraftStore } from '@/entities/draft';
import { useMoveHistoryStore } from '@/entities/move-history';
import { useMoveCommentEdit } from './use-move-comment-edit';

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

  return afterState;
};

describe('useMoveCommentEdit', () => {
  beforeEach(() => {
    useMoveHistoryStore.getState().clearMoveHistory();
    useDraftStore.getState().clearDraftComments();
  });

  it('선택된 반수가 없으면 빈 코멘트와 disabled 상태를 반환해야 한다', () => {
    const { result } = renderHook(() => useMoveCommentEdit());

    expect(result.current.selectedHalfMoveIndex).toBeNull();
    expect(result.current.currentComment).toBe('');
    expect(result.current.isDisabled).toBe(true);
  });

  it('선택된 반수가 있으면 그 반수의 코멘트를 갱신해야 한다', () => {
    const beforeState = createInitialGameState();
    appendMove(beforeState, createMove(SQUARE.E2, SQUARE.E4, MOVE_KIND.DOUBLE_PAWN_PUSH), 'e4');
    const { result } = renderHook(() => useMoveCommentEdit());

    act(() => {
      result.current.updateComment('중앙 폰 전진');
    });

    expect(result.current.selectedHalfMoveIndex).toBe(0);
    expect(result.current.currentComment).toBe('중앙 폰 전진');
    expect(result.current.isDisabled).toBe(false);
    expect(selectMoveCommentByHalfMoveIndex(0)(useDraftStore.getState())).toEqual({
      halfMoveIndex: 0,
      comment: '중앙 폰 전진',
    });
  });

  it('선택 반수가 바뀌면 해당 반수의 코멘트를 반환해야 한다', () => {
    let state = createInitialGameState();
    state = appendMove(state, createMove(SQUARE.E2, SQUARE.E4, MOVE_KIND.DOUBLE_PAWN_PUSH), 'e4');
    appendMove(state, createMove(SQUARE.E7, SQUARE.E5, MOVE_KIND.DOUBLE_PAWN_PUSH), 'e5');
    useDraftStore.getState().updateMoveComment(0, '백의 첫 수');
    useDraftStore.getState().updateMoveComment(1, '흑의 응수');
    const { result } = renderHook(() => useMoveCommentEdit());

    expect(result.current.selectedHalfMoveIndex).toBe(1);
    expect(result.current.currentComment).toBe('흑의 응수');

    act(() => {
      useMoveHistoryStore.getState().selectHalfMove(0);
    });

    expect(result.current.selectedHalfMoveIndex).toBe(0);
    expect(result.current.currentComment).toBe('백의 첫 수');
  });

  it('선택된 반수가 없으면 updateComment가 초안 상태를 바꾸지 않아야 한다', () => {
    const { result } = renderHook(() => useMoveCommentEdit());

    act(() => {
      result.current.updateComment('저장되지 않아야 하는 코멘트');
    });

    expect(useDraftStore.getState().moveComments).toEqual([]);
  });
});
