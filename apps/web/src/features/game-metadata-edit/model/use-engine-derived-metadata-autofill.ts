import { getGameResult } from '@chess-db/shared';
import { useEffect } from 'react';

import {
  DRAFT_GAME_METADATA_RESULT_SOURCE,
  selectGameMetadata,
  selectUpdateGameMetadata,
  useDraftStore,
} from '@/entities/draft';
import { selectGameState, selectRepetitionHistory, useGameStore } from '@/entities/game';
import { toEngineDerivedGameMetadata } from './engine-result-metadata';

export const useEngineDerivedMetadataAutofill = (): void => {
  const gameState = useGameStore(selectGameState);
  const repetitionHistory = useGameStore(selectRepetitionHistory);
  const metadata = useDraftStore(selectGameMetadata);
  const updateGameMetadata = useDraftStore(selectUpdateGameMetadata);

  useEffect(() => {
    const engineDerivedMetadata = toEngineDerivedGameMetadata(
      getGameResult(gameState, repetitionHistory),
    );

    if (engineDerivedMetadata === null) {
      return;
    }

    if (
      metadata.result === engineDerivedMetadata.result &&
      metadata.terminationReason === engineDerivedMetadata.terminationReason &&
      metadata.resultSource === DRAFT_GAME_METADATA_RESULT_SOURCE.AUTO
    ) {
      return;
    }

    updateGameMetadata(engineDerivedMetadata, DRAFT_GAME_METADATA_RESULT_SOURCE.AUTO);
  }, [gameState, metadata, repetitionHistory, updateGameMetadata]);
};
