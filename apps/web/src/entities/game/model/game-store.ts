// import {
//   COLOR,
//   createInitialGameState,
//   PIECE_TYPE,
//   SQUARE,
//   type GameState,
// } from '@chess-db/shared';
import { createInitialGameState, type GameState } from '@chess-db/shared';
import { create } from 'zustand';

type GameStoreState = {
  gameState: GameState;
  applyGameState: (nextGameState: GameState) => void;
};

// const createTestGameState = () => {
//   const gameState = createInitialGameState();
//   const newBoard = Array(64).fill(null);
//   const newEnPassant = SQUARE.C6;

//   newBoard[SQUARE.E4] = { type: PIECE_TYPE.BISHOP, color: COLOR.WHITE };
//   newBoard[SQUARE.F5] = { type: PIECE_TYPE.PAWN, color: COLOR.BLACK };
//   newBoard[SQUARE.D5] = { type: PIECE_TYPE.PAWN, color: COLOR.WHITE };
//   newBoard[SQUARE.E6] = { type: PIECE_TYPE.QUEEN, color: COLOR.BLACK };
//   newBoard[SQUARE.C5] = { type: PIECE_TYPE.PAWN, color: COLOR.BLACK };
//   newBoard[SQUARE.E1] = { type: PIECE_TYPE.KING, color: COLOR.WHITE };

//   return {
//     ...gameState,
//     enPassantSquare: newEnPassant,
//     board: newBoard,
//   };
// };

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
