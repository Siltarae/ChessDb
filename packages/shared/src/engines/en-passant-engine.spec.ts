import { describe, expect, it } from 'vitest';
import type { GameState } from '../models/game-state.js';
import { COLOR, PIECE_TYPE, SQUARE } from '../models/game-state.js';
import { enPassantMove } from '../test-utils/move-test-helpers.js';
import { executeEnPassant, getEnPassantMoves } from './en-passant-engine.js';

const createEmptyState = (): GameState => ({
  board: Array(64).fill(null),
  turn: COLOR.WHITE,
  castlingRights: 0,
  enPassantSquare: null,
  halfmoveClock: 0,
  fullmoveNumber: 1,
});

describe('EnPassantEngine', () => {
  describe('getEnPassantMoves', () => {
    it('시작 칸에 폰이 없으면 빈 배열을 반환해야 한다', () => {
      const state = createEmptyState();

      expect(getEnPassantMoves(SQUARE.E5, state)).toEqual([]);
    });

    it('현재 턴의 폰이 아니면 빈 배열을 반환해야 한다', () => {
      const board = [...Array(64).fill(null)];
      board[SQUARE.E5] = { type: PIECE_TYPE.PAWN, color: COLOR.BLACK };
      board[SQUARE.D5] = { type: PIECE_TYPE.PAWN, color: COLOR.WHITE };
      const state = {
        ...createEmptyState(),
        enPassantSquare: SQUARE.D6,
        board,
      };

      expect(getEnPassantMoves(SQUARE.E5, state)).toEqual([]);
    });

    it('앙파상 타겟이 설정된 경우 백 폰의 대각선 캡처 수를 반환해야 한다', () => {
      const board = [...Array(64).fill(null)];
      board[SQUARE.E5] = { type: PIECE_TYPE.PAWN, color: COLOR.WHITE };
      board[SQUARE.D5] = { type: PIECE_TYPE.PAWN, color: COLOR.BLACK };
      const state = {
        ...createEmptyState(),
        enPassantSquare: SQUARE.D6,
        board,
      };

      expect(getEnPassantMoves(SQUARE.E5, state)).toEqual([
        enPassantMove(SQUARE.E5, SQUARE.D6, SQUARE.D5),
      ]);
    });

    it('앙파상 타겟이 없어도 일반 대각선 후보만으로 허용하면 안 된다', () => {
      const board = [...Array(64).fill(null)];
      board[SQUARE.E5] = { type: PIECE_TYPE.PAWN, color: COLOR.WHITE };
      board[SQUARE.D5] = { type: PIECE_TYPE.PAWN, color: COLOR.BLACK };
      const state = {
        ...createEmptyState(),
        board,
      };

      expect(getEnPassantMoves(SQUARE.E5, state)).toEqual([]);
    });

    it('제거 대상 칸에 상대 폰이 없으면 앙파상을 허용하지 않아야 한다', () => {
      const board = [...Array(64).fill(null)];
      board[SQUARE.E5] = { type: PIECE_TYPE.PAWN, color: COLOR.WHITE };
      const state = {
        ...createEmptyState(),
        enPassantSquare: SQUARE.D6,
        board,
      };

      expect(getEnPassantMoves(SQUARE.E5, state)).toEqual([]);
    });

    it('앙파상 대상 칸이 대각선 캡처 후보가 아니면 허용하지 않아야 한다', () => {
      const board = [...Array(64).fill(null)];
      board[SQUARE.E5] = { type: PIECE_TYPE.PAWN, color: COLOR.WHITE };
      board[SQUARE.D5] = { type: PIECE_TYPE.PAWN, color: COLOR.BLACK };
      const state = {
        ...createEmptyState(),
        enPassantSquare: SQUARE.E6,
        board,
      };

      expect(getEnPassantMoves(SQUARE.E5, state)).toEqual([]);
    });

    it('앙파상 목적지 칸에 이미 말이 있으면 허용하지 않아야 한다', () => {
      const board = [...Array(64).fill(null)];
      board[SQUARE.E5] = { type: PIECE_TYPE.PAWN, color: COLOR.WHITE };
      board[SQUARE.D5] = { type: PIECE_TYPE.PAWN, color: COLOR.BLACK };
      board[SQUARE.D6] = { type: PIECE_TYPE.KNIGHT, color: COLOR.WHITE };
      const state = {
        ...createEmptyState(),
        enPassantSquare: SQUARE.D6,
        board,
      };

      expect(getEnPassantMoves(SQUARE.E5, state)).toEqual([]);
    });

    it('A파일의 폰은 보드 밖 서쪽 대각선을 제외하고 앙파상 후보를 계산해야 한다', () => {
      const board = [...Array(64).fill(null)];
      board[SQUARE.A5] = { type: PIECE_TYPE.PAWN, color: COLOR.WHITE };
      board[SQUARE.B5] = { type: PIECE_TYPE.PAWN, color: COLOR.BLACK };
      const state = {
        ...createEmptyState(),
        enPassantSquare: SQUARE.B6,
        board,
      };

      expect(getEnPassantMoves(SQUARE.A5, state)).toEqual([
        enPassantMove(SQUARE.A5, SQUARE.B6, SQUARE.B5),
      ]);
    });

    it('H파일의 폰은 보드 밖 동쪽 대각선을 제외하고 앙파상 후보를 계산해야 한다', () => {
      const board = [...Array(64).fill(null)];
      board[SQUARE.H5] = { type: PIECE_TYPE.PAWN, color: COLOR.WHITE };
      board[SQUARE.G5] = { type: PIECE_TYPE.PAWN, color: COLOR.BLACK };
      const state = {
        ...createEmptyState(),
        enPassantSquare: SQUARE.G6,
        board,
      };

      expect(getEnPassantMoves(SQUARE.H5, state)).toEqual([
        enPassantMove(SQUARE.H5, SQUARE.G6, SQUARE.G5),
      ]);
    });
  });

  describe('executeEnPassant', () => {
    it('앙파상 실행 시 이동한 폰을 목적지로 옮기고 원래 상대 폰은 제거해야 한다', () => {
      const board = [...Array(64).fill(null)];
      board[SQUARE.E5] = { type: PIECE_TYPE.PAWN, color: COLOR.WHITE };
      board[SQUARE.D5] = { type: PIECE_TYPE.PAWN, color: COLOR.BLACK };
      const state = {
        ...createEmptyState(),
        enPassantSquare: SQUARE.D6,
        board,
      };

      const nextState = executeEnPassant(SQUARE.E5, SQUARE.D6, state);

      expect(nextState.board[SQUARE.E5]).toBeNull();
      expect(nextState.board[SQUARE.D5]).toBeNull();
      expect(nextState.board[SQUARE.D6]).toEqual({ type: PIECE_TYPE.PAWN, color: COLOR.WHITE });
    });

    it('앙파상 실행 후 enPassantSquare를 null로 초기화해야 한다', () => {
      const board = [...Array(64).fill(null)];
      board[SQUARE.D4] = { type: PIECE_TYPE.PAWN, color: COLOR.BLACK };
      board[SQUARE.E4] = { type: PIECE_TYPE.PAWN, color: COLOR.WHITE };
      const state = {
        ...createEmptyState(),
        turn: COLOR.BLACK,
        enPassantSquare: SQUARE.E3,
        board,
      };

      const nextState = executeEnPassant(SQUARE.D4, SQUARE.E3, state);

      expect(nextState.enPassantSquare).toBeNull();
    });

    it('잘못된 시작 칸이나 목적지면 원본 상태를 그대로 반환해야 한다', () => {
      const state = createEmptyState();

      expect(executeEnPassant(SQUARE.E5, SQUARE.D6, state)).toBe(state);
    });

    it('목적지가 현재 앙파상 대상 칸이 아니면 원본 상태를 반환해야 한다', () => {
      const board = [...Array(64).fill(null)];
      board[SQUARE.E5] = { type: PIECE_TYPE.PAWN, color: COLOR.WHITE };
      board[SQUARE.D5] = { type: PIECE_TYPE.PAWN, color: COLOR.BLACK };
      const state = {
        ...createEmptyState(),
        enPassantSquare: SQUARE.D6,
        board,
      };

      expect(executeEnPassant(SQUARE.E5, SQUARE.F6, state)).toBe(state);
    });

    it('목적지가 폰의 대각선 캡처 후보가 아니면 원본 상태를 반환해야 한다', () => {
      const board = [...Array(64).fill(null)];
      board[SQUARE.E5] = { type: PIECE_TYPE.PAWN, color: COLOR.WHITE };
      board[SQUARE.D5] = { type: PIECE_TYPE.PAWN, color: COLOR.BLACK };
      const state = {
        ...createEmptyState(),
        enPassantSquare: SQUARE.E6,
        board,
      };

      expect(executeEnPassant(SQUARE.E5, SQUARE.E6, state)).toBe(state);
    });

    it('제거 대상 칸에 상대 폰이 아니면 원본 상태를 반환해야 한다', () => {
      const board = [...Array(64).fill(null)];
      board[SQUARE.E5] = { type: PIECE_TYPE.PAWN, color: COLOR.WHITE };
      board[SQUARE.D5] = { type: PIECE_TYPE.KNIGHT, color: COLOR.BLACK };
      const state = {
        ...createEmptyState(),
        enPassantSquare: SQUARE.D6,
        board,
      };

      expect(executeEnPassant(SQUARE.E5, SQUARE.D6, state)).toBe(state);
    });
  });
});
