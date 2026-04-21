import { describe, expect, it } from 'vitest';
import type { GameState } from '../models/game-state.js';
import { COLOR, PIECE_TYPE, SQUARE } from '../models/game-state.js';
import { getBishopMoves } from './bishop-engine.js';

const createEmptyState = (): GameState => ({
  board: Array(64).fill(null),
  turn: COLOR.WHITE,
  castlingRights: 0,
  enPassantSquare: null,
  halfmoveClock: 0,
  fullmoveNumber: 1,
});

describe('BishopEngine', () => {
  describe('getBishopMoves', () => {
    it('빈 보드 중앙에서 13개의 대각선 위치를 반환해야 한다', () => {
      const board = [...Array(64).fill(null)];
      board[SQUARE.D4] = { type: PIECE_TYPE.BISHOP, color: COLOR.WHITE };
      const state = { ...createEmptyState(), board };

      const moves = getBishopMoves(SQUARE.D4, state);

      expect(moves).toEqual([
        SQUARE.E5,
        SQUARE.F6,
        SQUARE.G7,
        SQUARE.H8,
        SQUARE.E3,
        SQUARE.F2,
        SQUARE.G1,
        SQUARE.C5,
        SQUARE.B6,
        SQUARE.A7,
        SQUARE.C3,
        SQUARE.B2,
        SQUARE.A1,
      ]);
    });

    it('장애물인 아군 기물에 의해 경로가 중간에서 차단되어야 한다', () => {
      const board = [...Array(64).fill(null)];
      board[SQUARE.D4] = { type: PIECE_TYPE.BISHOP, color: COLOR.WHITE };
      board[SQUARE.F6] = { type: PIECE_TYPE.PAWN, color: COLOR.WHITE };
      board[SQUARE.B6] = { type: PIECE_TYPE.KNIGHT, color: COLOR.WHITE };
      const state = { ...createEmptyState(), board };

      const moves = getBishopMoves(SQUARE.D4, state);

      expect(moves).toEqual([
        SQUARE.E5,
        SQUARE.E3,
        SQUARE.F2,
        SQUARE.G1,
        SQUARE.C5,
        SQUARE.C3,
        SQUARE.B2,
        SQUARE.A1,
      ]);
      expect(moves).not.toContain(SQUARE.F6);
      expect(moves).not.toContain(SQUARE.B6);
    });

    it('상대 기물을 잡을 수 있는 칸까지는 포함하고 그 뒤는 차단되어야 한다', () => {
      const board = [...Array(64).fill(null)];
      board[SQUARE.D4] = { type: PIECE_TYPE.BISHOP, color: COLOR.WHITE };
      board[SQUARE.F6] = { type: PIECE_TYPE.PAWN, color: COLOR.BLACK };
      board[SQUARE.B2] = { type: PIECE_TYPE.ROOK, color: COLOR.BLACK };
      board[SQUARE.H8] = { type: PIECE_TYPE.QUEEN, color: COLOR.BLACK };
      board[SQUARE.A1] = { type: PIECE_TYPE.KNIGHT, color: COLOR.BLACK };
      const state = { ...createEmptyState(), board };

      const moves = getBishopMoves(SQUARE.D4, state);

      expect(moves).toEqual([
        SQUARE.E5,
        SQUARE.F6,
        SQUARE.E3,
        SQUARE.F2,
        SQUARE.G1,
        SQUARE.C5,
        SQUARE.B6,
        SQUARE.A7,
        SQUARE.C3,
        SQUARE.B2,
      ]);
      expect(moves).not.toContain(SQUARE.H8);
      expect(moves).not.toContain(SQUARE.A1);
    });

    it('코너 시작 칸에서는 가능한 대각선 방향만 결과에 포함해야 한다', () => {
      const board = [...Array(64).fill(null)];
      board[SQUARE.A1] = { type: PIECE_TYPE.BISHOP, color: COLOR.WHITE };
      const state = { ...createEmptyState(), board };

      const moves = getBishopMoves(SQUARE.A1, state);

      expect(moves).toEqual([
        SQUARE.B2,
        SQUARE.C3,
        SQUARE.D4,
        SQUARE.E5,
        SQUARE.F6,
        SQUARE.G7,
        SQUARE.H8,
      ]);
    });

    it('바로 옆 칸이 아군이면 그 방향은 0칸이어야 한다', () => {
      const board = [...Array(64).fill(null)];
      board[SQUARE.D4] = { type: PIECE_TYPE.BISHOP, color: COLOR.WHITE };
      board[SQUARE.E5] = { type: PIECE_TYPE.PAWN, color: COLOR.WHITE };
      const state = { ...createEmptyState(), board };

      const moves = getBishopMoves(SQUARE.D4, state);

      expect(moves).toEqual([
        SQUARE.E3,
        SQUARE.F2,
        SQUARE.G1,
        SQUARE.C5,
        SQUARE.B6,
        SQUARE.A7,
        SQUARE.C3,
        SQUARE.B2,
        SQUARE.A1,
      ]);
      expect(moves).not.toContain(SQUARE.E5);
    });

    it('바로 옆 칸이 적군이면 그 칸만 포함하고 즉시 종료해야 한다', () => {
      const board = [...Array(64).fill(null)];
      board[SQUARE.D4] = { type: PIECE_TYPE.BISHOP, color: COLOR.WHITE };
      board[SQUARE.E5] = { type: PIECE_TYPE.PAWN, color: COLOR.BLACK };
      board[SQUARE.F6] = { type: PIECE_TYPE.ROOK, color: COLOR.BLACK };
      const state = { ...createEmptyState(), board };

      const moves = getBishopMoves(SQUARE.D4, state);

      expect(moves).toEqual([
        SQUARE.E5,
        SQUARE.E3,
        SQUARE.F2,
        SQUARE.G1,
        SQUARE.C5,
        SQUARE.B6,
        SQUARE.A7,
        SQUARE.C3,
        SQUARE.B2,
        SQUARE.A1,
      ]);
      expect(moves).not.toContain(SQUARE.F6);
    });

    it('선택한 칸에 비숍이 아닌 기물이 있으면 빈 배열을 반환해야 한다', () => {
      const board = [...Array(64).fill(null)];
      board[SQUARE.D4] = { type: PIECE_TYPE.ROOK, color: COLOR.WHITE };
      const state = { ...createEmptyState(), board };

      const moves = getBishopMoves(SQUARE.D4, state);

      expect(moves).toEqual([]);
    });

    it('흑 비숍도 자신의 색 기준으로 아군과 적군을 구분해야 한다', () => {
      const board = [...Array(64).fill(null)];
      board[SQUARE.E5] = { type: PIECE_TYPE.BISHOP, color: COLOR.BLACK };
      board[SQUARE.F6] = { type: PIECE_TYPE.PAWN, color: COLOR.BLACK };
      board[SQUARE.D4] = { type: PIECE_TYPE.KNIGHT, color: COLOR.WHITE };
      board[SQUARE.C3] = { type: PIECE_TYPE.ROOK, color: COLOR.WHITE };
      const state = { ...createEmptyState(), turn: COLOR.BLACK, board };

      const moves = getBishopMoves(SQUARE.E5, state);

      expect(moves).toEqual([
        SQUARE.F4,
        SQUARE.G3,
        SQUARE.H2,
        SQUARE.D6,
        SQUARE.C7,
        SQUARE.B8,
        SQUARE.D4,
      ]);
      expect(moves).not.toContain(SQUARE.F6);
      expect(moves).not.toContain(SQUARE.C3);
    });
  });
});
