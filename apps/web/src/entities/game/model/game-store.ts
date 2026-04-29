import { createInitialGameState, type GameState } from '@chess-db/shared';
import { create } from 'zustand';

type GameStoreState = {
  gameState: GameState;
  applyGameState: (nextGameState: GameState) => void;
};

export const useGameStore = create<GameStoreState>((set) => ({
  gameState: createInitialGameState(),
  applyGameState: (nextGameState: GameState) => {
    set({ gameState: nextGameState });
  },
}));

export const selectGameState = (state: GameStoreState) => state.gameState;
export const selectBoardState = (state: GameStoreState) => state.gameState.board;
export const selectCurrentTurn = (state: GameStoreState) => state.gameState.turn;
export const selectApplyGameState = (state: GameStoreState) => state.applyGameState;
