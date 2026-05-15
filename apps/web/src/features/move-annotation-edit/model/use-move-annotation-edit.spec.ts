import {
  MOVE_ANNOTATION,
  MOVE_KIND,
  SQUARE,
  createInitialGameState,
  executeMove,
  type GameState,
  type Move,
} from '@chess-db/shared';
import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

import { selectMoveAnnotationByHalfMoveIndex, useDraftStore } from '@/entities/draft';
import { useMoveHistoryStore } from '@/entities/move-history';
import { useMoveAnnotationEdit } from './use-move-annotation-edit';

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

describe('useMoveAnnotationEdit', () => {
  beforeEach(() => {
    useMoveHistoryStore.getState().clearMoveHistory();
    useDraftStore.getState().clearDraftComments();
    useDraftStore.getState().clearDraftAnnotations();
  });

  it('선택된 반수가 없으면 빈 평가 기호와 disabled 상태를 반환해야 한다', () => {
    const { result } = renderHook(() => useMoveAnnotationEdit());

    expect(result.current.selectedHalfMoveIndex).toBeNull();
    expect(result.current.selectedAnnotation).toBeNull();
    expect(result.current.isDisabled).toBe(true);
  });

  it('선택된 반수가 있으면 그 반수의 평가 기호를 갱신해야 한다', () => {
    const beforeState = createInitialGameState();
    appendMove(beforeState, createMove(SQUARE.E2, SQUARE.E4, MOVE_KIND.DOUBLE_PAWN_PUSH), 'e4');
    const { result } = renderHook(() => useMoveAnnotationEdit());

    act(() => {
      result.current.updateAnnotation(MOVE_ANNOTATION.GOOD);
    });

    expect(result.current.selectedHalfMoveIndex).toBe(0);
    expect(result.current.selectedAnnotation).toBe(MOVE_ANNOTATION.GOOD);
    expect(result.current.isDisabled).toBe(false);
    expect(selectMoveAnnotationByHalfMoveIndex(0)(useDraftStore.getState())).toEqual({
      halfMoveIndex: 0,
      annotation: MOVE_ANNOTATION.GOOD,
    });
  });

  it('선택 반수가 바뀌면 해당 반수의 평가 기호를 반환해야 한다', () => {
    let state = createInitialGameState();
    state = appendMove(state, createMove(SQUARE.E2, SQUARE.E4, MOVE_KIND.DOUBLE_PAWN_PUSH), 'e4');
    appendMove(state, createMove(SQUARE.E7, SQUARE.E5, MOVE_KIND.DOUBLE_PAWN_PUSH), 'e5');
    useDraftStore.getState().updateMoveAnnotation(0, MOVE_ANNOTATION.GOOD);
    useDraftStore.getState().updateMoveAnnotation(1, MOVE_ANNOTATION.MISTAKE);
    const { result } = renderHook(() => useMoveAnnotationEdit());

    expect(result.current.selectedHalfMoveIndex).toBe(1);
    expect(result.current.selectedAnnotation).toBe(MOVE_ANNOTATION.MISTAKE);

    act(() => {
      useMoveHistoryStore.getState().selectHalfMove(0);
    });

    expect(result.current.selectedHalfMoveIndex).toBe(0);
    expect(result.current.selectedAnnotation).toBe(MOVE_ANNOTATION.GOOD);
  });

  it('clearAnnotation은 선택 반수의 평가 기호를 null로 비워야 한다', () => {
    const beforeState = createInitialGameState();
    appendMove(beforeState, createMove(SQUARE.E2, SQUARE.E4, MOVE_KIND.DOUBLE_PAWN_PUSH), 'e4');
    const { result } = renderHook(() => useMoveAnnotationEdit());

    act(() => {
      result.current.updateAnnotation(MOVE_ANNOTATION.GOOD);
      result.current.clearAnnotation();
    });

    expect(result.current.selectedAnnotation).toBeNull();
    expect(selectMoveAnnotationByHalfMoveIndex(0)(useDraftStore.getState())).toEqual({
      halfMoveIndex: 0,
      annotation: null,
    });
  });
});
