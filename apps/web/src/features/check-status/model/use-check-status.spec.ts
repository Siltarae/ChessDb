import {
  COLOR,
  PIECE_TYPE,
  SQUARE,
  createInitialGameState,
  type GameState,
  type Piece,
} from '@chess-db/shared';
import { describe, expect, it } from 'vitest';

import { useCheckStatus } from './use-check-status';

const createEmptyBoard = () => Array<Piece | null>(64).fill(null);

const createWhiteKingCheckedByRookState = (): GameState => {
  const board = createEmptyBoard();
  board[SQUARE.E1] = { type: PIECE_TYPE.KING, color: COLOR.WHITE };
  board[SQUARE.A8] = { type: PIECE_TYPE.KING, color: COLOR.BLACK };
  board[SQUARE.E8] = { type: PIECE_TYPE.ROOK, color: COLOR.BLACK };

  return {
    ...createInitialGameState(),
    board,
    turn: COLOR.WHITE,
  };
};

describe('useCheckStatus', () => {
  it('현재 턴의 왕이 체크 상태이면 체크받은 왕 칸을 반환해야 한다', () => {
    const checkStatus = useCheckStatus(createWhiteKingCheckedByRookState());

    expect(checkStatus.checkedKingSquare).toBe(SQUARE.E1);
  });

  it('현재 턴의 왕이 체크 상태가 아니면 체크받은 왕 칸을 비워야 한다', () => {
    const checkStatus = useCheckStatus(createInitialGameState());

    expect(checkStatus.checkedKingSquare).toBeNull();
  });

  it('현재 턴의 왕을 찾을 수 없으면 체크받은 왕 칸을 비워야 한다', () => {
    const board = createEmptyBoard();
    board[SQUARE.A8] = { type: PIECE_TYPE.KING, color: COLOR.BLACK };
    board[SQUARE.E8] = { type: PIECE_TYPE.ROOK, color: COLOR.BLACK };

    const checkStatus = useCheckStatus({
      ...createInitialGameState(),
      board,
      turn: COLOR.WHITE,
    });

    expect(checkStatus.checkedKingSquare).toBeNull();
  });
});
