import { describe, expect, it } from 'vitest';
import type { GameState } from '../models/game-state.js';
import { COLOR, PIECE_TYPE, SQUARE } from '../models/game-state.js';
import { applyPromotion, isPromotionSquare } from './promotion-engine.js';

const createEmptyState = (): GameState => ({
  board: Array(64).fill(null),
  turn: COLOR.WHITE,
  castlingRights: 0,
  enPassantSquare: null,
  halfmoveClock: 0,
  fullmoveNumber: 1,
});

describe('PromotionEngine', () => {
  describe('isPromotionSquare', () => {
    it('백 폰이 8행에 도달한 칸이면 true를 반환해야 한다', () => {
      expect(isPromotionSquare(SQUARE.E8, COLOR.WHITE)).toBe(true);
    });

    it('흑 폰이 1행에 도달한 칸이면 true를 반환해야 한다', () => {
      expect(isPromotionSquare(SQUARE.D1, COLOR.BLACK)).toBe(true);
    });

    it('마지막 랭크가 아니면 false를 반환해야 한다', () => {
      expect(isPromotionSquare(SQUARE.E7, COLOR.WHITE)).toBe(false);
      expect(isPromotionSquare(SQUARE.D2, COLOR.BLACK)).toBe(false);
    });
  });

  describe('applyPromotion', () => {
    it('출발 칸이 비어 있으면 원본 상태를 그대로 반환해야 한다', () => {
      const state = createEmptyState();

      expect(applyPromotion(SQUARE.E7, SQUARE.E8, state)).toBe(state);
    });

    it('출발 칸 기물이 폰이 아니면 원본 상태를 그대로 반환해야 한다', () => {
      const board = [...Array(64).fill(null)];
      board[SQUARE.E7] = { type: PIECE_TYPE.ROOK, color: COLOR.WHITE };
      const state = { ...createEmptyState(), board };

      expect(applyPromotion(SQUARE.E7, SQUARE.E8, state)).toBe(state);
    });

    it('프로모션 정보가 없으면 기본값으로 퀸 승격을 적용해야 한다', () => {
      const board = [...Array(64).fill(null)];
      board[SQUARE.E7] = { type: PIECE_TYPE.PAWN, color: COLOR.WHITE };
      const state = { ...createEmptyState(), board };

      const nextState = applyPromotion(SQUARE.E7, SQUARE.E8, state);

      expect(nextState).not.toBe(state);
      expect(nextState.board[SQUARE.E7]).toBeNull();
      expect(nextState.board[SQUARE.E8]).toEqual({
        type: PIECE_TYPE.QUEEN,
        color: COLOR.WHITE,
      });
    });

    it.each([
      ['퀸', PIECE_TYPE.QUEEN],
      ['룩', PIECE_TYPE.ROOK],
      ['비숍', PIECE_TYPE.BISHOP],
      ['나이트', PIECE_TYPE.KNIGHT],
    ])(
      '선택한 승격 기물 타입이 %s이면 해당 기물로 프로모션을 적용해야 한다',
      (_name, pieceType) => {
        const board = [...Array(64).fill(null)];
        board[SQUARE.D2] = { type: PIECE_TYPE.PAWN, color: COLOR.BLACK };
        const state = {
          ...createEmptyState(),
          turn: COLOR.BLACK,
          board,
        };

        const nextState = applyPromotion(SQUARE.D2, SQUARE.D1, state, pieceType);

        expect(nextState.board[SQUARE.D2]).toBeNull();
        expect(nextState.board[SQUARE.D1]).toEqual({
          type: pieceType,
          color: COLOR.BLACK,
        });
      },
    );

    it('상대 기물을 잡으면서 마지막 랭크에 도달한 경우에도 프로모션을 적용해야 한다', () => {
      const board = [...Array(64).fill(null)];
      board[SQUARE.G7] = { type: PIECE_TYPE.PAWN, color: COLOR.WHITE };
      board[SQUARE.H8] = { type: PIECE_TYPE.ROOK, color: COLOR.BLACK };
      const state = { ...createEmptyState(), board };

      const nextState = applyPromotion(SQUARE.G7, SQUARE.H8, state, PIECE_TYPE.BISHOP);

      expect(nextState.board[SQUARE.G7]).toBeNull();
      expect(nextState.board[SQUARE.H8]).toEqual({
        type: PIECE_TYPE.BISHOP,
        color: COLOR.WHITE,
      });
    });

    it('마지막 랭크가 아니면 원본 상태를 그대로 반환해야 한다', () => {
      const board = [...Array(64).fill(null)];
      board[SQUARE.E6] = { type: PIECE_TYPE.PAWN, color: COLOR.WHITE };
      const state = { ...createEmptyState(), board };

      expect(applyPromotion(SQUARE.E6, SQUARE.E7, state)).toBe(state);
    });

    it('허용되지 않은 승격 기물 타입이면 원본 상태를 그대로 반환해야 한다', () => {
      const board = [...Array(64).fill(null)];
      board[SQUARE.E7] = { type: PIECE_TYPE.PAWN, color: COLOR.WHITE };
      const state = { ...createEmptyState(), board };

      expect(applyPromotion(SQUARE.E7, SQUARE.E8, state, PIECE_TYPE.KING)).toBe(state);
      expect(applyPromotion(SQUARE.E7, SQUARE.E8, state, PIECE_TYPE.PAWN)).toBe(state);
    });

    it('프로모션 후에도 원본 state와 board는 오염되지 않아야 한다', () => {
      const board = [...Array(64).fill(null)];
      board[SQUARE.G7] = { type: PIECE_TYPE.PAWN, color: COLOR.WHITE };
      board[SQUARE.H8] = { type: PIECE_TYPE.ROOK, color: COLOR.BLACK };
      const state = { ...createEmptyState(), board };
      const originalBoard = [...state.board];

      const nextState = applyPromotion(SQUARE.G7, SQUARE.H8, state, PIECE_TYPE.QUEEN);

      expect(nextState.board).not.toBe(state.board);
      expect(state.board).toEqual(originalBoard);
      expect(state.board[SQUARE.G7]).toEqual({ type: PIECE_TYPE.PAWN, color: COLOR.WHITE });
      expect(state.board[SQUARE.H8]).toEqual({ type: PIECE_TYPE.ROOK, color: COLOR.BLACK });
    });
  });
});
