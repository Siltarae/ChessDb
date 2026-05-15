import {
  MOVE_ANNOTATION,
  MOVE_KIND,
  SQUARE,
  createInitialGameState,
  executeMove,
  type GameState,
  type Move,
} from '@chess-db/shared';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { selectMoveAnnotationByHalfMoveIndex, useDraftStore } from '@/entities/draft';
import { useMoveHistoryStore } from '@/entities/move-history';
import { MoveAnnotationPicker } from './move-annotation-picker';

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

describe('MoveAnnotationPicker', () => {
  beforeEach(() => {
    useMoveHistoryStore.getState().clearMoveHistory();
    useDraftStore.getState().clearDraftComments();
    useDraftStore.getState().clearDraftAnnotations();
  });

  afterEach(() => {
    cleanup();
  });

  it('선택된 반수가 없으면 평가 기호 버튼을 비활성화해야 한다', () => {
    render(<MoveAnnotationPicker />);

    expect(screen.getByRole('button', { name: '좋은 수' })).toBeDisabled();
    expect(screen.getByRole('button', { name: '제거' })).toBeDisabled();
  });

  it('평가 기호 버튼 입력을 선택 반수의 평가 기호로 저장해야 한다', () => {
    const beforeState = createInitialGameState();
    appendMove(beforeState, createMove(SQUARE.E2, SQUARE.E4, MOVE_KIND.DOUBLE_PAWN_PUSH), 'e4');
    render(<MoveAnnotationPicker />);

    fireEvent.click(screen.getByRole('button', { name: '흥미로운 수' }));

    expect(selectMoveAnnotationByHalfMoveIndex(0)(useDraftStore.getState())).toEqual({
      halfMoveIndex: 0,
      annotation: MOVE_ANNOTATION.INTERESTING,
    });
    expect(screen.getByRole('button', { name: '흥미로운 수' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  it('제거 버튼은 현재 반수의 평가 기호를 null로 저장해야 한다', () => {
    const beforeState = createInitialGameState();
    appendMove(beforeState, createMove(SQUARE.E2, SQUARE.E4, MOVE_KIND.DOUBLE_PAWN_PUSH), 'e4');
    useDraftStore.getState().updateMoveAnnotation(0, MOVE_ANNOTATION.GOOD);
    render(<MoveAnnotationPicker />);

    fireEvent.click(screen.getByRole('button', { name: '제거' }));

    expect(selectMoveAnnotationByHalfMoveIndex(0)(useDraftStore.getState())).toEqual({
      halfMoveIndex: 0,
      annotation: null,
    });
  });
});
