import { COLOR, PIECE_TYPE, SQUARE } from '@chess-db/shared';
import { describe, expect, it } from 'vitest';

import { selectBoardState, selectGameState, useGameStore } from './game-store';

describe('game-store', () => {
  describe('useGameStore로 초기 상태를 만들 때', () => {
    it('shared 초기 GameState를 소비해 표준 시작 보드를 제공해야 한다', () => {
      const state = useGameStore.getState();
      const gameState = selectGameState(state);
      const boardState = selectBoardState(state);

      expect(gameState.turn).toBe(COLOR.WHITE);
      expect(boardState).toBe(gameState.board);
      expect(boardState).toHaveLength(64);
      expect(boardState[SQUARE.A1]).toEqual({ type: PIECE_TYPE.ROOK, color: COLOR.WHITE });
      expect(boardState[SQUARE.E8]).toEqual({ type: PIECE_TYPE.KING, color: COLOR.BLACK });
    });
  });
});
