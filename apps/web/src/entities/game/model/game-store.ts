import { createInitialGameState, type GameState } from '@chess-db/shared';
import { create } from 'zustand';

type GameStoreState = {
  gameState: GameState;
};

export const useGameStore = create<GameStoreState>(() => ({
  gameState: createInitialGameState(),
}));

export const selectGameState = (state: GameStoreState) => state.gameState;
export const selectBoardState = (state: GameStoreState) => state.gameState.board;
