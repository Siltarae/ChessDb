import {
  COLOR,
  GAME_RESULT_STATUS,
  getGameResult,
  REASON,
  type GameResult,
  type GameState,
  type History,
  type Reason,
} from '@chess-db/shared';

export type GameResultStatusView = {
  gameResult: GameResult;
  isGameOver: boolean;
  isDraw: boolean;
  isWhiteWin: boolean;
  isBlackWin: boolean;
  resultReason: Reason | null;
  canStartNewMove: boolean;
};

type UseGameResultStatus = (
  gameState: GameState,
  repetitionHistory: History,
) => GameResultStatusView;

export const useGameResultStatus: UseGameResultStatus = (
  gameState: GameState,
  repetitionHistory: History,
) => {
  const gameResult = getGameResult(gameState, repetitionHistory);
  const isGameOver = gameResult.status === GAME_RESULT_STATUS.FINISHED;
  const isDraw =
    isGameOver &&
    (gameResult.reason === REASON.STALEMATE ||
      gameResult.reason === REASON.FIFTY_MOVE ||
      gameResult.reason === REASON.THREEFOLD_REPETITION ||
      gameResult.reason === REASON.INSUFFICIENT_MATERIAL);

  const isWhiteWin =
    isGameOver && gameResult.reason === 'CHECKMATE' && gameState.turn === COLOR.BLACK;

  const isBlackWin =
    isGameOver && gameResult.reason === 'CHECKMATE' && gameState.turn === COLOR.WHITE;

  return {
    gameResult,
    isGameOver,
    isDraw,
    isWhiteWin,
    isBlackWin,
    resultReason: isGameOver ? gameResult.reason : null,
    canStartNewMove: !isGameOver,
  };
};
