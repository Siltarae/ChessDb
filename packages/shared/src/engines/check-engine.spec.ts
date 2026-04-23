import { describe, expect, it } from 'vitest';
import type { GameState } from '../models/game-state.js';
import { COLOR, PIECE_TYPE, SQUARE } from '../models/game-state.js';
import { isCheck } from './check-engine.js';

const createEmptyState = (): GameState => ({
  board: Array(64).fill(null),
  turn: COLOR.WHITE,
  castlingRights: 0,
  enPassantSquare: null,
  halfmoveClock: 0,
  fullmoveNumber: 1,
});

describe('CheckEngine', () => {
  describe('isCheck', () => {
    it('백 킹이 상대 룩의 공격 경로에 있으면 체크 상태를 반환해야 한다', () => {
      const board = [...Array(64).fill(null)];
      board[SQUARE.E1] = { type: PIECE_TYPE.KING, color: COLOR.WHITE };
      board[SQUARE.E8] = { type: PIECE_TYPE.ROOK, color: COLOR.BLACK };
      const state = { ...createEmptyState(), board };

      expect(isCheck(state, COLOR.WHITE)).toBe(true);
    });

    it('중간에 장애물이 있으면 체크 상태가 아니어야 한다', () => {
      const board = [...Array(64).fill(null)];
      board[SQUARE.E1] = { type: PIECE_TYPE.KING, color: COLOR.WHITE };
      board[SQUARE.E8] = { type: PIECE_TYPE.ROOK, color: COLOR.BLACK };
      board[SQUARE.E4] = { type: PIECE_TYPE.BISHOP, color: COLOR.WHITE };
      const state = { ...createEmptyState(), board };

      expect(isCheck(state, COLOR.WHITE)).toBe(false);
    });

    it('백 킹이 상대 나이트에 의해 위협받으면 체크 상태를 반환해야 한다', () => {
      const board = [...Array(64).fill(null)];
      board[SQUARE.E4] = { type: PIECE_TYPE.KING, color: COLOR.WHITE };
      board[SQUARE.F6] = { type: PIECE_TYPE.KNIGHT, color: COLOR.BLACK };
      const state = { ...createEmptyState(), board };

      expect(isCheck(state, COLOR.WHITE)).toBe(true);
    });

    it('백 킹이 상대 폰의 대각선 공격을 받으면 체크 상태를 반환해야 한다', () => {
      const board = [...Array(64).fill(null)];
      board[SQUARE.E4] = { type: PIECE_TYPE.KING, color: COLOR.WHITE };
      board[SQUARE.F5] = { type: PIECE_TYPE.PAWN, color: COLOR.BLACK };
      const state = { ...createEmptyState(), board };

      expect(isCheck(state, COLOR.WHITE)).toBe(true);
    });

    it('흑 킹도 자신의 색 기준으로 상대 공격만 체크로 판정해야 한다', () => {
      const board = [...Array(64).fill(null)];
      board[SQUARE.E5] = { type: PIECE_TYPE.KING, color: COLOR.BLACK };
      board[SQUARE.B2] = { type: PIECE_TYPE.BISHOP, color: COLOR.WHITE };
      const state = { ...createEmptyState(), turn: COLOR.BLACK, board };

      expect(isCheck(state, COLOR.BLACK)).toBe(true);
      expect(isCheck(state, COLOR.WHITE)).toBe(false);
    });
  });
});
