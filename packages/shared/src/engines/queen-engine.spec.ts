import { describe, expect, it } from 'vitest';
import type { GameState, Move } from '../models/game-state.js';
import { COLOR, PIECE_TYPE, SQUARE } from '../models/game-state.js';
import { moveTargets } from '../test-utils/move-test-helpers.js';
import { getQueenMoves } from './queen-engine.js';

const createEmptyState = (): GameState => ({
  board: Array(64).fill(null),
  turn: COLOR.WHITE,
  castlingRights: 0,
  enPassantSquare: null,
  halfmoveClock: 0,
  fullmoveNumber: 1,
});

describe('QueenEngine', () => {
  describe('getQueenMoves', () => {
    it('빈 보드 중앙(D4)에서 27개의 이동 가능 위치를 반환해야 한다', () => {
      const board = [...Array(64).fill(null)];
      board[SQUARE.D4] = { type: PIECE_TYPE.QUEEN, color: COLOR.WHITE };
      const state = { ...createEmptyState(), board };

      const moves = getQueenMoves(SQUARE.D4, state);

      expect(moveTargets(moves as Move[])).toEqual([
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
        SQUARE.D5,
        SQUARE.D6,
        SQUARE.D7,
        SQUARE.D8,
        SQUARE.D3,
        SQUARE.D2,
        SQUARE.D1,
        SQUARE.E4,
        SQUARE.F4,
        SQUARE.G4,
        SQUARE.H4,
        SQUARE.C4,
        SQUARE.B4,
        SQUARE.A4,
      ]);
    });

    it('복합적인 장애물 상황에서 정확한 이동 범위를 계산해야 한다', () => {
      const board = [...Array(64).fill(null)];
      board[SQUARE.D4] = { type: PIECE_TYPE.QUEEN, color: COLOR.WHITE };
      board[SQUARE.F6] = { type: PIECE_TYPE.PAWN, color: COLOR.WHITE };
      board[SQUARE.C5] = { type: PIECE_TYPE.KNIGHT, color: COLOR.BLACK };
      board[SQUARE.D2] = { type: PIECE_TYPE.BISHOP, color: COLOR.WHITE };
      board[SQUARE.F4] = { type: PIECE_TYPE.ROOK, color: COLOR.BLACK };
      board[SQUARE.B4] = { type: PIECE_TYPE.PAWN, color: COLOR.WHITE };
      const state = { ...createEmptyState(), board };

      const moves = getQueenMoves(SQUARE.D4, state);

      const targets = moveTargets(moves as Move[]);
      expect(targets).toEqual([
        SQUARE.E5,
        SQUARE.E3,
        SQUARE.F2,
        SQUARE.G1,
        SQUARE.C5,
        SQUARE.C3,
        SQUARE.B2,
        SQUARE.A1,
        SQUARE.D5,
        SQUARE.D6,
        SQUARE.D7,
        SQUARE.D8,
        SQUARE.D3,
        SQUARE.E4,
        SQUARE.F4,
        SQUARE.C4,
      ]);
      expect(targets).not.toContain(SQUARE.F6);
      expect(targets).not.toContain(SQUARE.D2);
      expect(targets).not.toContain(SQUARE.B4);
    });

    it('반환 결과에는 중복 square가 없어야 한다', () => {
      const board = [...Array(64).fill(null)];
      board[SQUARE.D4] = { type: PIECE_TYPE.QUEEN, color: COLOR.WHITE };
      const state = { ...createEmptyState(), board };

      const moves = getQueenMoves(SQUARE.D4, state);

      const targets = moveTargets(moves as Move[]);
      expect(new Set(targets).size).toBe(targets.length);
    });

    it('선택한 칸에 퀸이 아닌 기물이 있으면 빈 배열을 반환해야 한다', () => {
      const board = [...Array(64).fill(null)];
      board[SQUARE.D4] = { type: PIECE_TYPE.ROOK, color: COLOR.WHITE };
      const state = { ...createEmptyState(), board };

      const moves = getQueenMoves(SQUARE.D4, state);

      expect(moves).toEqual([]);
    });

    it('코너 시작 칸에서는 가능한 3개 방향만 결과에 포함해야 한다', () => {
      const board = [...Array(64).fill(null)];
      board[SQUARE.A1] = { type: PIECE_TYPE.QUEEN, color: COLOR.WHITE };
      const state = { ...createEmptyState(), board };

      const moves = getQueenMoves(SQUARE.A1, state);

      expect(moveTargets(moves as Move[])).toEqual([
        SQUARE.B2,
        SQUARE.C3,
        SQUARE.D4,
        SQUARE.E5,
        SQUARE.F6,
        SQUARE.G7,
        SQUARE.H8,
        SQUARE.A2,
        SQUARE.A3,
        SQUARE.A4,
        SQUARE.A5,
        SQUARE.A6,
        SQUARE.A7,
        SQUARE.A8,
        SQUARE.B1,
        SQUARE.C1,
        SQUARE.D1,
        SQUARE.E1,
        SQUARE.F1,
        SQUARE.G1,
        SQUARE.H1,
      ]);
    });

    it('흑 퀸도 자신의 색 기준으로 아군과 적군을 구분해야 한다', () => {
      const board = [...Array(64).fill(null)];
      board[SQUARE.E5] = { type: PIECE_TYPE.QUEEN, color: COLOR.BLACK };
      board[SQUARE.F6] = { type: PIECE_TYPE.PAWN, color: COLOR.BLACK };
      board[SQUARE.D4] = { type: PIECE_TYPE.KNIGHT, color: COLOR.WHITE };
      board[SQUARE.C3] = { type: PIECE_TYPE.BISHOP, color: COLOR.WHITE };
      board[SQUARE.E6] = { type: PIECE_TYPE.ROOK, color: COLOR.BLACK };
      board[SQUARE.E4] = { type: PIECE_TYPE.PAWN, color: COLOR.WHITE };
      const state = { ...createEmptyState(), turn: COLOR.BLACK, board };

      const moves = getQueenMoves(SQUARE.E5, state);

      const targets = moveTargets(moves as Move[]);
      expect(targets).toEqual([
        SQUARE.F4,
        SQUARE.G3,
        SQUARE.H2,
        SQUARE.D6,
        SQUARE.C7,
        SQUARE.B8,
        SQUARE.D4,
        SQUARE.E4,
        SQUARE.F5,
        SQUARE.G5,
        SQUARE.H5,
        SQUARE.D5,
        SQUARE.C5,
        SQUARE.B5,
        SQUARE.A5,
      ]);
      expect(targets).not.toContain(SQUARE.F6);
      expect(targets).not.toContain(SQUARE.C3);
      expect(targets).not.toContain(SQUARE.E6);
      expect(targets).not.toContain(SQUARE.E3);
    });
  });
});
