import { COLOR, PIECE_TYPE, SQUARE, createInitialGameState } from '@chess-db/shared';
import { beforeEach, describe, expect, it } from 'vitest';

import {
  selectApplyGameState,
  selectBoardState,
  selectCurrentTurn,
  selectGameState,
  useGameStore,
} from './game-store';

describe('game-store', () => {
  beforeEach(() => {
    useGameStore.getState().applyGameState(createInitialGameState());
  });

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

    it('현재 턴 selector가 초기 턴을 백으로 제공해야 한다', () => {
      const currentTurn = selectCurrentTurn(useGameStore.getState());

      expect(currentTurn).toBe(COLOR.WHITE);
    });
  });

  describe('외부 GameState를 store에 반영할 때', () => {
    it('action selector로 다음 GameState 전체를 반영하고 현재 턴 selector도 같은 상태의 턴을 읽어야 한다', () => {
      const state = useGameStore.getState();
      const currentGameState = selectGameState(state);
      const applyGameState = selectApplyGameState(state);
      const nextGameState = {
        ...currentGameState,
        turn: COLOR.BLACK,
        fullmoveNumber: currentGameState.fullmoveNumber + 1,
      };

      applyGameState(nextGameState);

      const updatedState = useGameStore.getState();
      expect(selectGameState(updatedState)).toBe(nextGameState);
      expect(selectBoardState(updatedState)).toBe(nextGameState.board);
      expect(selectCurrentTurn(updatedState)).toBe(COLOR.BLACK);
    });
  });
});
