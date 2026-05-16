import { useEffect, useRef, useState, type ReactNode } from 'react';
import type { GameState } from '@chess-db/shared';

import {
  selectHydrateDraft,
  useDraftStore,
  type DraftGameMetadata,
  type DraftMoveAnnotation,
  type DraftMoveComment,
} from '@/entities/draft';
import { selectHydrateGameState, useGameStore } from '@/entities/game';
import {
  selectHydrateMoveHistory,
  useMoveHistoryStore,
  type MoveHistoryItem,
} from '@/entities/move-history';
import { loadDraft } from '@/shared/lib/storage/draft-storage';

export const DraftRestoreProvider = ({ children }: { readonly children: ReactNode }) => {
  const hasRestoredRef = useRef(false);
  const [isRestoreReady, setIsRestoreReady] = useState(false);
  const [isRestoreNoticeVisible, setIsRestoreNoticeVisible] = useState(false);
  const hydrateGameState = useGameStore(selectHydrateGameState);
  const hydrateMoveHistory = useMoveHistoryStore(selectHydrateMoveHistory);
  const hydrateDraft = useDraftStore(selectHydrateDraft);

  useEffect(() => {
    if (hasRestoredRef.current) {
      return;
    }

    hasRestoredRef.current = true;

    const restoredDraft = loadDraft<
      GameState,
      MoveHistoryItem,
      DraftMoveComment,
      DraftMoveAnnotation,
      DraftGameMetadata
    >();

    if (restoredDraft === null) {
      /* eslint-disable react-hooks/set-state-in-effect -- 복원 시도 완료 뒤 하위 autosave 훅을 마운트한다. */
      setIsRestoreReady(true);
      /* eslint-enable react-hooks/set-state-in-effect */
      return;
    }

    hydrateGameState(restoredDraft.gameState);
    hydrateMoveHistory(restoredDraft.historyItems);
    hydrateDraft({
      moveComments: restoredDraft.moveComments,
      moveAnnotations: restoredDraft.moveAnnotations,
      metadata: restoredDraft.metadata,
    });
    setIsRestoreReady(true);
    setIsRestoreNoticeVisible(true);
  }, [hydrateDraft, hydrateGameState, hydrateMoveHistory]);

  useEffect(() => {
    if (!isRestoreNoticeVisible) {
      return;
    }

    const restoreNoticeTimeoutId = setTimeout(() => {
      setIsRestoreNoticeVisible(false);
    }, 2000);

    return () => {
      clearTimeout(restoreNoticeTimeoutId);
    };
  }, [isRestoreNoticeVisible]);

  return (
    <>
      <DraftRestoredToast isVisible={isRestoreNoticeVisible} />
      {isRestoreReady ? children : null}
    </>
  );
};

const DraftRestoredToast = ({ isVisible }: { readonly isVisible: boolean }) => {
  if (!isVisible) {
    return null;
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed right-4 top-4 z-50 rounded-md border border-sky-200 bg-sky-50 px-4 py-2 text-sm font-medium text-sky-700 shadow-sm"
    >
      초안 복원됨
    </div>
  );
};
