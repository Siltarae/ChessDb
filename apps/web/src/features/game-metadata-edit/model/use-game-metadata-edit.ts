import type { GameRecordResult, GameTerminationReason } from '@chess-db/shared';
import { selectGameMetadata, selectUpdateGameMetadata, useDraftStore } from '@/entities/draft';
import { useCallback } from 'react';
import {
  gameResultOptions,
  getTerminationReasonOptionsByResult,
  isTerminationReasonAllowedForResult,
} from './game-metadata-options';

export type UseGameMetadataEditResult = {
  readonly selectedResult: GameRecordResult | null;
  readonly selectedTerminationReason: GameTerminationReason | null;
  readonly playedAtValue: string;
  readonly resultOptions: typeof gameResultOptions;
  readonly terminationReasonOptions: ReturnType<typeof getTerminationReasonOptionsByResult>;
  readonly updateResult: (nextResult: GameRecordResult) => void;
  readonly updateTerminationReason: (nextTerminationReason: GameTerminationReason) => void;
  readonly updatePlayedAt: (nextPlayedAt: string | null) => void;
};

export const useGameMetadataEdit = (): UseGameMetadataEditResult => {
  const metadata = useDraftStore(selectGameMetadata);
  const updateGameMetadata = useDraftStore(selectUpdateGameMetadata);

  const updateResult = useCallback(
    (nextResult: GameRecordResult) => {
      updateGameMetadata({
        result: nextResult,
        terminationReason: isTerminationReasonAllowedForResult(
          nextResult,
          metadata.terminationReason,
        )
          ? metadata.terminationReason
          : null,
      });
    },
    [metadata.terminationReason, updateGameMetadata],
  );

  const updateTerminationReason = useCallback(
    (nextTerminationReason: GameTerminationReason) => {
      updateGameMetadata({ terminationReason: nextTerminationReason });
    },
    [updateGameMetadata],
  );

  const updatePlayedAt = useCallback(
    (nextPlayedAt: string | null) => {
      updateGameMetadata({ playedAt: nextPlayedAt === '' ? null : nextPlayedAt });
    },
    [updateGameMetadata],
  );

  return {
    selectedResult: metadata.result,
    selectedTerminationReason: metadata.terminationReason,
    playedAtValue: metadata.playedAt ?? '',
    resultOptions: gameResultOptions,
    terminationReasonOptions: getTerminationReasonOptionsByResult(metadata.result),
    updateResult,
    updateTerminationReason,
    updatePlayedAt,
  };
};
