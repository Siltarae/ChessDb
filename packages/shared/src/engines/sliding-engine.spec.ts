import { describe, expect, it } from 'vitest';
import type { GameState } from '../models/game-state.js';
import { COLOR, PIECE_TYPE, SQUARE } from '../models/game-state.js';
import { DIRECTION } from '../utils/ray-table.js';
import { getSlidingMoves } from './sliding-engine.js';

const createEmptyState = (): GameState => ({
  board: Array(64).fill(null),
  turn: COLOR.WHITE,
  castlingRights: 0,
  enPassantSquare: null,
  halfmoveClock: 0,
  fullmoveNumber: 1,
});

describe('SlidingEngine', () => {
  describe('getSlidingMoves', () => {
    it('시작 칸의 기물 존재와 무관하게 주어진 색 기준으로 ray를 수집해야 한다', () => {
      const state = createEmptyState();

      const moves = getSlidingMoves(SQUARE.D4, [DIRECTION.NORTH_EAST], state, COLOR.WHITE);

      expect(moves).toEqual([SQUARE.E5, SQUARE.F6, SQUARE.G7, SQUARE.H8]);
    });

    it('한 방향으로 빈 칸을 끝까지 수집해야 한다', () => {
      const board = [...Array(64).fill(null)];
      board[SQUARE.D4] = { type: PIECE_TYPE.BISHOP, color: COLOR.WHITE };
      const state = { ...createEmptyState(), board };

      const moves = getSlidingMoves(SQUARE.D4, [DIRECTION.NORTH_EAST], state, COLOR.WHITE);

      expect(moves).toEqual([SQUARE.E5, SQUARE.F6, SQUARE.G7, SQUARE.H8]);
    });

    it('아군 기물에서 멈추고 상대 기물은 포함한 뒤 같은 방향 탐색을 종료해야 한다', () => {
      const board = [...Array(64).fill(null)];
      board[SQUARE.D4] = { type: PIECE_TYPE.BISHOP, color: COLOR.WHITE };
      board[SQUARE.F6] = { type: PIECE_TYPE.PAWN, color: COLOR.WHITE };
      board[SQUARE.B2] = { type: PIECE_TYPE.KNIGHT, color: COLOR.BLACK };
      board[SQUARE.A1] = { type: PIECE_TYPE.ROOK, color: COLOR.BLACK };
      const state = { ...createEmptyState(), board };

      const moves = getSlidingMoves(
        SQUARE.D4,
        [DIRECTION.NORTH_EAST, DIRECTION.SOUTH_WEST],
        state,
        COLOR.WHITE,
      );

      expect(moves).toEqual([SQUARE.E5, SQUARE.C3, SQUARE.B2]);
      expect(moves).not.toContain(SQUARE.F6);
      expect(moves).not.toContain(SQUARE.A1);
    });

    it('바로 옆 칸이 아군이면 해당 방향 결과는 즉시 비어 있어야 한다', () => {
      const board = [...Array(64).fill(null)];
      board[SQUARE.D4] = { type: PIECE_TYPE.BISHOP, color: COLOR.WHITE };
      board[SQUARE.E5] = { type: PIECE_TYPE.PAWN, color: COLOR.WHITE };
      const state = { ...createEmptyState(), board };

      const moves = getSlidingMoves(SQUARE.D4, [DIRECTION.NORTH_EAST], state, COLOR.WHITE);

      expect(moves).toEqual([]);
      expect(moves).not.toContain(SQUARE.E5);
    });

    it('바로 옆 칸이 적군이면 그 칸 하나만 포함하고 즉시 종료해야 한다', () => {
      const board = [...Array(64).fill(null)];
      board[SQUARE.D4] = { type: PIECE_TYPE.BISHOP, color: COLOR.WHITE };
      board[SQUARE.E5] = { type: PIECE_TYPE.PAWN, color: COLOR.BLACK };
      board[SQUARE.F6] = { type: PIECE_TYPE.ROOK, color: COLOR.BLACK };
      const state = { ...createEmptyState(), board };

      const moves = getSlidingMoves(SQUARE.D4, [DIRECTION.NORTH_EAST], state, COLOR.WHITE);

      expect(moves).toEqual([SQUARE.E5]);
      expect(moves).not.toContain(SQUARE.F6);
    });

    it('가장자리 시작 칸에서 진행할 수 없는 방향의 ray는 빈 배열로 처리해야 한다', () => {
      const board = [...Array(64).fill(null)];
      board[SQUARE.A1] = { type: PIECE_TYPE.BISHOP, color: COLOR.WHITE };
      const state = { ...createEmptyState(), board };

      const moves = getSlidingMoves(
        SQUARE.A1,
        [DIRECTION.WEST, DIRECTION.SOUTH, DIRECTION.SOUTH_WEST],
        state,
        COLOR.WHITE,
      );

      expect(moves).toEqual([]);
    });

    it('여러 방향을 합칠 때 결과는 입력한 방향 순서대로 이어붙여야 한다', () => {
      const board = [...Array(64).fill(null)];
      board[SQUARE.D4] = { type: PIECE_TYPE.BISHOP, color: COLOR.WHITE };
      const state = { ...createEmptyState(), board };

      const moves = getSlidingMoves(
        SQUARE.D4,
        [DIRECTION.SOUTH_WEST, DIRECTION.NORTH_EAST],
        state,
        COLOR.WHITE,
      );

      expect(moves).toEqual([
        SQUARE.C3,
        SQUARE.B2,
        SQUARE.A1,
        SQUARE.E5,
        SQUARE.F6,
        SQUARE.G7,
        SQUARE.H8,
      ]);
    });
  });
});
