import { describe, expect, it } from 'vitest';
import type { GameState } from '../models/game-state.js';
import { CASTLE, COLOR, PIECE_TYPE, SQUARE } from '../models/game-state.js';
import { executeCastling, getCastlingMoves } from './castling-engine.js';

const createEmptyState = (): GameState => ({
  board: Array(64).fill(null),
  turn: COLOR.WHITE,
  castlingRights: 0,
  enPassantSquare: null,
  halfmoveClock: 0,
  fullmoveNumber: 1,
});

describe('CastlingEngine', () => {
  describe('getCastlingMoves', () => {
    it('모든 조건 만족 시 백 킹사이드와 퀸사이드 캐슬링 좌표를 반환해야 한다', () => {
      const board = [...Array(64).fill(null)];
      board[SQUARE.E1] = { type: PIECE_TYPE.KING, color: COLOR.WHITE };
      board[SQUARE.H1] = { type: PIECE_TYPE.ROOK, color: COLOR.WHITE };
      board[SQUARE.A1] = { type: PIECE_TYPE.ROOK, color: COLOR.WHITE };
      const state = {
        ...createEmptyState(),
        castlingRights: CASTLE.WHITE_KING_SIDE | CASTLE.WHITE_QUEEN_SIDE,
        board,
      };

      expect(getCastlingMoves(state, COLOR.WHITE)).toEqual([SQUARE.G1, SQUARE.C1]);
    });

    it('모든 조건 만족 시 흑 킹사이드와 퀸사이드 캐슬링 좌표를 반환해야 한다', () => {
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

      expect(getCastlingMoves(state, COLOR.BLACK)).toEqual([SQUARE.G8, SQUARE.C8]);
    });

    it('킹이 체크 상태일 때는 어떤 캐슬링도 허용하지 않아야 한다', () => {
      const board = [...Array(64).fill(null)];
      board[SQUARE.E1] = { type: PIECE_TYPE.KING, color: COLOR.WHITE };
      board[SQUARE.H1] = { type: PIECE_TYPE.ROOK, color: COLOR.WHITE };
      board[SQUARE.A1] = { type: PIECE_TYPE.ROOK, color: COLOR.WHITE };
      board[SQUARE.E8] = { type: PIECE_TYPE.ROOK, color: COLOR.BLACK };
      const state = {
        ...createEmptyState(),
        castlingRights: CASTLE.WHITE_KING_SIDE | CASTLE.WHITE_QUEEN_SIDE,
        board,
      };

      expect(getCastlingMoves(state, COLOR.WHITE)).toEqual([]);
    });

    it('킹이 지나가는 경로가 공격받고 있으면 해당 방향 캐슬링이 불가능해야 한다', () => {
      const board = [...Array(64).fill(null)];
      board[SQUARE.E1] = { type: PIECE_TYPE.KING, color: COLOR.WHITE };
      board[SQUARE.H1] = { type: PIECE_TYPE.ROOK, color: COLOR.WHITE };
      board[SQUARE.A1] = { type: PIECE_TYPE.ROOK, color: COLOR.WHITE };
      board[SQUARE.F8] = { type: PIECE_TYPE.ROOK, color: COLOR.BLACK };
      const state = {
        ...createEmptyState(),
        castlingRights: CASTLE.WHITE_KING_SIDE | CASTLE.WHITE_QUEEN_SIDE,
        board,
      };

      expect(getCastlingMoves(state, COLOR.WHITE)).toEqual([SQUARE.C1]);
    });

    it('퀸사이드 경로가 공격받고 있으면 퀸사이드 캐슬링이 불가능해야 한다', () => {
      const board = [...Array(64).fill(null)];
      board[SQUARE.E1] = { type: PIECE_TYPE.KING, color: COLOR.WHITE };
      board[SQUARE.H1] = { type: PIECE_TYPE.ROOK, color: COLOR.WHITE };
      board[SQUARE.A1] = { type: PIECE_TYPE.ROOK, color: COLOR.WHITE };
      board[SQUARE.D8] = { type: PIECE_TYPE.ROOK, color: COLOR.BLACK };
      const state = {
        ...createEmptyState(),
        castlingRights: CASTLE.WHITE_KING_SIDE | CASTLE.WHITE_QUEEN_SIDE,
        board,
      };

      expect(getCastlingMoves(state, COLOR.WHITE)).toEqual([SQUARE.G1]);
    });

    it('사이에 다른 기물이 있으면 해당 방향 캐슬링이 불가능해야 한다', () => {
      const board = [...Array(64).fill(null)];
      board[SQUARE.E1] = { type: PIECE_TYPE.KING, color: COLOR.WHITE };
      board[SQUARE.H1] = { type: PIECE_TYPE.ROOK, color: COLOR.WHITE };
      board[SQUARE.A1] = { type: PIECE_TYPE.ROOK, color: COLOR.WHITE };
      board[SQUARE.B1] = { type: PIECE_TYPE.KNIGHT, color: COLOR.WHITE };
      board[SQUARE.F1] = { type: PIECE_TYPE.BISHOP, color: COLOR.WHITE };
      const state = {
        ...createEmptyState(),
        castlingRights: CASTLE.WHITE_KING_SIDE | CASTLE.WHITE_QUEEN_SIDE,
        board,
      };

      expect(getCastlingMoves(state, COLOR.WHITE)).toEqual([]);
    });

    it('권한 비트가 없으면 시작 위치와 기물이 맞아도 캐슬링을 허용하지 않아야 한다', () => {
      const board = [...Array(64).fill(null)];
      board[SQUARE.E1] = { type: PIECE_TYPE.KING, color: COLOR.WHITE };
      board[SQUARE.H1] = { type: PIECE_TYPE.ROOK, color: COLOR.WHITE };
      board[SQUARE.A1] = { type: PIECE_TYPE.ROOK, color: COLOR.WHITE };
      const state = { ...createEmptyState(), board };

      expect(getCastlingMoves(state, COLOR.WHITE)).toEqual([]);
    });

    it('시작 위치에 룩이 없으면 해당 방향 캐슬링을 허용하지 않아야 한다', () => {
      const board = [...Array(64).fill(null)];
      board[SQUARE.E8] = { type: PIECE_TYPE.KING, color: COLOR.BLACK };
      board[SQUARE.H8] = { type: PIECE_TYPE.BISHOP, color: COLOR.BLACK };
      board[SQUARE.A8] = { type: PIECE_TYPE.ROOK, color: COLOR.BLACK };
      const state = {
        ...createEmptyState(),
        turn: COLOR.BLACK,
        castlingRights: CASTLE.BLACK_KING_SIDE | CASTLE.BLACK_QUEEN_SIDE,
        board,
      };

      expect(getCastlingMoves(state, COLOR.BLACK)).toEqual([SQUARE.C8]);
    });

    it('시작 위치에 킹이 없으면 빈 배열을 반환해야 한다', () => {
      const board = [...Array(64).fill(null)];
      board[SQUARE.H1] = { type: PIECE_TYPE.ROOK, color: COLOR.WHITE };
      board[SQUARE.A1] = { type: PIECE_TYPE.ROOK, color: COLOR.WHITE };
      const state = {
        ...createEmptyState(),
        castlingRights: CASTLE.WHITE_KING_SIDE | CASTLE.WHITE_QUEEN_SIDE,
        board,
      };

      expect(getCastlingMoves(state, COLOR.WHITE)).toEqual([]);
    });

    it('백 기준 시작 칸에 흑 킹이 있으면 킹사이드 캐슬링을 허용하지 않아야 한다', () => {
      const board = Array(64).fill(null);

      board[SQUARE.E1] = { type: PIECE_TYPE.KING, color: COLOR.BLACK };
      board[SQUARE.H1] = { type: PIECE_TYPE.ROOK, color: COLOR.WHITE };

      const state: GameState = {
        ...createEmptyState(),
        board,
        castlingRights: CASTLE.WHITE_KING_SIDE,
      };

      expect(getCastlingMoves(state, COLOR.WHITE)).toEqual([]);
    });

    it('백 기준 시작 룩 칸에 흑 룩이 있으면 킹사이드 캐슬링을 허용하지 않아야 한다', () => {
      const board = Array(64).fill(null);

      board[SQUARE.E1] = { type: PIECE_TYPE.KING, color: COLOR.WHITE };
      board[SQUARE.H1] = { type: PIECE_TYPE.ROOK, color: COLOR.BLACK };

      const state: GameState = {
        ...createEmptyState(),
        board,
        castlingRights: CASTLE.WHITE_KING_SIDE,
      };

      expect(getCastlingMoves(state, COLOR.WHITE)).toEqual([]);
    });
  });

  describe('executeCastling', () => {
    it('시작 칸에 킹이 없으면 원본 상태를 그대로 반환해야 한다', () => {
      const state = createEmptyState();

      expect(executeCastling(SQUARE.E1, SQUARE.G1, state)).toBe(state);
    });

    it('백 킹사이드 캐슬링 실행 시 킹과 룩을 동시에 이동하고 백 캐슬링 권리를 제거해야 한다', () => {
      const board = [...Array(64).fill(null)];
      board[SQUARE.E1] = { type: PIECE_TYPE.KING, color: COLOR.WHITE };
      board[SQUARE.H1] = { type: PIECE_TYPE.ROOK, color: COLOR.WHITE };
      board[SQUARE.A1] = { type: PIECE_TYPE.ROOK, color: COLOR.WHITE };
      const state = {
        ...createEmptyState(),
        castlingRights: CASTLE.WHITE_KING_SIDE | CASTLE.WHITE_QUEEN_SIDE | CASTLE.BLACK_KING_SIDE,
        board,
      };

      const nextState = executeCastling(SQUARE.E1, SQUARE.G1, state);

      expect(nextState.board[SQUARE.E1]).toBeNull();
      expect(nextState.board[SQUARE.H1]).toBeNull();
      expect(nextState.board[SQUARE.G1]).toEqual({ type: PIECE_TYPE.KING, color: COLOR.WHITE });
      expect(nextState.board[SQUARE.F1]).toEqual({ type: PIECE_TYPE.ROOK, color: COLOR.WHITE });
      expect(nextState.castlingRights).toBe(CASTLE.BLACK_KING_SIDE);
    });

    it('시작 칸이 원래 킹 위치가 아니거나 캐슬링 목적지가 아니면 원본 상태를 그대로 반환해야 한다', () => {
      const board = [...Array(64).fill(null)];
      board[SQUARE.E1] = { type: PIECE_TYPE.KING, color: COLOR.WHITE };
      board[SQUARE.H1] = { type: PIECE_TYPE.ROOK, color: COLOR.WHITE };
      board[SQUARE.A1] = { type: PIECE_TYPE.ROOK, color: COLOR.WHITE };
      const state = {
        ...createEmptyState(),
        castlingRights: CASTLE.WHITE_KING_SIDE | CASTLE.WHITE_QUEEN_SIDE,
        board,
      };

      expect(executeCastling(SQUARE.E1, SQUARE.F1, state)).toBe(state);
      expect(executeCastling(SQUARE.F1, SQUARE.G1, state)).toBe(state);
    });

    it('해당 방향의 시작 위치에 룩이 없으면 원본 상태를 그대로 반환해야 한다', () => {
      const board = [...Array(64).fill(null)];
      board[SQUARE.E1] = { type: PIECE_TYPE.KING, color: COLOR.WHITE };
      board[SQUARE.H1] = { type: PIECE_TYPE.BISHOP, color: COLOR.WHITE };
      const state = {
        ...createEmptyState(),
        castlingRights: CASTLE.WHITE_KING_SIDE,
        board,
      };

      expect(executeCastling(SQUARE.E1, SQUARE.G1, state)).toBe(state);
    });

    it('흑 퀸사이드 캐슬링 실행 시 킹과 룩을 동시에 이동하고 흑 캐슬링 권리를 제거해야 한다', () => {
      const board = [...Array(64).fill(null)];
      board[SQUARE.E8] = { type: PIECE_TYPE.KING, color: COLOR.BLACK };
      board[SQUARE.H8] = { type: PIECE_TYPE.ROOK, color: COLOR.BLACK };
      board[SQUARE.A8] = { type: PIECE_TYPE.ROOK, color: COLOR.BLACK };
      const state = {
        ...createEmptyState(),
        turn: COLOR.BLACK,
        castlingRights: CASTLE.WHITE_QUEEN_SIDE | CASTLE.BLACK_KING_SIDE | CASTLE.BLACK_QUEEN_SIDE,
        board,
      };

      const nextState = executeCastling(SQUARE.E8, SQUARE.C8, state);

      expect(nextState.board[SQUARE.E8]).toBeNull();
      expect(nextState.board[SQUARE.A8]).toBeNull();
      expect(nextState.board[SQUARE.C8]).toEqual({ type: PIECE_TYPE.KING, color: COLOR.BLACK });
      expect(nextState.board[SQUARE.D8]).toEqual({ type: PIECE_TYPE.ROOK, color: COLOR.BLACK });
      expect(nextState.castlingRights).toBe(CASTLE.WHITE_QUEEN_SIDE);
    });
  });
});
