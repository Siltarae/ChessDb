import {
  GAME_RESULT_STATUS,
  getGameResult,
  type GameResult,
  type GameState,
  type History,
  type Reason,
} from '@chess-db/shared';

type GameResultStatusView = {
  gameResult: GameResult;
  isGameOver: boolean;
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

  return {
    gameResult,
    isGameOver,
    resultReason: isGameOver ? gameResult.reason : null,
    canStartNewMove: !isGameOver,
  };
};
