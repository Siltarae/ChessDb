import { describe, expect, it } from 'vitest';
import type { GameState } from '../models/game-state.js';
import { CASTLE, COLOR, PIECE_TYPE, SQUARE } from '../models/game-state.js';
import {
  GAME_RESULT_STATUS,
  REASON,
  getGameResult,
  positionFingerprint,
} from './game-result-engine.js';

const createEmptyState = (overrides: Partial<GameState> = {}): GameState => ({
  board: Array(64).fill(null),
  turn: COLOR.WHITE,
  castlingRights: 0,
  enPassantSquare: null,
  halfmoveClock: 0,
  fullmoveNumber: 1,
  ...overrides,
});

const createBoard = (): GameState['board'][number][] => Array(64).fill(null);

const createRepetitionBoard = () => {
  const board = createBoard();
  board[SQUARE.E1] = { type: PIECE_TYPE.KING, color: COLOR.WHITE };
  board[SQUARE.A1] = { type: PIECE_TYPE.ROOK, color: COLOR.WHITE };
  board[SQUARE.E8] = { type: PIECE_TYPE.KING, color: COLOR.BLACK };
  board[SQUARE.H8] = { type: PIECE_TYPE.ROOK, color: COLOR.BLACK };
  return board;
};

describe('getGameResult', () => {
  it('합법 수가 없고 체크 상태이면 체크메이트를 반환해야 한다', () => {
    const board = createBoard();
    board[SQUARE.H8] = { type: PIECE_TYPE.KING, color: COLOR.BLACK };
    board[SQUARE.G7] = { type: PIECE_TYPE.QUEEN, color: COLOR.WHITE };
    board[SQUARE.F6] = { type: PIECE_TYPE.KING, color: COLOR.WHITE };
    const state = createEmptyState({
      turn: COLOR.BLACK,
      board,
    });

    expect(getGameResult(state, {})).toEqual({
      status: GAME_RESULT_STATUS.FINISHED,
      reason: REASON.CHECKMATE,
      winner: COLOR.WHITE,
    });
  });

  it('합법 수가 없고 체크 상태가 아니면 스테일메이트를 반환해야 한다', () => {
    const board = createBoard();
    board[SQUARE.H8] = { type: PIECE_TYPE.KING, color: COLOR.BLACK };
    board[SQUARE.G6] = { type: PIECE_TYPE.QUEEN, color: COLOR.WHITE };
    board[SQUARE.F7] = { type: PIECE_TYPE.KING, color: COLOR.WHITE };
    const state = createEmptyState({
      turn: COLOR.BLACK,
      board,
    });

    expect(getGameResult(state, {})).toEqual({
      status: GAME_RESULT_STATUS.FINISHED,
      reason: REASON.STALEMATE,
    });
  });

  it('halfmoveClock이 100 이상이면 50수 무승부를 반환해야 한다', () => {
    const board = createRepetitionBoard();
    const state = createEmptyState({
      board,
      halfmoveClock: 100,
    });

    expect(getGameResult(state, {})).toEqual({
      status: GAME_RESULT_STATUS.FINISHED,
      reason: REASON.FIFTY_MOVE,
    });
  });

  it('history에 현재 상태를 포함하지 않아도 현재 상태까지 합쳐 3회 반복을 판정해야 한다', () => {
    const currentState = createEmptyState({
      board: createRepetitionBoard(),
      turn: COLOR.WHITE,
      castlingRights: CASTLE.WHITE_KING_SIDE | CASTLE.BLACK_KING_SIDE,
    });
    const history = {
      [positionFingerprint(currentState)]: 2,
    };

    expect(getGameResult(currentState, history)).toEqual({
      status: GAME_RESULT_STATUS.FINISHED,
      reason: REASON.THREEFOLD_REPETITION,
    });
  });

  it('같은 기물 배치라도 턴이 다르면 3회 반복으로 판정하면 안 된다', () => {
    const currentState = createEmptyState({
      board: createRepetitionBoard(),
      turn: COLOR.WHITE,
    });
    const history = {
      [positionFingerprint(
        createEmptyState({
          board: createRepetitionBoard(),
          turn: COLOR.BLACK,
        }),
      )]: 2,
    };

    expect(getGameResult(currentState, history)).toEqual({
      status: GAME_RESULT_STATUS.ONGOING,
    });
  });

  it('같은 기물 배치라도 캐슬링 권리가 다르면 3회 반복으로 판정하면 안 된다', () => {
    const currentState = createEmptyState({
      board: createRepetitionBoard(),
      turn: COLOR.WHITE,
      castlingRights: CASTLE.WHITE_KING_SIDE,
    });
    const history = {
      [positionFingerprint(
        createEmptyState({
          board: createRepetitionBoard(),
          turn: COLOR.WHITE,
          castlingRights: CASTLE.WHITE_QUEEN_SIDE,
        }),
      )]: 2,
    };

    expect(getGameResult(currentState, history)).toEqual({
      status: GAME_RESULT_STATUS.ONGOING,
    });
  });

  it('같은 기물 배치라도 앙파상 타깃이 다르면 3회 반복으로 판정하면 안 된다', () => {
    const currentState = createEmptyState({
      board: createRepetitionBoard(),
      turn: COLOR.WHITE,
      enPassantSquare: SQUARE.E3,
    });
    const history = {
      [positionFingerprint(
        createEmptyState({
          board: createRepetitionBoard(),
          turn: COLOR.WHITE,
          enPassantSquare: SQUARE.D3,
        }),
      )]: 2,
    };

    expect(getGameResult(currentState, history)).toEqual({
      status: GAME_RESULT_STATUS.ONGOING,
    });
  });

  it('3회 반복 판정 과정에서 history를 변경하지 않아야 한다', () => {
    const currentState = createEmptyState({
      board: createRepetitionBoard(),
      turn: COLOR.WHITE,
      castlingRights: CASTLE.WHITE_KING_SIDE | CASTLE.BLACK_KING_SIDE,
    });
    const history = {
      [positionFingerprint(currentState)]: 2,
    };
    const originalHistory = { ...history };

    getGameResult(currentState, history);

    expect(history).toEqual(originalHistory);
  });

  it('킹만 남은 상태면 기물 부족 무승부를 반환해야 한다', () => {
    const board = createBoard();
    board[SQUARE.E1] = { type: PIECE_TYPE.KING, color: COLOR.WHITE };
    board[SQUARE.E8] = { type: PIECE_TYPE.KING, color: COLOR.BLACK };
    const state = createEmptyState({ board });

    expect(getGameResult(state, {})).toEqual({
      status: GAME_RESULT_STATUS.FINISHED,
      reason: REASON.INSUFFICIENT_MATERIAL,
    });
  });

  it('킹과 비숍 대 킹은 기물 부족 무승부를 반환해야 한다', () => {
    const board = createBoard();
    board[SQUARE.E1] = { type: PIECE_TYPE.KING, color: COLOR.WHITE };
    board[SQUARE.C1] = { type: PIECE_TYPE.BISHOP, color: COLOR.WHITE };
    board[SQUARE.E8] = { type: PIECE_TYPE.KING, color: COLOR.BLACK };
    const state = createEmptyState({ board });

    expect(getGameResult(state, {})).toEqual({
      status: GAME_RESULT_STATUS.FINISHED,
      reason: REASON.INSUFFICIENT_MATERIAL,
    });
  });

  it('킹과 나이트 대 킹은 기물 부족 무승부를 반환해야 한다', () => {
    const board = createBoard();
    board[SQUARE.E1] = { type: PIECE_TYPE.KING, color: COLOR.WHITE };
    board[SQUARE.G1] = { type: PIECE_TYPE.KNIGHT, color: COLOR.WHITE };
    board[SQUARE.E8] = { type: PIECE_TYPE.KING, color: COLOR.BLACK };
    const state = createEmptyState({ board });

    expect(getGameResult(state, {})).toEqual({
      status: GAME_RESULT_STATUS.FINISHED,
      reason: REASON.INSUFFICIENT_MATERIAL,
    });
  });

  it('같은 색 칸의 비숍 2개 대 킹은 기물 부족 무승부를 반환해야 한다', () => {
    const board = createBoard();
    board[SQUARE.E1] = { type: PIECE_TYPE.KING, color: COLOR.WHITE };
    board[SQUARE.C1] = { type: PIECE_TYPE.BISHOP, color: COLOR.WHITE };
    board[SQUARE.A3] = { type: PIECE_TYPE.BISHOP, color: COLOR.WHITE };
    board[SQUARE.E8] = { type: PIECE_TYPE.KING, color: COLOR.BLACK };
    const state = createEmptyState({ board });

    expect(getGameResult(state, {})).toEqual({
      status: GAME_RESULT_STATUS.FINISHED,
      reason: REASON.INSUFFICIENT_MATERIAL,
    });
  });

  it('비숍 또는 나이트가 2개 이상 남아 있으면 기물 부족 무승부가 아니어야 한다', () => {
    const board = createBoard();
    board[SQUARE.E1] = { type: PIECE_TYPE.KING, color: COLOR.WHITE };
    board[SQUARE.C1] = { type: PIECE_TYPE.BISHOP, color: COLOR.WHITE };
    board[SQUARE.F1] = { type: PIECE_TYPE.BISHOP, color: COLOR.WHITE };
    board[SQUARE.E8] = { type: PIECE_TYPE.KING, color: COLOR.BLACK };
    const state = createEmptyState({ board });

    expect(getGameResult(state, {})).toEqual({
      status: GAME_RESULT_STATUS.ONGOING,
    });
  });

  it('나이트가 2개 남아 있으면 기물 부족 무승부가 아니어야 한다', () => {
    const board = createBoard();
    board[SQUARE.E1] = { type: PIECE_TYPE.KING, color: COLOR.WHITE };
    board[SQUARE.B1] = { type: PIECE_TYPE.KNIGHT, color: COLOR.WHITE };
    board[SQUARE.G1] = { type: PIECE_TYPE.KNIGHT, color: COLOR.WHITE };
    board[SQUARE.E8] = { type: PIECE_TYPE.KING, color: COLOR.BLACK };
    const state = createEmptyState({ board });

    expect(getGameResult(state, {})).toEqual({
      status: GAME_RESULT_STATUS.ONGOING,
    });
  });

  it('비숍과 나이트가 함께 남아 있으면 기물 부족 무승부가 아니어야 한다', () => {
    const board = createBoard();
    board[SQUARE.E1] = { type: PIECE_TYPE.KING, color: COLOR.WHITE };
    board[SQUARE.C1] = { type: PIECE_TYPE.BISHOP, color: COLOR.WHITE };
    board[SQUARE.G1] = { type: PIECE_TYPE.KNIGHT, color: COLOR.WHITE };
    board[SQUARE.E8] = { type: PIECE_TYPE.KING, color: COLOR.BLACK };
    const state = createEmptyState({ board });

    expect(getGameResult(state, {})).toEqual({
      status: GAME_RESULT_STATUS.ONGOING,
    });
  });

  it('나이트를 먼저 만나고 비숍을 나중에 만나도 기물 부족 무승부가 아니어야 한다', () => {
    const board = createBoard();
    board[SQUARE.E1] = { type: PIECE_TYPE.KING, color: COLOR.WHITE };
    board[SQUARE.B1] = { type: PIECE_TYPE.KNIGHT, color: COLOR.WHITE };
    board[SQUARE.C8] = { type: PIECE_TYPE.BISHOP, color: COLOR.WHITE };
    board[SQUARE.E8] = { type: PIECE_TYPE.KING, color: COLOR.BLACK };
    const state = createEmptyState({ board });

    expect(getGameResult(state, {})).toEqual({
      status: GAME_RESULT_STATUS.ONGOING,
    });
  });

  it('폰이 하나라도 남아 있으면 기물 부족 무승부가 아니어야 한다', () => {
    const board = createBoard();
    board[SQUARE.E1] = { type: PIECE_TYPE.KING, color: COLOR.WHITE };
    board[SQUARE.E2] = { type: PIECE_TYPE.PAWN, color: COLOR.WHITE };
    board[SQUARE.E8] = { type: PIECE_TYPE.KING, color: COLOR.BLACK };
    const state = createEmptyState({ board });

    expect(getGameResult(state, {})).toEqual({
      status: GAME_RESULT_STATUS.ONGOING,
    });
  });

  it('합법 수가 하나라도 있으면 ongoing을 반환해야 한다', () => {
    const board = createBoard();
    board[SQUARE.E1] = { type: PIECE_TYPE.KING, color: COLOR.WHITE };
    board[SQUARE.A1] = { type: PIECE_TYPE.ROOK, color: COLOR.WHITE };
    board[SQUARE.E8] = { type: PIECE_TYPE.KING, color: COLOR.BLACK };
    const state = createEmptyState({ board });

    expect(getGameResult(state, {})).toEqual({
      status: GAME_RESULT_STATUS.ONGOING,
    });
  });
});

describe('positionFingerprint', () => {
  it('퀸이 있으면 퀸 기호를 포함한 fingerprint를 생성해야 한다', () => {
    const board = createBoard();
    board[SQUARE.E1] = { type: PIECE_TYPE.KING, color: COLOR.WHITE };
    board[SQUARE.D1] = { type: PIECE_TYPE.QUEEN, color: COLOR.WHITE };
    board[SQUARE.E8] = { type: PIECE_TYPE.KING, color: COLOR.BLACK };
    const state = createEmptyState({ board });

    expect(positionFingerprint(state)).toContain('wQ');
  });

  it('알 수 없는 기물 타입이면 fallback 기호를 포함한 fingerprint를 생성해야 한다', () => {
    const board = createBoard();
    board[SQUARE.E1] = { type: PIECE_TYPE.KING, color: COLOR.WHITE };
    board[SQUARE.D4] = { type: 999 as never, color: COLOR.BLACK };
    board[SQUARE.E8] = { type: PIECE_TYPE.KING, color: COLOR.BLACK };
    const state = createEmptyState({ board });

    expect(positionFingerprint(state)).toContain('bX');
  });
});
