import { describe, expect, it } from 'vitest';
import { executeMove } from '../engines/move-executor.js';
import type { Color, GameState, Move, Piece, Square } from '../models/game-state.js';
import { CASTLE, COLOR, PIECE_TYPE, SQUARE } from '../models/game-state.js';
import {
  castleKingsideMove,
  castleQueensideMove,
  doublePawnPushMove,
  enPassantMove,
  normalMove,
} from '../test-utils/move-test-helpers.js';
import { convertToSan } from './san-converter.js';

type PieceOnSquare = readonly [Square, Piece];

const WHITE_KING: Piece = { type: PIECE_TYPE.KING, color: COLOR.WHITE };
const BLACK_KING: Piece = { type: PIECE_TYPE.KING, color: COLOR.BLACK };
const WHITE_PAWN: Piece = { type: PIECE_TYPE.PAWN, color: COLOR.WHITE };
const BLACK_PAWN: Piece = { type: PIECE_TYPE.PAWN, color: COLOR.BLACK };
const WHITE_KNIGHT: Piece = { type: PIECE_TYPE.KNIGHT, color: COLOR.WHITE };
const WHITE_BISHOP: Piece = { type: PIECE_TYPE.BISHOP, color: COLOR.WHITE };
const WHITE_ROOK: Piece = { type: PIECE_TYPE.ROOK, color: COLOR.WHITE };
const WHITE_QUEEN: Piece = { type: PIECE_TYPE.QUEEN, color: COLOR.WHITE };
const BLACK_ROOK: Piece = { type: PIECE_TYPE.ROOK, color: COLOR.BLACK };

const createEmptyState = (turn: Color = COLOR.WHITE): GameState => ({
  board: Array(64).fill(null),
  turn,
  castlingRights: 0,
  enPassantSquare: null,
  halfmoveClock: 0,
  fullmoveNumber: 1,
});

const createStateWithPieces = (
  pieces: readonly PieceOnSquare[],
  overrides: Partial<Omit<GameState, 'board'>> = {},
): GameState => {
  const board = Array(64).fill(null);

  for (const [square, piece] of pieces) {
    board[square] = piece;
  }

  return {
    ...createEmptyState(),
    ...overrides,
    board,
  };
};

const convertExecutedMove = (state: GameState, move: Move): string => {
  const nextState = executeMove(state, move);

  return convertToSan(state, move, nextState);
};

describe('convertToSan', () => {
  describe('일반 폰 이동을 변환할 때', () => {
    it('일반 폰 이동을 e4로 변환한다', () => {
      const state = createStateWithPieces([
        [SQUARE.E1, WHITE_KING],
        [SQUARE.E8, BLACK_KING],
        [SQUARE.E2, WHITE_PAWN],
      ]);

      const san = convertExecutedMove(state, doublePawnPushMove(SQUARE.E2, SQUARE.E4));

      expect(san).toBe('e4');
    });
  });

  describe('기물 이동을 변환할 때', () => {
    it('킹 이동을 Kd2로 변환한다', () => {
      const state = createStateWithPieces([
        [SQUARE.E1, WHITE_KING],
        [SQUARE.E8, BLACK_KING],
      ]);

      const san = convertExecutedMove(state, normalMove(SQUARE.E1, SQUARE.D2));

      expect(san).toBe('Kd2');
    });
  });

  describe('캡처를 변환할 때', () => {
    it('폰 캡처를 exd5로 변환한다', () => {
      const state = createStateWithPieces([
        [SQUARE.E1, WHITE_KING],
        [SQUARE.E8, BLACK_KING],
        [SQUARE.E4, WHITE_PAWN],
        [SQUARE.D5, BLACK_PAWN],
      ]);

      const san = convertExecutedMove(state, normalMove(SQUARE.E4, SQUARE.D5));

      expect(san).toBe('exd5');
    });

    it('기물 캡처를 Bxf7로 변환한다', () => {
      const state = createStateWithPieces([
        [SQUARE.E1, WHITE_KING],
        [SQUARE.H8, BLACK_KING],
        [SQUARE.C4, WHITE_BISHOP],
        [SQUARE.F7, BLACK_PAWN],
      ]);

      const san = convertExecutedMove(state, normalMove(SQUARE.C4, SQUARE.F7));

      expect(san).toBe('Bxf7');
    });

    it('앙파상 캡처를 exd6으로 변환한다', () => {
      const state = createStateWithPieces(
        [
          [SQUARE.E1, WHITE_KING],
          [SQUARE.E8, BLACK_KING],
          [SQUARE.E5, WHITE_PAWN],
          [SQUARE.D5, BLACK_PAWN],
        ],
        {
          enPassantSquare: SQUARE.D6,
        },
      );

      const san = convertExecutedMove(state, enPassantMove(SQUARE.E5, SQUARE.D6, SQUARE.D5));

      expect(san).toBe('exd6');
    });
  });

  describe('캐슬링을 변환할 때', () => {
    it('킹사이드 캐슬링을 O-O로 변환한다', () => {
      const state = createStateWithPieces(
        [
          [SQUARE.E1, WHITE_KING],
          [SQUARE.H1, WHITE_ROOK],
          [SQUARE.E8, BLACK_KING],
        ],
        {
          castlingRights: CASTLE.WHITE_KING_SIDE,
        },
      );

      const san = convertExecutedMove(state, castleKingsideMove(SQUARE.E1, SQUARE.G1));

      expect(san).toBe('O-O');
    });

    it('킹사이드 캐슬링이 체크를 만들면 O-O+로 변환한다', () => {
      const state = createStateWithPieces(
        [
          [SQUARE.E1, WHITE_KING],
          [SQUARE.H1, WHITE_ROOK],
          [SQUARE.F8, BLACK_KING],
        ],
        {
          castlingRights: CASTLE.WHITE_KING_SIDE,
        },
      );

      const san = convertExecutedMove(state, castleKingsideMove(SQUARE.E1, SQUARE.G1));

      expect(san).toBe('O-O+');
    });

    it('킹사이드 캐슬링이 체크메이트를 만들면 O-O#로 변환한다', () => {
      const state = createStateWithPieces(
        [
          [SQUARE.E1, WHITE_KING],
          [SQUARE.H1, WHITE_ROOK],
          [SQUARE.D7, WHITE_QUEEN],
          [SQUARE.C4, WHITE_BISHOP],
          [SQUARE.D4, WHITE_BISHOP],
          [SQUARE.F8, BLACK_KING],
          [SQUARE.A6, BLACK_PAWN],
        ],
        {
          castlingRights: CASTLE.WHITE_KING_SIDE,
        },
      );

      const san = convertExecutedMove(state, castleKingsideMove(SQUARE.E1, SQUARE.G1));

      expect(san).toBe('O-O#');
    });

    it('퀸사이드 캐슬링을 O-O-O로 변환한다', () => {
      const state = createStateWithPieces(
        [
          [SQUARE.E1, WHITE_KING],
          [SQUARE.A1, WHITE_ROOK],
          [SQUARE.E8, BLACK_KING],
        ],
        {
          castlingRights: CASTLE.WHITE_QUEEN_SIDE,
        },
      );

      const san = convertExecutedMove(state, castleQueensideMove(SQUARE.E1, SQUARE.C1));

      expect(san).toBe('O-O-O');
    });
  });

  describe('프로모션을 변환할 때', () => {
    it('프로모션을 e8=Q로 변환한다', () => {
      const state = createStateWithPieces([
        [SQUARE.A1, WHITE_KING],
        [SQUARE.H7, BLACK_KING],
        [SQUARE.E7, WHITE_PAWN],
      ]);

      const san = convertExecutedMove(state, normalMove(SQUARE.E7, SQUARE.E8, PIECE_TYPE.QUEEN));

      expect(san).toBe('e8=Q');
    });

    it('프로모션 캡처를 exd8=N으로 변환한다', () => {
      const state = createStateWithPieces([
        [SQUARE.A1, WHITE_KING],
        [SQUARE.H8, BLACK_KING],
        [SQUARE.E7, WHITE_PAWN],
        [SQUARE.D8, BLACK_ROOK],
      ]);

      const san = convertExecutedMove(state, normalMove(SQUARE.E7, SQUARE.D8, PIECE_TYPE.KNIGHT));

      expect(san).toBe('exd8=N');
    });
  });

  describe('체크와 체크메이트 suffix를 변환할 때', () => {
    it('체크 suffix +를 붙인다', () => {
      const state = createStateWithPieces([
        [SQUARE.A1, WHITE_KING],
        [SQUARE.E8, BLACK_KING],
        [SQUARE.A7, WHITE_ROOK],
      ]);

      const san = convertExecutedMove(state, normalMove(SQUARE.A7, SQUARE.E7));

      expect(san).toBe('Re7+');
    });

    it('체크메이트 suffix #를 붙인다', () => {
      const state = createStateWithPieces([
        [SQUARE.F6, WHITE_KING],
        [SQUARE.G6, WHITE_QUEEN],
        [SQUARE.H8, BLACK_KING],
      ]);

      const san = convertExecutedMove(state, normalMove(SQUARE.G6, SQUARE.G7));

      expect(san).toBe('Qg7#');
    });
  });

  describe('모호한 기물 이동을 변환할 때', () => {
    it('출발 파일만으로 구분 가능하면 파일 식별자를 붙인다', () => {
      const state = createStateWithPieces([
        [SQUARE.E1, WHITE_KING],
        [SQUARE.H8, BLACK_KING],
        [SQUARE.B6, WHITE_KNIGHT],
        [SQUARE.F6, WHITE_KNIGHT],
        [SQUARE.H1, WHITE_KNIGHT],
      ]);

      const san = convertExecutedMove(state, normalMove(SQUARE.B6, SQUARE.D7));

      expect(san).toBe('Nbd7');
    });

    it('출발 파일만으로 구분할 수 없으면 랭크 식별자를 붙인다', () => {
      const state = createStateWithPieces([
        [SQUARE.E1, WHITE_KING],
        [SQUARE.E8, BLACK_KING],
        [SQUARE.B6, WHITE_KNIGHT],
        [SQUARE.B8, WHITE_KNIGHT],
      ]);

      const san = convertExecutedMove(state, normalMove(SQUARE.B6, SQUARE.D7));

      expect(san).toBe('N6d7');
    });

    it('파일과 랭크가 모두 필요하면 전체 출발 칸 식별자를 붙인다', () => {
      const state = createStateWithPieces([
        [SQUARE.E1, WHITE_KING],
        [SQUARE.H8, BLACK_KING],
        [SQUARE.B6, WHITE_KNIGHT],
        [SQUARE.B8, WHITE_KNIGHT],
        [SQUARE.F6, WHITE_KNIGHT],
      ]);

      const san = convertExecutedMove(state, normalMove(SQUARE.B6, SQUARE.D7));

      expect(san).toBe('Nb6d7');
    });

    it('다른 후보가 같은 파일과 랭크에 모두 없으면 출발 파일 식별자를 붙인다', () => {
      const state = createStateWithPieces([
        [SQUARE.E1, WHITE_KING],
        [SQUARE.H8, BLACK_KING],
        [SQUARE.B6, WHITE_KNIGHT],
        [SQUARE.F8, WHITE_KNIGHT],
      ]);

      const san = convertExecutedMove(state, normalMove(SQUARE.B6, SQUARE.D7));

      expect(san).toBe('Nbd7');
    });
  });

  describe('변환할 수 없는 입력을 받을 때', () => {
    it('출발 칸에 기물이 없으면 예외를 던진다', () => {
      const state = createStateWithPieces([
        [SQUARE.E1, WHITE_KING],
        [SQUARE.E8, BLACK_KING],
      ]);

      expect(() => convertToSan(state, normalMove(SQUARE.D4, SQUARE.D5), state)).toThrow(
        'Cannot convert SAN without a piece on source square: 27',
      );
    });

    it('알 수 없는 기물 타입이면 예외를 던진다', () => {
      const unknownPiece = { type: 999 as never, color: COLOR.WHITE };
      const state = createStateWithPieces([
        [SQUARE.E1, WHITE_KING],
        [SQUARE.E8, BLACK_KING],
        [SQUARE.D4, unknownPiece],
      ]);

      expect(() => convertToSan(state, normalMove(SQUARE.D4, SQUARE.D5), state)).toThrow(
        'Unknown piece type: 999',
      );
    });
  });
});
