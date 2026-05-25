import { useMutation } from '@tanstack/react-query';
import { useCallback, useMemo, useRef, useState } from 'react';

import {
  selectGameMetadata,
  selectMoveAnnotations,
  selectMoveComments,
  useDraftStore,
} from '@/entities/draft';
import { selectMoveHistoryItems, useMoveHistoryStore } from '@/entities/move-history';
import { removeDraft } from '@/shared/lib/storage/draft-storage';
import { saveGame } from '../api/save-game';
import { buildCreateGameRecordRequest } from './build-create-game-record-request';

export type SaveGameStatus = 'idle' | 'success' | 'error';

export type UseSaveGameOptions = {
  readonly repositoryId: string | null;
};

export type UseSaveGameResult = {
  readonly requestSaveGame: () => Promise<void>;
  readonly isSaving: boolean;
  readonly canSaveGame: boolean;
  readonly savedGameId: string | null;
  readonly saveStatus: SaveGameStatus;
};

export const useSaveGame = ({ repositoryId }: UseSaveGameOptions): UseSaveGameResult => {
  const historyItems = useMoveHistoryStore(selectMoveHistoryItems);
  const moveComments = useDraftStore(selectMoveComments);
  const moveAnnotations = useDraftStore(selectMoveAnnotations);
  const metadata = useDraftStore(selectGameMetadata);
  const [savedGameId, setSavedGameId] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<SaveGameStatus>('idle');
  const isSavingRef = useRef(false);
  const { isPending, mutateAsync } = useMutation({ mutationFn: saveGame });
  const createGameRecordRequest = useMemo(
    () =>
      buildCreateGameRecordRequest({
        repositoryId,
        historyItems,
        metadata,
        moveAnnotations,
        moveComments,
      }),
    [historyItems, metadata, moveAnnotations, moveComments, repositoryId],
  );

  const requestSaveGame = useCallback(async () => {
    if (isSavingRef.current) {
      return;
    }

    if (createGameRecordRequest === null) {
      setSaveStatus('error');
      return;
    }

    setSaveStatus('idle');

    try {
      isSavingRef.current = true;
      const response = await mutateAsync(createGameRecordRequest);

      removeDraft();
      setSavedGameId(response.id);
      setSaveStatus('success');
    } catch {
      setSaveStatus('error');
    } finally {
      isSavingRef.current = false;
    }
  }, [createGameRecordRequest, mutateAsync]);

  return {
    requestSaveGame,
    isSaving: isPending,
    canSaveGame: createGameRecordRequest !== null,
    savedGameId,
    saveStatus,
  };
};
