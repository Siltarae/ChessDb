import {
  COLOR,
  PIECE_TYPE,
  SQUARE,
  createInitialGameState,
  type Board,
  type Piece,
} from '@chess-db/shared';
import { describe, expect, it } from 'vitest';

import { canStartDndMove, isLegalDropTarget } from './board-dnd-guard';

const createBoard = (): Board => createInitialGameState().board;

describe('board dnd guard', () => {
  describe('canStartDndMove', () => {
    it('입력 가능한 현재 턴 아군 기물에서는 drag start를 허용해야 한다', () => {
      expect(
        canStartDndMove({
          boardState: createBoard(),
          turn: COLOR.WHITE,
          sourceSquare: SQUARE.E2,
          isBoardInputDisabled: false,
          pendingPromotionMoveExists: false,
        }),
      ).toBe(true);
    });

    it('보드 입력이 차단된 상태에서는 drag start를 막아야 한다', () => {
      expect(
        canStartDndMove({
          boardState: createBoard(),
          turn: COLOR.WHITE,
          sourceSquare: SQUARE.E2,
          isBoardInputDisabled: true,
          pendingPromotionMoveExists: false,
        }),
      ).toBe(false);
    });

    it('프로모션 선택 대기 상태에서는 drag start를 막아야 한다', () => {
      expect(
        canStartDndMove({
          boardState: createBoard(),
          turn: COLOR.WHITE,
          sourceSquare: SQUARE.E2,
          isBoardInputDisabled: false,
          pendingPromotionMoveExists: true,
        }),
      ).toBe(false);
    });

    it('빈 칸에서는 drag start를 막아야 한다', () => {
      expect(
        canStartDndMove({
          boardState: createBoard(),
          turn: COLOR.WHITE,
          sourceSquare: SQUARE.E4,
          isBoardInputDisabled: false,
          pendingPromotionMoveExists: false,
        }),
      ).toBe(false);
    });

    it('상대 기물에서는 drag start를 막아야 한다', () => {
      expect(
        canStartDndMove({
          boardState: createBoard(),
          turn: COLOR.WHITE,
          sourceSquare: SQUARE.E7,
          isBoardInputDisabled: false,
          pendingPromotionMoveExists: false,
        }),
      ).toBe(false);
    });

    it('현재 턴이 흑이면 흑 기물에서 drag start를 허용해야 한다', () => {
      expect(
        canStartDndMove({
          boardState: createBoard(),
          turn: COLOR.BLACK,
          sourceSquare: SQUARE.E7,
          isBoardInputDisabled: false,
          pendingPromotionMoveExists: false,
        }),
      ).toBe(true);
    });

    it('기물 type이 NONE인 칸은 drag start를 막아야 한다', () => {
      const board = Array.from(createBoard()) as (Piece | null)[];
      board[SQUARE.E4] = { type: PIECE_TYPE.NONE, color: COLOR.WHITE };

      expect(
        canStartDndMove({
          boardState: board as Board,
          turn: COLOR.WHITE,
          sourceSquare: SQUARE.E4,
          isBoardInputDisabled: false,
          pendingPromotionMoveExists: false,
        }),
      ).toBe(false);
    });
  });

  describe('isLegalDropTarget', () => {
    it('drop 대상이 현재 하이라이트 목록에 있으면 허용해야 한다', () => {
      expect(isLegalDropTarget({ targetSquare: SQUARE.E4, highlightSquares: [SQUARE.E4] })).toBe(
        true,
      );
    });

    it('drop 대상이 현재 하이라이트 목록에 없으면 거부해야 한다', () => {
      expect(isLegalDropTarget({ targetSquare: SQUARE.E5, highlightSquares: [SQUARE.E4] })).toBe(
        false,
      );
    });

    it('drop 대상이 없으면 거부해야 한다', () => {
      expect(isLegalDropTarget({ targetSquare: null, highlightSquares: [SQUARE.E4] })).toBe(false);
    });
  });
});
