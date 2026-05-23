import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router';

import { selectResetDraft, useDraftStore } from '@/entities/draft';
import { selectResetGameState, useGameStore } from '@/entities/game';
import { selectClearMoveHistory, useMoveHistoryStore } from '@/entities/move-history';
import { removeDraft } from '@/shared/lib/storage/draft-storage';

export type UseStartNotationInputOptions = {
  readonly hasDraftToReplace: boolean;
};

export type UseStartNotationInputResult = {
  readonly isDraftReplaceDialogOpen: boolean;
  readonly startNotationInput: (repositoryId: string) => void;
  readonly cancelDraftReplace: () => void;
  readonly confirmDraftReplace: () => void;
};

export const useStartNotationInput = ({
  hasDraftToReplace,
}: UseStartNotationInputOptions): UseStartNotationInputResult => {
  const navigate = useNavigate();
  const resetGameState = useGameStore(selectResetGameState);
  const clearMoveHistory = useMoveHistoryStore(selectClearMoveHistory);
  const resetDraft = useDraftStore(selectResetDraft);
  const [isDraftReplaceDialogOpen, setIsDraftReplaceDialogOpen] = useState(false);
  const [pendingRepositoryId, setPendingRepositoryId] = useState<string | null>(null);

  const navigateToNotationInput = useCallback(
    (repositoryId: string) => {
      navigate(`/repositories/${repositoryId}/new`);
    },
    [navigate],
  );

  const startNotationInput = useCallback(
    (repositoryId: string) => {
      if (!hasDraftToReplace) {
        navigateToNotationInput(repositoryId);
        return;
      }

      setPendingRepositoryId(repositoryId);
      setIsDraftReplaceDialogOpen(true);
    },
    [hasDraftToReplace, navigateToNotationInput],
  );

  const cancelDraftReplace = useCallback(() => {
    setIsDraftReplaceDialogOpen(false);
    setPendingRepositoryId(null);
  }, []);

  const confirmDraftReplace = useCallback(() => {
    if (pendingRepositoryId === null) {
      setIsDraftReplaceDialogOpen(false);
      return;
    }

    resetGameState();
    clearMoveHistory();
    resetDraft();
    removeDraft();
    setIsDraftReplaceDialogOpen(false);
    navigateToNotationInput(pendingRepositoryId);
    setPendingRepositoryId(null);
  }, [clearMoveHistory, navigateToNotationInput, pendingRepositoryId, resetDraft, resetGameState]);

  return {
    isDraftReplaceDialogOpen,
    startNotationInput,
    cancelDraftReplace,
    confirmDraftReplace,
  };
};
