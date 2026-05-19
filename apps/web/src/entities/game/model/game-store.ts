// import {
//   COLOR,
//   createInitialGameState,
//   PIECE_TYPE,
//   SQUARE,
//   type GameState,
// } from '@chess-db/shared';
import {
  createInitialGameState,
  positionFingerprint,
  type GameState,
  type History,
} from '@chess-db/shared';
import { create } from 'zustand';

type GameStoreState = {
  gameState: GameState;
  repetitionHistory: History;
  applyGameState: (nextGameState: GameState) => void;
  hydrateGameState: (gameState: GameState, repetitionHistory?: History) => void;
  resetGameState: () => void;
};

type UpdateRepetitionHistory = (repetitionHistory: History, nextGameState: GameState) => History;
type BuildRepetitionHistoryFromStates = (gameStates: readonly GameState[]) => History;

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

export const useGameStore = create<GameStoreState>((set) => {
  const initialGameState = createInitialGameState();

  return {
    gameState: initialGameState,
    repetitionHistory: {},
    applyGameState: (nextGameState: GameState) => {
      set((state) => ({
        gameState: nextGameState,
        repetitionHistory: updateRepetitionHistory(state.repetitionHistory, state.gameState),
      }));
    },
    hydrateGameState: (gameState: GameState, repetitionHistory: History = {}) => {
      set({
        gameState,
        repetitionHistory,
      });
    },
    resetGameState: () => {
      set({
        gameState: createInitialGameState(),
        repetitionHistory: {},
      });
    },
  };
});

const updateRepetitionHistory: UpdateRepetitionHistory = (repetitionHistory, nextGameState) => {
  const fingerprint = positionFingerprint(nextGameState);
  return {
    ...repetitionHistory,
    [fingerprint]: (repetitionHistory[fingerprint] ?? 0) + 1,
  };
};

export const buildRepetitionHistoryFromStates: BuildRepetitionHistoryFromStates = (gameStates) => {
  return gameStates.reduce<History>((repetitionHistory, gameState) => {
    return updateRepetitionHistory(repetitionHistory, gameState);
  }, {});
};

export const selectGameState = (state: GameStoreState) => state.gameState;
export const selectBoardState = (state: GameStoreState) => state.gameState.board;
export const selectCurrentTurn = (state: GameStoreState) => state.gameState.turn;
export const selectApplyGameState = (state: GameStoreState) => state.applyGameState;
export const selectHydrateGameState = (state: GameStoreState) => state.hydrateGameState;
export const selectResetGameState = (state: GameStoreState) => state.resetGameState;
export const selectRepetitionHistory = (state: GameStoreState) => state.repetitionHistory;
