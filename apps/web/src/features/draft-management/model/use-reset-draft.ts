import { useCallback, useState } from 'react';

import { selectResetDraft, useDraftStore } from '@/entities/draft';
import { selectResetGameState, useGameStore } from '@/entities/game';
import { selectClearMoveHistory, useMoveHistoryStore } from '@/entities/move-history';
import { removeDraft } from '@/shared/lib/storage/draft-storage';

export type UseResetDraftResult = {
  readonly isResetDialogOpen: boolean;
  readonly requestDraftReset: () => void;
  readonly cancelDraftReset: () => void;
  readonly confirmDraftReset: () => void;
};

export const useResetDraft = (): UseResetDraftResult => {
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const resetGameState = useGameStore(selectResetGameState);
  const clearMoveHistory = useMoveHistoryStore(selectClearMoveHistory);
  const resetDraft = useDraftStore(selectResetDraft);

  const requestDraftReset = useCallback(() => {
    setIsResetDialogOpen(true);
  }, []);

  const cancelDraftReset = useCallback(() => {
    setIsResetDialogOpen(false);
  }, []);

  const confirmDraftReset = useCallback(() => {
    resetGameState();
    clearMoveHistory();
    resetDraft();
    removeDraft();
    setIsResetDialogOpen(false);
  }, [clearMoveHistory, resetDraft, resetGameState]);

  return {
    isResetDialogOpen,
    requestDraftReset,
    cancelDraftReset,
    confirmDraftReset,
  };
};
