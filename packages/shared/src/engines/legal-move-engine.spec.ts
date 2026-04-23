import { describe, expect, it } from 'vitest';
import type { GameState, Move } from '../models/game-state.js';
import { CASTLE, COLOR, PIECE_TYPE, SQUARE } from '../models/game-state.js';
import {
  castleKingsideMove,
  castleQueensideMove,
  enPassantMove,
  moveTargets,
  normalMove,
} from '../test-utils/move-test-helpers.js';
import { getLegalMoves } from './legal-move-engine.js';

const createEmptyState = (): GameState => ({
  board: Array(64).fill(null),
  turn: COLOR.WHITE,
  castlingRights: 0,
  enPassantSquare: null,
  halfmoveClock: 0,
  fullmoveNumber: 1,
});

describe('LegalMoveEngine', () => {
  describe('getLegalMoves', () => {
    it('현재 턴과 다른 색 기물을 선택하면 빈 배열을 반환해야 한다', () => {
      const board = [...Array(64).fill(null)];
      board[SQUARE.E7] = { type: PIECE_TYPE.ROOK, color: COLOR.BLACK };
      const state = { ...createEmptyState(), turn: COLOR.WHITE, board };

      expect(getLegalMoves(SQUARE.E7, state)).toEqual([]);
    });

    it('핀에 걸린 기물이 킹을 노출시키며 이동하는 것을 차단해야 한다', () => {
      const board = [...Array(64).fill(null)];
      board[SQUARE.E1] = { type: PIECE_TYPE.KING, color: COLOR.WHITE };
      board[SQUARE.E2] = { type: PIECE_TYPE.ROOK, color: COLOR.WHITE };
      board[SQUARE.E8] = { type: PIECE_TYPE.ROOK, color: COLOR.BLACK };
      const state = { ...createEmptyState(), board };

      const moves = getLegalMoves(SQUARE.E2, state);

      const targets = moveTargets(moves as Move[]);
      expect(targets).not.toContain(SQUARE.D2);
      expect(targets).not.toContain(SQUARE.F2);
      expect(moves).toEqual(
        expect.arrayContaining([
          normalMove(SQUARE.E2, SQUARE.E3),
          normalMove(SQUARE.E2, SQUARE.E4),
          normalMove(SQUARE.E2, SQUARE.E5),
          normalMove(SQUARE.E2, SQUARE.E6),
          normalMove(SQUARE.E2, SQUARE.E7),
          normalMove(SQUARE.E2, SQUARE.E8),
        ]),
      );
    });

    it('체크 상태일 때 체크를 해소하는 수만 반환해야 한다', () => {
      const board = [...Array(64).fill(null)];
      board[SQUARE.E1] = { type: PIECE_TYPE.KING, color: COLOR.WHITE };
      board[SQUARE.A2] = { type: PIECE_TYPE.ROOK, color: COLOR.WHITE };
      board[SQUARE.E8] = { type: PIECE_TYPE.ROOK, color: COLOR.BLACK };
      const state = { ...createEmptyState(), board };

      expect(getLegalMoves(SQUARE.A2, state)).toEqual([normalMove(SQUARE.A2, SQUARE.E2)]);
    });

    it('킹 스스로가 상대 공격 경로로 이동하는 것을 차단해야 한다', () => {
      const board = [...Array(64).fill(null)];
      board[SQUARE.E4] = { type: PIECE_TYPE.KING, color: COLOR.WHITE };
      board[SQUARE.E8] = { type: PIECE_TYPE.ROOK, color: COLOR.BLACK };
      const state = { ...createEmptyState(), board };

      const moves = getLegalMoves(SQUARE.E4, state);

      const targets = moveTargets(moves as Move[]);
      expect(targets).not.toContain(SQUARE.E5);
      expect(moves).toEqual(
        expect.arrayContaining([
          normalMove(SQUARE.E4, SQUARE.D3),
          normalMove(SQUARE.E4, SQUARE.D4),
          normalMove(SQUARE.E4, SQUARE.D5),
          normalMove(SQUARE.E4, SQUARE.F3),
          normalMove(SQUARE.E4, SQUARE.F4),
          normalMove(SQUARE.E4, SQUARE.F5),
        ]),
      );
    });

    it('가상 착수 검증 과정에서 원본 상태가 오염되지 않아야 한다', () => {
      const board = [...Array(64).fill(null)];
      board[SQUARE.E1] = { type: PIECE_TYPE.KING, color: COLOR.WHITE };
      board[SQUARE.E2] = { type: PIECE_TYPE.ROOK, color: COLOR.WHITE };
      board[SQUARE.E8] = { type: PIECE_TYPE.ROOK, color: COLOR.BLACK };
      const state = { ...createEmptyState(), board };
      const originalBoard = [...state.board];
      const originalTurn = state.turn;
      const originalCastlingRights = state.castlingRights;
      const originalEnPassantSquare = state.enPassantSquare;
      const originalHalfmoveClock = state.halfmoveClock;
      const originalFullmoveNumber = state.fullmoveNumber;

      getLegalMoves(SQUARE.E2, state);

      expect(state.board).toEqual(originalBoard);
      expect(state.turn).toBe(originalTurn);
      expect(state.castlingRights).toBe(originalCastlingRights);
      expect(state.enPassantSquare).toBe(originalEnPassantSquare);
      expect(state.halfmoveClock).toBe(originalHalfmoveClock);
      expect(state.fullmoveNumber).toBe(originalFullmoveNumber);
    });

    it('폰의 의사 합법 수도 체크 기준으로 필터링해야 한다', () => {
      const board = [...Array(64).fill(null)];
      board[SQUARE.E1] = { type: PIECE_TYPE.KING, color: COLOR.WHITE };
      board[SQUARE.D2] = { type: PIECE_TYPE.PAWN, color: COLOR.WHITE };
      board[SQUARE.E8] = { type: PIECE_TYPE.ROOK, color: COLOR.BLACK };
      const state = { ...createEmptyState(), board };

      expect(getLegalMoves(SQUARE.D2, state)).toEqual([]);
    });

    it('나이트의 의사 합법 수도 체크 기준으로 필터링해야 한다', () => {
      const board = [...Array(64).fill(null)];
      board[SQUARE.E1] = { type: PIECE_TYPE.KING, color: COLOR.WHITE };
      board[SQUARE.E2] = { type: PIECE_TYPE.KNIGHT, color: COLOR.WHITE };
      board[SQUARE.E8] = { type: PIECE_TYPE.ROOK, color: COLOR.BLACK };
      const state = { ...createEmptyState(), board };

      expect(getLegalMoves(SQUARE.E2, state)).toEqual([]);
    });

    it('비숍의 의사 합법 수도 체크 기준으로 필터링해야 한다', () => {
      const board = [...Array(64).fill(null)];
      board[SQUARE.E1] = { type: PIECE_TYPE.KING, color: COLOR.WHITE };
      board[SQUARE.E2] = { type: PIECE_TYPE.BISHOP, color: COLOR.WHITE };
      board[SQUARE.E8] = { type: PIECE_TYPE.ROOK, color: COLOR.BLACK };
      const state = { ...createEmptyState(), board };

      expect(getLegalMoves(SQUARE.E2, state)).toEqual([]);
    });

    it('퀸의 의사 합법 수도 체크 기준으로 필터링해야 한다', () => {
      const board = [...Array(64).fill(null)];
      board[SQUARE.E1] = { type: PIECE_TYPE.KING, color: COLOR.WHITE };
      board[SQUARE.E2] = { type: PIECE_TYPE.QUEEN, color: COLOR.WHITE };
      board[SQUARE.E8] = { type: PIECE_TYPE.ROOK, color: COLOR.BLACK };
      const state = { ...createEmptyState(), board };

      expect(getLegalMoves(SQUARE.E2, state)).toEqual(
        expect.arrayContaining([
          normalMove(SQUARE.E2, SQUARE.E3),
          normalMove(SQUARE.E2, SQUARE.E4),
          normalMove(SQUARE.E2, SQUARE.E5),
          normalMove(SQUARE.E2, SQUARE.E6),
          normalMove(SQUARE.E2, SQUARE.E7),
          normalMove(SQUARE.E2, SQUARE.E8),
        ]),
      );
      expect(moveTargets(getLegalMoves(SQUARE.E2, state) as Move[])).not.toEqual(
        expect.arrayContaining([SQUARE.D2, SQUARE.F2]),
      );
    });

    it('NONE 타입 기물은 기본 분기로 처리해 빈 배열을 반환해야 한다', () => {
      const board = [...Array(64).fill(null)];
      board[SQUARE.E4] = { type: PIECE_TYPE.NONE, color: COLOR.WHITE };
      const state = { ...createEmptyState(), board };

      expect(getLegalMoves(SQUARE.E4, state)).toEqual([]);
    });

    it('캐슬링이 합법이면 킹의 합법 수 결과에 캐슬링 목적지가 포함되어야 한다', () => {
      const board = [...Array(64).fill(null)];
      board[SQUARE.E1] = { type: PIECE_TYPE.KING, color: COLOR.WHITE };
      board[SQUARE.H1] = { type: PIECE_TYPE.ROOK, color: COLOR.WHITE };
      board[SQUARE.A1] = { type: PIECE_TYPE.ROOK, color: COLOR.WHITE };
      const state = {
        ...createEmptyState(),
        castlingRights: CASTLE.WHITE_KING_SIDE | CASTLE.WHITE_QUEEN_SIDE,
        board,
      };

      expect(getLegalMoves(SQUARE.E1, state)).toEqual(
        expect.arrayContaining([
          castleKingsideMove(SQUARE.E1, SQUARE.G1),
          castleQueensideMove(SQUARE.E1, SQUARE.C1),
        ]),
      );
    });

    it('흑 캐슬링이 합법이면 킹의 합법 수 결과에 캐슬링 목적지가 포함되어야 한다', () => {
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

      expect(getLegalMoves(SQUARE.E8, state)).toEqual(
        expect.arrayContaining([
          castleKingsideMove(SQUARE.E8, SQUARE.G8),
          castleQueensideMove(SQUARE.E8, SQUARE.C8),
        ]),
      );
    });

    it('앙파상이 합법이면 폰의 합법 수 결과에 앙파상 목적지가 포함되어야 한다', () => {
      const board = [...Array(64).fill(null)];
      board[SQUARE.E1] = { type: PIECE_TYPE.KING, color: COLOR.WHITE };
      board[SQUARE.E8] = { type: PIECE_TYPE.KING, color: COLOR.BLACK };
      board[SQUARE.E5] = { type: PIECE_TYPE.PAWN, color: COLOR.WHITE };
      board[SQUARE.D5] = { type: PIECE_TYPE.PAWN, color: COLOR.BLACK };
      const state = {
        ...createEmptyState(),
        enPassantSquare: SQUARE.D6,
        board,
      };

      expect(getLegalMoves(SQUARE.E5, state)).toContainEqual(
        enPassantMove(SQUARE.E5, SQUARE.D6, SQUARE.D5),
      );
    });

    it('앙파상 후 제거 대상 폰이 사라져 자기 킹이 체크에 노출되면 그 수를 제외해야 한다', () => {
      const board = [...Array(64).fill(null)];
      board[SQUARE.A5] = { type: PIECE_TYPE.KING, color: COLOR.WHITE };
      board[SQUARE.C5] = { type: PIECE_TYPE.PAWN, color: COLOR.WHITE };
      board[SQUARE.D5] = { type: PIECE_TYPE.PAWN, color: COLOR.BLACK };
      board[SQUARE.H5] = { type: PIECE_TYPE.ROOK, color: COLOR.BLACK };
      board[SQUARE.A8] = { type: PIECE_TYPE.KING, color: COLOR.BLACK };
      const state = {
        ...createEmptyState(),
        enPassantSquare: SQUARE.D6,
        board,
      };

      expect(moveTargets(getLegalMoves(SQUARE.C5, state) as Move[])).not.toContain(SQUARE.D6);
    });
  });
});
