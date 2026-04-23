import { describe, expect, it } from 'vitest';
import type { GameState } from '../models/game-state.js';
import { COLOR, PIECE_TYPE, SQUARE } from '../models/game-state.js';
import { isSquareAttacked } from './square-attack-engine.js';

const createEmptyState = (): GameState => ({
  board: Array(64).fill(null),
  turn: COLOR.WHITE,
  castlingRights: 0,
  enPassantSquare: null,
  halfmoveClock: 0,
  fullmoveNumber: 1,
});

describe('SquareAttackEngine', () => {
  describe('isSquareAttacked', () => {
    it('상대 룩이 같은 파일에서 막히지 않으면 공격 중으로 판정해야 한다', () => {
      const board = [...Array(64).fill(null)];
      board[SQUARE.E8] = { type: PIECE_TYPE.ROOK, color: COLOR.BLACK };
      const state = { ...createEmptyState(), board };

      expect(isSquareAttacked(SQUARE.E1, COLOR.BLACK, state)).toBe(true);
    });

    it('슬라이딩 공격 경로에 장애물이 있으면 공격이 아닌 것으로 판정해야 한다', () => {
      const board = [...Array(64).fill(null)];
      board[SQUARE.E8] = { type: PIECE_TYPE.ROOK, color: COLOR.BLACK };
      board[SQUARE.E4] = { type: PIECE_TYPE.PAWN, color: COLOR.WHITE };
      const state = { ...createEmptyState(), board };

      expect(isSquareAttacked(SQUARE.E1, COLOR.BLACK, state)).toBe(false);
    });

    it('상대 비숍이 같은 대각선에 있으면 공격 중으로 판정해야 한다', () => {
      const board = [...Array(64).fill(null)];
      board[SQUARE.H4] = { type: PIECE_TYPE.BISHOP, color: COLOR.BLACK };
      const state = { ...createEmptyState(), board };

      expect(isSquareAttacked(SQUARE.E1, COLOR.BLACK, state)).toBe(true);
    });

    it('상대 퀸이 직선 또는 대각선에서 공격하면 위협으로 판정해야 한다', () => {
      const board = [...Array(64).fill(null)];
      board[SQUARE.B4] = { type: PIECE_TYPE.QUEEN, color: COLOR.BLACK };
      const state = { ...createEmptyState(), board };

      expect(isSquareAttacked(SQUARE.E4, COLOR.BLACK, state)).toBe(true);
    });

    it('상대 나이트의 L자 공격을 정확히 감지해야 한다', () => {
      const board = [...Array(64).fill(null)];
      board[SQUARE.F6] = { type: PIECE_TYPE.KNIGHT, color: COLOR.BLACK };
      const state = { ...createEmptyState(), board };

      expect(isSquareAttacked(SQUARE.E4, COLOR.BLACK, state)).toBe(true);
    });

    it('흰색 폰의 대각선 공격을 정확히 감지해야 한다', () => {
      const board = [...Array(64).fill(null)];
      board[SQUARE.D3] = { type: PIECE_TYPE.PAWN, color: COLOR.WHITE };
      const state = { ...createEmptyState(), board };

      expect(isSquareAttacked(SQUARE.E4, COLOR.WHITE, state)).toBe(true);
    });

    it('검은색 폰의 대각선 공격을 정확히 감지해야 한다', () => {
      const board = [...Array(64).fill(null)];
      board[SQUARE.F5] = { type: PIECE_TYPE.PAWN, color: COLOR.BLACK };
      const state = { ...createEmptyState(), turn: COLOR.BLACK, board };

      expect(isSquareAttacked(SQUARE.E4, COLOR.BLACK, state)).toBe(true);
    });

    it('보드 경계에서는 폰 공격 역추적이 보드 밖으로 워프되지 않아야 한다', () => {
      const board = [...Array(64).fill(null)];
      board[SQUARE.B5] = { type: PIECE_TYPE.PAWN, color: COLOR.BLACK };
      const state = { ...createEmptyState(), turn: COLOR.BLACK, board };

      expect(isSquareAttacked(SQUARE.A4, COLOR.BLACK, state)).toBe(true);
      expect(isSquareAttacked(SQUARE.H4, COLOR.BLACK, state)).toBe(false);
    });

    it('인접한 상대 킹의 공격도 위협으로 판정해야 한다', () => {
      const board = [...Array(64).fill(null)];
      board[SQUARE.F5] = { type: PIECE_TYPE.KING, color: COLOR.BLACK };
      const state = { ...createEmptyState(), board };

      expect(isSquareAttacked(SQUARE.E4, COLOR.BLACK, state)).toBe(true);
    });

    it('공격자 색과 다른 색 기물은 공격자로 세면 안 된다', () => {
      const board = [...Array(64).fill(null)];
      board[SQUARE.E8] = { type: PIECE_TYPE.ROOK, color: COLOR.WHITE };
      const state = { ...createEmptyState(), board };

      expect(isSquareAttacked(SQUARE.E1, COLOR.BLACK, state)).toBe(false);
    });
  });
});
