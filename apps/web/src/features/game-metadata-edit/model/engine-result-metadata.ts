import {
  COLOR,
  GAME_RECORD_RESULT,
  GAME_RESULT_STATUS,
  GAME_TERMINATION_REASON,
  REASON,
  type GameResult,
  type GameRecordResult,
  type GameTerminationReason,
} from '@chess-db/shared';

export type EngineDerivedGameMetadata = {
  readonly result: GameRecordResult;
  readonly terminationReason: GameTerminationReason;
};

export const toEngineDerivedGameMetadata = (
  gameResult: GameResult,
): EngineDerivedGameMetadata | null => {
  if (gameResult.status === GAME_RESULT_STATUS.ONGOING) {
    return null;
  }

  if (gameResult.reason === REASON.CHECKMATE && gameResult.winner === COLOR.WHITE) {
    return {
      result: GAME_RECORD_RESULT.WHITE_WIN,
      terminationReason: GAME_TERMINATION_REASON.CHECKMATE,
    };
  }

  if (gameResult.reason === REASON.CHECKMATE && gameResult.winner === COLOR.BLACK) {
    return {
      result: GAME_RECORD_RESULT.BLACK_WIN,
      terminationReason: GAME_TERMINATION_REASON.CHECKMATE,
    };
  }

  const drawTerminationReason = toDrawTerminationReason(gameResult.reason);

  return {
    result: GAME_RECORD_RESULT.DRAW,
    terminationReason: drawTerminationReason,
  };
};

const toDrawTerminationReason = (
  reason: Exclude<GameResult, { readonly status: typeof GAME_RESULT_STATUS.ONGOING }>['reason'],
): GameTerminationReason => {
  if (reason === REASON.STALEMATE) {
    return GAME_TERMINATION_REASON.STALEMATE;
  }

  if (reason === REASON.FIFTY_MOVE) {
    return GAME_TERMINATION_REASON.FIFTY_MOVE;
  }

  if (reason === REASON.THREEFOLD_REPETITION) {
    return GAME_TERMINATION_REASON.THREEFOLD_REPETITION;
  }

  if (reason === REASON.INSUFFICIENT_MATERIAL) {
    return GAME_TERMINATION_REASON.INSUFFICIENT_MATERIAL;
  }

  return GAME_TERMINATION_REASON.OTHER;
};
