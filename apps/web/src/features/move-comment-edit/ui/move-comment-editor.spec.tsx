import {
  MOVE_KIND,
  SQUARE,
  createInitialGameState,
  executeMove,
  type GameState,
  type Move,
} from '@chess-db/shared';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { selectMoveCommentByHalfMoveIndex, useDraftStore } from '@/entities/draft';
import { useMoveHistoryStore } from '@/entities/move-history';
import { MoveCommentEditor } from './move-comment-editor';

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

describe('MoveCommentEditor', () => {
  beforeEach(() => {
    useMoveHistoryStore.getState().clearMoveHistory();
    useDraftStore.getState().clearDraftComments();
  });

  afterEach(() => {
    cleanup();
  });

  it('선택된 반수가 없으면 textarea를 비활성화해야 한다', () => {
    render(<MoveCommentEditor />);

    expect(screen.getByRole('textbox', { name: '선택 수 코멘트' })).toBeDisabled();
  });

  it('textarea 입력을 선택 반수의 코멘트로 저장해야 한다', () => {
    const beforeState = createInitialGameState();
    appendMove(beforeState, createMove(SQUARE.E2, SQUARE.E4, MOVE_KIND.DOUBLE_PAWN_PUSH), 'e4');
    render(<MoveCommentEditor />);

    fireEvent.change(screen.getByRole('textbox', { name: '선택 수 코멘트' }), {
      target: { value: '공간을 잡는 첫 수' },
    });

    expect(selectMoveCommentByHalfMoveIndex(0)(useDraftStore.getState())).toEqual({
      halfMoveIndex: 0,
      comment: '공간을 잡는 첫 수',
    });
  });
});
