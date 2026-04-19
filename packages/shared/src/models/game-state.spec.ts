import { describe, expect, it } from 'vitest';
import { CASTLE, COLOR, GameStateSchema, PIECE_TYPE, SQUARE } from './game-state.js';

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
});
