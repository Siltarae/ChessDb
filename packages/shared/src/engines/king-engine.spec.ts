import { describe, expect, it } from 'vitest';
import type { GameState, Square } from '../models/game-state.js';
import { CASTLE, COLOR, PIECE_TYPE, SQUARE } from '../models/game-state.js';
import { getKingMoves } from './king-engine.js';

const createEmptyState = (): GameState => ({
  board: Array(64).fill(null),
  turn: COLOR.WHITE,
  castlingRights: 0,
  enPassantSquare: null,
  halfmoveClock: 0,
  fullmoveNumber: 1,
});

describe('KingEngine', () => {
  describe('getKingMoves', () => {
    it('선택한 칸에 기물이 없으면 빈 배열을 반환해야 한다', () => {
      const state = createEmptyState();

      expect(getKingMoves(SQUARE.E4, state)).toEqual([]);
    });

    it('선택한 칸에 킹이 아니면 빈 배열을 반환해야 한다', () => {
      const board = [...Array(64).fill(null)];
      board[SQUARE.E4] = { type: PIECE_TYPE.QUEEN, color: COLOR.WHITE };
      const state = { ...createEmptyState(), board };

      expect(getKingMoves(SQUARE.E4, state)).toEqual([]);
    });

    it('보드 중앙(E4)에서 주변 8칸을 모두 반환해야 한다', () => {
      const board = [...Array(64).fill(null)];
      board[SQUARE.E4] = { type: PIECE_TYPE.KING, color: COLOR.WHITE };
      const state = { ...createEmptyState(), board };

      const moves = getKingMoves(SQUARE.E4, state);

      expect(moves).toHaveLength(8);
      expect(moves).toEqual(
        expect.arrayContaining([
          SQUARE.D3,
          SQUARE.E3,
          SQUARE.F3,
          SQUARE.D4,
          SQUARE.F4,
          SQUARE.D5,
          SQUARE.E5,
          SQUARE.F5,
        ]),
      );
    });

    it('보드 구석(A1)에서는 유효한 3칸만 반환해야 한다', () => {
      const board = [...Array(64).fill(null)];
      board[SQUARE.A1] = { type: PIECE_TYPE.KING, color: COLOR.WHITE };
      const state = { ...createEmptyState(), board };

      const moves = getKingMoves(SQUARE.A1, state);

      expect(moves).toHaveLength(3);
      expect(moves).toEqual(expect.arrayContaining([SQUARE.B1, SQUARE.A2, SQUARE.B2]));
    });

    it('아군 기물이 있는 칸은 결과에서 제외해야 한다', () => {
      const board = [...Array(64).fill(null)];
      board[SQUARE.E4] = { type: PIECE_TYPE.KING, color: COLOR.WHITE };
      board[SQUARE.D3] = { type: PIECE_TYPE.PAWN, color: COLOR.WHITE };
      board[SQUARE.F4] = { type: PIECE_TYPE.KNIGHT, color: COLOR.WHITE };
      const state = { ...createEmptyState(), board };

      const moves = getKingMoves(SQUARE.E4, state);

      expect(moves).not.toContain(SQUARE.D3);
      expect(moves).not.toContain(SQUARE.F4);
      expect(moves).toHaveLength(6);
    });

    it('적군 기물이 있는 칸은 캡처를 위해 결과에 포함해야 한다', () => {
      const board = [...Array(64).fill(null)];
      board[SQUARE.E4] = { type: PIECE_TYPE.KING, color: COLOR.WHITE };
      board[SQUARE.D3] = { type: PIECE_TYPE.PAWN, color: COLOR.BLACK };
      const state = { ...createEmptyState(), board };

      expect(getKingMoves(SQUARE.E4, state)).toContain(SQUARE.D3);
    });

    it('캐슬링 조건을 만족하면 캐슬링 목적지도 결과에 포함해야 한다', () => {
      const board = [...Array(64).fill(null)];
      board[SQUARE.E1] = { type: PIECE_TYPE.KING, color: COLOR.WHITE };
      board[SQUARE.H1] = { type: PIECE_TYPE.ROOK, color: COLOR.WHITE };
      board[SQUARE.A1] = { type: PIECE_TYPE.ROOK, color: COLOR.WHITE };
      const state = {
        ...createEmptyState(),
        castlingRights: CASTLE.WHITE_KING_SIDE | CASTLE.WHITE_QUEEN_SIDE,
        board,
      };

      const moves = getKingMoves(SQUARE.E1, state);

      expect(moves).toEqual(expect.arrayContaining([SQUARE.G1, SQUARE.C1]));
    });

    it('흑 킹도 캐슬링 조건을 만족하면 캐슬링 목적지가 결과에 포함되어야 한다', () => {
      const board = [...Array(64).fill(null)];
      board[SQUARE.E8] = { type: PIECE_TYPE.KING, color: COLOR.BLACK };
      board[SQUARE.H8] = { type: PIECE_TYPE.ROOK, color: COLOR.BLACK };
      board[SQUARE.A8] = { type: PIECE_TYPE.ROOK, color: COLOR.BLACK };
      const state = {
        ...createEmptyState(),
        turn: COLOR.BLACK,
        castlingRights: CASTLE.BLACK_KING_SIDE | CASTLE.BLACK_QUEEN_SIDE,
        board,
      };

      const moves = getKingMoves(SQUARE.E8, state);

      expect(moves).toEqual(expect.arrayContaining([SQUARE.G8, SQUARE.C8]));
    });

    it('모든 보드 칸(0-63)에 대해 반환된 좌표는 반드시 인접 칸이어야 한다', () => {
      const state = createEmptyState();

      for (let sq = 0; sq < 64; sq++) {
        const square = sq as Square;
        const board = [...Array(64).fill(null)];
        board[square] = { type: PIECE_TYPE.KING, color: COLOR.WHITE };
        const testState = { ...state, board };

        const moves = getKingMoves(square, testState);
        const originFile = square % 8;
        const originRank = Math.floor(square / 8);

        moves.forEach((target) => {
          const fileDelta = Math.abs((target % 8) - originFile);
          const rankDelta = Math.abs(Math.floor(target / 8) - originRank);

          expect(fileDelta).toBeLessThanOrEqual(1);
          expect(rankDelta).toBeLessThanOrEqual(1);
          expect(fileDelta === 0 && rankDelta === 0).toBe(false);
        });
      }
    });
  });
});
