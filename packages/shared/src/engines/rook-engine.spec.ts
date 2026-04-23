import { describe, expect, it } from 'vitest';
import type { GameState, Move } from '../models/game-state.js';
import { COLOR, PIECE_TYPE, SQUARE } from '../models/game-state.js';
import { moveTargets } from '../test-utils/move-test-helpers.js';
import { getRookMoves } from './rook-engine.js';

const createEmptyState = (): GameState => ({
  board: Array(64).fill(null),
  turn: COLOR.WHITE,
  castlingRights: 0,
  enPassantSquare: null,
  halfmoveClock: 0,
  fullmoveNumber: 1,
});

describe('RookEngine', () => {
  describe('getRookMoves', () => {
    it('빈 보드 중앙(D4)에서 14개의 수평/수직 위치를 반환해야 한다', () => {
      const board = [...Array(64).fill(null)];
      board[SQUARE.D4] = { type: PIECE_TYPE.ROOK, color: COLOR.WHITE };
      const state = { ...createEmptyState(), board };

      const moves = getRookMoves(SQUARE.D4, state);

      expect(moveTargets(moves as Move[])).toEqual([
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

    it('동일한 파일 또는 랭크의 아군 기물에 의해 이동이 제한되어야 한다', () => {
      const board = [...Array(64).fill(null)];
      board[SQUARE.D4] = { type: PIECE_TYPE.ROOK, color: COLOR.WHITE };
      board[SQUARE.D6] = { type: PIECE_TYPE.PAWN, color: COLOR.WHITE };
      board[SQUARE.B4] = { type: PIECE_TYPE.KNIGHT, color: COLOR.WHITE };
      const state = { ...createEmptyState(), board };

      const moves = getRookMoves(SQUARE.D4, state);

      const targets = moveTargets(moves as Move[]);
      expect(targets).toEqual([
        SQUARE.D5,
        SQUARE.D3,
        SQUARE.D2,
        SQUARE.D1,
        SQUARE.E4,
        SQUARE.F4,
        SQUARE.G4,
        SQUARE.H4,
        SQUARE.C4,
      ]);
      expect(targets).not.toContain(SQUARE.D6);
      expect(targets).not.toContain(SQUARE.B4);
    });

    it('상대 기물을 캡처하는 칸까지 포함하고 그 뒤는 차단되어야 한다', () => {
      const board = [...Array(64).fill(null)];
      board[SQUARE.D4] = { type: PIECE_TYPE.ROOK, color: COLOR.WHITE };
      board[SQUARE.D6] = { type: PIECE_TYPE.PAWN, color: COLOR.BLACK };
      board[SQUARE.D8] = { type: PIECE_TYPE.QUEEN, color: COLOR.BLACK };
      board[SQUARE.B4] = { type: PIECE_TYPE.BISHOP, color: COLOR.BLACK };
      board[SQUARE.A4] = { type: PIECE_TYPE.KNIGHT, color: COLOR.BLACK };
      const state = { ...createEmptyState(), board };

      const moves = getRookMoves(SQUARE.D4, state);

      const targets = moveTargets(moves as Move[]);
      expect(targets).toEqual([
        SQUARE.D5,
        SQUARE.D6,
        SQUARE.D3,
        SQUARE.D2,
        SQUARE.D1,
        SQUARE.E4,
        SQUARE.F4,
        SQUARE.G4,
        SQUARE.H4,
        SQUARE.C4,
        SQUARE.B4,
      ]);
      expect(targets).not.toContain(SQUARE.D8);
      expect(targets).not.toContain(SQUARE.A4);
    });

    it('바로 옆 칸이 아군이면 그 방향은 0칸이어야 한다', () => {
      const board = [...Array(64).fill(null)];
      board[SQUARE.D4] = { type: PIECE_TYPE.ROOK, color: COLOR.WHITE };
      board[SQUARE.D5] = { type: PIECE_TYPE.PAWN, color: COLOR.WHITE };
      const state = { ...createEmptyState(), board };

      const moves = getRookMoves(SQUARE.D4, state);

      const targets = moveTargets(moves as Move[]);
      expect(targets).toEqual([
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
      expect(targets).not.toContain(SQUARE.D5);
    });

    it('바로 옆 칸이 적군이면 그 칸만 포함하고 즉시 종료해야 한다', () => {
      const board = [...Array(64).fill(null)];
      board[SQUARE.D4] = { type: PIECE_TYPE.ROOK, color: COLOR.WHITE };
      board[SQUARE.D5] = { type: PIECE_TYPE.PAWN, color: COLOR.BLACK };
      board[SQUARE.D6] = { type: PIECE_TYPE.QUEEN, color: COLOR.BLACK };
      const state = { ...createEmptyState(), board };

      const moves = getRookMoves(SQUARE.D4, state);

      const targets = moveTargets(moves as Move[]);
      expect(targets).toEqual([
        SQUARE.D5,
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
      expect(targets).not.toContain(SQUARE.D6);
    });

    it('코너 시작 칸에서는 가능한 직선 방향만 결과에 포함해야 한다', () => {
      const board = [...Array(64).fill(null)];
      board[SQUARE.A1] = { type: PIECE_TYPE.ROOK, color: COLOR.WHITE };
      const state = { ...createEmptyState(), board };

      const moves = getRookMoves(SQUARE.A1, state);

      expect(moveTargets(moves as Move[])).toEqual([
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

    it('선택한 칸에 룩이 아닌 기물이 있으면 빈 배열을 반환해야 한다', () => {
      const board = [...Array(64).fill(null)];
      board[SQUARE.D4] = { type: PIECE_TYPE.BISHOP, color: COLOR.WHITE };
      const state = { ...createEmptyState(), board };

      const moves = getRookMoves(SQUARE.D4, state);

      expect(moves).toEqual([]);
    });

    it('흑 룩도 자신의 색 기준으로 아군과 적군을 구분해야 한다', () => {
      const board = [...Array(64).fill(null)];
      board[SQUARE.E5] = { type: PIECE_TYPE.ROOK, color: COLOR.BLACK };
      board[SQUARE.E6] = { type: PIECE_TYPE.PAWN, color: COLOR.BLACK };
      board[SQUARE.E4] = { type: PIECE_TYPE.KNIGHT, color: COLOR.WHITE };
      board[SQUARE.E3] = { type: PIECE_TYPE.BISHOP, color: COLOR.WHITE };
      const state = { ...createEmptyState(), turn: COLOR.BLACK, board };

      const moves = getRookMoves(SQUARE.E5, state);

      const targets = moveTargets(moves as Move[]);
      expect(targets).toEqual([
        SQUARE.E4,
        SQUARE.F5,
        SQUARE.G5,
        SQUARE.H5,
        SQUARE.D5,
        SQUARE.C5,
        SQUARE.B5,
        SQUARE.A5,
      ]);
      expect(targets).not.toContain(SQUARE.E6);
      expect(targets).not.toContain(SQUARE.E3);
    });
  });
});
