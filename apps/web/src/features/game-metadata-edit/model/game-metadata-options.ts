import {
  GAME_RECORD_RESULT,
  GAME_TERMINATION_REASON,
  type GameRecordResult,
  type GameTerminationReason,
} from '@chess-db/shared';

export type GameResultOption = {
  readonly result: GameRecordResult;
  readonly label: string;
};

export type GameTerminationReasonOption = {
  readonly terminationReason: GameTerminationReason;
  readonly label: string;
};

export const gameResultOptions: readonly GameResultOption[] = [
  {
    result: GAME_RECORD_RESULT.WHITE_WIN,
    label: '1-0',
  },
  {
    result: GAME_RECORD_RESULT.BLACK_WIN,
    label: '0-1',
  },
  {
    result: GAME_RECORD_RESULT.DRAW,
    label: '1/2-1/2',
  },
];

export const decisiveTerminationReasonOptions: readonly GameTerminationReasonOption[] = [
  {
    terminationReason: GAME_TERMINATION_REASON.CHECKMATE,
    label: '체크메이트',
  },
  {
    terminationReason: GAME_TERMINATION_REASON.RESIGNATION,
    label: '기권',
  },
  {
    terminationReason: GAME_TERMINATION_REASON.TIMEOUT,
    label: '시간패',
  },
  {
    terminationReason: GAME_TERMINATION_REASON.OTHER,
    label: '기타',
  },
];

export const drawTerminationReasonOptions: readonly GameTerminationReasonOption[] = [
  {
    terminationReason: GAME_TERMINATION_REASON.STALEMATE,
    label: '스테일메이트',
  },
  {
    terminationReason: GAME_TERMINATION_REASON.FIFTY_MOVE,
    label: '50수 규칙',
  },
  {
    terminationReason: GAME_TERMINATION_REASON.THREEFOLD_REPETITION,
    label: '3회 반복',
  },
  {
    terminationReason: GAME_TERMINATION_REASON.INSUFFICIENT_MATERIAL,
    label: '기물 부족',
  },
  {
    terminationReason: GAME_TERMINATION_REASON.AGREEMENT,
    label: '무승부 합의',
  },
  {
    terminationReason: GAME_TERMINATION_REASON.OTHER,
    label: '기타',
  },
];

export const getTerminationReasonOptionsByResult = (
  result: GameRecordResult | null,
): readonly GameTerminationReasonOption[] => {
  if (result === GAME_RECORD_RESULT.DRAW) {
    return drawTerminationReasonOptions;
  }

  if (result === GAME_RECORD_RESULT.WHITE_WIN || result === GAME_RECORD_RESULT.BLACK_WIN) {
    return decisiveTerminationReasonOptions;
  }

  return [];
};

export const isTerminationReasonAllowedForResult = (
  result: GameRecordResult | null,
  terminationReason: GameTerminationReason | null,
): boolean => {
  if (terminationReason === null) {
    return true;
  }

  return getTerminationReasonOptionsByResult(result).some(
    (option) => option.terminationReason === terminationReason,
  );
};
