import { describe, expect, it } from 'vitest';
import {
  CASTLE,
  COLOR,
  createInitialGameState,
  GameStateSchema,
  PIECE_TYPE,
  SQUARE,
} from './game-state.js';
import type { Piece, Square } from './game-state.js';

// [1] Mock 데이터 및 Fixture 분리
const VALID_INITIAL_STATE = {
  board: Array(64).fill(null),
  turn: COLOR.WHITE,
  castlingRights:
    CASTLE.WHITE_KING_SIDE |
    CASTLE.WHITE_QUEEN_SIDE |
    CASTLE.BLACK_KING_SIDE |
    CASTLE.BLACK_QUEEN_SIDE,
  enPassantSquare: null,
  halfmoveClock: 0,
  fullmoveNumber: 1,
};

const ALL_CASTLING_RIGHTS =
  CASTLE.WHITE_KING_SIDE |
  CASTLE.WHITE_QUEEN_SIDE |
  CASTLE.BLACK_KING_SIDE |
  CASTLE.BLACK_QUEEN_SIDE;

const WHITE_BACK_RANK: readonly Square[] = [
  SQUARE.A1,
  SQUARE.B1,
  SQUARE.C1,
  SQUARE.D1,
  SQUARE.E1,
  SQUARE.F1,
  SQUARE.G1,
  SQUARE.H1,
];

const BLACK_BACK_RANK: readonly Square[] = [
  SQUARE.A8,
  SQUARE.B8,
  SQUARE.C8,
  SQUARE.D8,
  SQUARE.E8,
  SQUARE.F8,
  SQUARE.G8,
  SQUARE.H8,
];

const WHITE_PAWN_RANK: readonly Square[] = [
  SQUARE.A2,
  SQUARE.B2,
  SQUARE.C2,
  SQUARE.D2,
  SQUARE.E2,
  SQUARE.F2,
  SQUARE.G2,
  SQUARE.H2,
];

const BLACK_PAWN_RANK: readonly Square[] = [
  SQUARE.A7,
  SQUARE.B7,
  SQUARE.C7,
  SQUARE.D7,
  SQUARE.E7,
  SQUARE.F7,
  SQUARE.G7,
  SQUARE.H7,
];

const BACK_RANK_PIECE_TYPES = [
  PIECE_TYPE.ROOK,
  PIECE_TYPE.KNIGHT,
  PIECE_TYPE.BISHOP,
  PIECE_TYPE.QUEEN,
  PIECE_TYPE.KING,
  PIECE_TYPE.BISHOP,
  PIECE_TYPE.KNIGHT,
  PIECE_TYPE.ROOK,
] as const;

const expectPieceAt = (
  board: readonly (Piece | null)[],
  square: Square,
  type: Piece['type'],
  color: Piece['color'],
) => {
  expect(board[square]).toEqual({ type, color });
};

const getBackRankPieceType = (index: number): Piece['type'] => {
  const pieceType = BACK_RANK_PIECE_TYPES[index];

  if (pieceType === undefined) {
    throw new Error(`잘못된 백랭크 fixture 인덱스입니다: ${index}`);
  }

  return pieceType;
};

describe('GameStateModel', () => {
  describe('데이터 모델 상수를 확인할 때', () => {
    it('COLOR 상수는 숫자 0(WHITE)과 1(BLACK)을 가져야 한다', () => {
      expect(COLOR.WHITE).toBe(0);
      expect(COLOR.BLACK).toBe(1);
    });

    it('PIECE_TYPE 상수는 NONE(0)과 폰에서 킹까지 1~6의 숫자로 정의되어야 한다', () => {
      expect(PIECE_TYPE.NONE).toBe(0);
      expect(PIECE_TYPE.PAWN).toBe(1);
      expect(PIECE_TYPE.KING).toBe(6);
    });

    it('CASTLE 상수는 비트 연산이 가능한 2의 거듭제곱 값이어야 한다', () => {
      expect(CASTLE.WHITE_KING_SIDE).toBe(1);
      expect(CASTLE.WHITE_QUEEN_SIDE).toBe(2);
      expect(CASTLE.BLACK_KING_SIDE).toBe(4);
      expect(CASTLE.BLACK_QUEEN_SIDE).toBe(8);
    });

    it('SQUARE 상수는 A1(0)부터 H8(63)까지의 인덱스를 올바르게 매핑해야 한다', () => {
      expect(SQUARE.A1).toBe(0);
      expect(SQUARE.H8).toBe(63);
    });
  });

  describe('GameStateSchema를 통해 데이터를 검증할 때', () => {
    it('유효한 초기 게임 상태 객체는 검증을 통과해야 한다', () => {
      const result = GameStateSchema.safeParse(VALID_INITIAL_STATE);

      expect(result.success).toBe(true);
    });

    it('보드 배열의 크기가 64가 아니면 검증에 실패해야 한다', () => {
      const invalidState = { ...VALID_INITIAL_STATE, board: Array(63).fill(null) };

      const result = GameStateSchema.safeParse(invalidState);

      expect(result.success).toBe(false);
    });

    it('캐슬링 권한(castlingRights)이 숫자가 아니면 검증에 실패해야 한다', () => {
      const invalidState = { ...VALID_INITIAL_STATE, castlingRights: { white: true } };

      const result = GameStateSchema.safeParse(invalidState);

      expect(result.success).toBe(false);
    });

    it('기물의 타입이나 색상이 유효한 숫자 값이 아니면 검증에 실패해야 한다', () => {
      const invalidState = {
        ...VALID_INITIAL_STATE,
        board: [...VALID_INITIAL_STATE.board],
      };
      invalidState.board[0] = { type: 99, color: COLOR.WHITE };

      const result = GameStateSchema.safeParse(invalidState);

      expect(result.success).toBe(false);
    });
  });

  describe('createInitialGameState로 표준 시작 포지션을 생성할 때', () => {
    it('GameStateSchema 검증을 통과하는 상태를 반환해야 한다', () => {
      const state = createInitialGameState();

      const result = GameStateSchema.safeParse(state);

      expect(result.success).toBe(true);
    });

    it('64칸 보드와 32개 기물을 포함해야 한다', () => {
      const state = createInitialGameState();

      const pieces = state.board.filter((piece) => piece !== null);

      expect(state.board).toHaveLength(64);
      expect(pieces).toHaveLength(32);
    });

    it('흰색 기물을 1랭크와 2랭크 표준 시작 위치에 배치해야 한다', () => {
      const state = createInitialGameState();

      WHITE_BACK_RANK.forEach((square, index) => {
        expectPieceAt(state.board, square, getBackRankPieceType(index), COLOR.WHITE);
      });
      WHITE_PAWN_RANK.forEach((square) => {
        expectPieceAt(state.board, square, PIECE_TYPE.PAWN, COLOR.WHITE);
      });
    });

    it('검은색 기물을 7랭크와 8랭크 표준 시작 위치에 배치해야 한다', () => {
      const state = createInitialGameState();

      BLACK_PAWN_RANK.forEach((square) => {
        expectPieceAt(state.board, square, PIECE_TYPE.PAWN, COLOR.BLACK);
      });
      BLACK_BACK_RANK.forEach((square, index) => {
        expectPieceAt(state.board, square, getBackRankPieceType(index), COLOR.BLACK);
      });
    });

    it('시작 차례, 캐슬링 권한, 앙파상 칸, 수 카운터 기본값을 가져야 한다', () => {
      const state = createInitialGameState();

      expect(state.turn).toBe(COLOR.WHITE);
      expect(state.castlingRights).toBe(ALL_CASTLING_RIGHTS);
      expect(state.enPassantSquare).toBeNull();
      expect(state.halfmoveClock).toBe(0);
      expect(state.fullmoveNumber).toBe(1);
    });

    it('호출 간 board 참조가 공유되어 오염되지 않아야 한다', () => {
      const firstState = createInitialGameState();
      const secondState = createInitialGameState();

      const mutableBoard = firstState.board as (Piece | null)[];
      mutableBoard[SQUARE.A1] = null;

      expect(firstState.board).not.toBe(secondState.board);
      expectPieceAt(secondState.board, SQUARE.A1, PIECE_TYPE.ROOK, COLOR.WHITE);
    });
  });
});
