import {
  CASTLE,
  COLOR,
  GAME_RESULT_STATUS,
  PIECE_TYPE,
  REASON,
  SQUARE,
  createInitialGameState,
  positionFingerprint,
  type GameState,
  type Piece,
} from '@chess-db/shared';
import { describe, expect, it } from 'vitest';

import { useGameResultStatus } from './use-game-result-status';

const createEmptyBoard = (): Array<Piece | null> => Array(64).fill(null);

const createEmptyState = (overrides: Partial<GameState> = {}): GameState => ({
  board: createEmptyBoard(),
  turn: COLOR.WHITE,
  castlingRights: 0,
  enPassantSquare: null,
  halfmoveClock: 0,
  fullmoveNumber: 1,
  ...overrides,
});

const createCheckmateState = (): GameState => {
  const board = createEmptyBoard();
  board[SQUARE.H8] = { type: PIECE_TYPE.KING, color: COLOR.BLACK };
  board[SQUARE.G7] = { type: PIECE_TYPE.QUEEN, color: COLOR.WHITE };
  board[SQUARE.F6] = { type: PIECE_TYPE.KING, color: COLOR.WHITE };

  return createEmptyState({
    board,
    turn: COLOR.BLACK,
  });
};

const createRepetitionState = (): GameState => {
  const board = createEmptyBoard();
  board[SQUARE.E1] = { type: PIECE_TYPE.KING, color: COLOR.WHITE };
  board[SQUARE.A1] = { type: PIECE_TYPE.ROOK, color: COLOR.WHITE };
  board[SQUARE.E8] = { type: PIECE_TYPE.KING, color: COLOR.BLACK };
  board[SQUARE.H8] = { type: PIECE_TYPE.ROOK, color: COLOR.BLACK };

  return createEmptyState({
    board,
    turn: COLOR.WHITE,
    castlingRights: CASTLE.WHITE_KING_SIDE | CASTLE.BLACK_KING_SIDE,
  });
};

describe('useGameResultStatus', () => {
  it('진행 중인 상태이면 새 착수를 허용해야 한다', () => {
    const resultStatus = useGameResultStatus(createInitialGameState(), {});

    expect(resultStatus.gameResult).toEqual({ status: GAME_RESULT_STATUS.ONGOING });
    expect(resultStatus.isGameOver).toBe(false);
    expect(resultStatus.resultReason).toBeNull();
    expect(resultStatus.canStartNewMove).toBe(true);
  });

  it('체크메이트 상태이면 종료 상태와 새 착수 차단 값을 반환해야 한다', () => {
    const resultStatus = useGameResultStatus(createCheckmateState(), {});

    expect(resultStatus.gameResult).toEqual({
      status: GAME_RESULT_STATUS.FINISHED,
      reason: REASON.CHECKMATE,
      winner: COLOR.WHITE,
    });
    expect(resultStatus.isGameOver).toBe(true);
    expect(resultStatus.resultReason).toBe(REASON.CHECKMATE);
    expect(resultStatus.canStartNewMove).toBe(false);
  });

  it('현재 포지션의 과거 등장 횟수가 2회이면 3회 반복 종료로 판정해야 한다', () => {
    const state = createRepetitionState();
    const resultStatus = useGameResultStatus(state, {
      [positionFingerprint(state)]: 2,
    });

    expect(resultStatus.gameResult).toEqual({
      status: GAME_RESULT_STATUS.FINISHED,
      reason: REASON.THREEFOLD_REPETITION,
    });
    expect(resultStatus.isGameOver).toBe(true);
    expect(resultStatus.resultReason).toBe(REASON.THREEFOLD_REPETITION);
    expect(resultStatus.canStartNewMove).toBe(false);
  });

  it('현재 포지션의 과거 등장 횟수가 1회이면 3회 반복으로 차단하지 않아야 한다', () => {
    const state = createRepetitionState();
    const resultStatus = useGameResultStatus(state, {
      [positionFingerprint(state)]: 1,
    });

    expect(resultStatus.gameResult).toEqual({ status: GAME_RESULT_STATUS.ONGOING });
    expect(resultStatus.isGameOver).toBe(false);
    expect(resultStatus.resultReason).toBeNull();
    expect(resultStatus.canStartNewMove).toBe(true);
  });

  it('50수 규칙 종료 상태이면 무승부로 분류해야 한다', () => {
    const state = createRepetitionState();
    const resultStatus = useGameResultStatus(
      {
        ...state,
        halfmoveClock: 100,
      },
      {},
    );

    expect(resultStatus.gameResult).toEqual({
      status: GAME_RESULT_STATUS.FINISHED,
      reason: REASON.FIFTY_MOVE,
    });
    expect(resultStatus.isDraw).toBe(true);
  });
});
