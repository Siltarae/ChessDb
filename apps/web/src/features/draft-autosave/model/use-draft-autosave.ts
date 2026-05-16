import type { GameState } from '@chess-db/shared';
import { useEffect, useRef, useState } from 'react';

import {
  selectGameMetadata,
  selectMoveAnnotations,
  selectMoveComments,
  useDraftStore,
  type DraftGameMetadata,
  type DraftMoveAnnotation,
  type DraftMoveComment,
} from '@/entities/draft';
import { selectGameState, useGameStore } from '@/entities/game';
import {
  selectMoveHistoryItems,
  useMoveHistoryStore,
  type MoveHistoryItem,
} from '@/entities/move-history';
import {
  saveDraft,
  serializeDraft,
  type SerializedDraftSnapshot,
} from '@/shared/lib/storage/draft-storage';

type DraftAutosaveSnapshot = SerializedDraftSnapshot<
  GameState,
  MoveHistoryItem,
  DraftMoveComment,
  DraftMoveAnnotation,
  DraftGameMetadata
>;

type DraftAutosaveStatus = {
  readonly lastSavedAt: string | null;
  readonly isSaveNoticeVisible: boolean;
};

export const useDraftAutosave = (): DraftAutosaveStatus => {
  const gameState = useGameStore(selectGameState);
  const historyItems = useMoveHistoryStore(selectMoveHistoryItems);
  const moveComments = useDraftStore(selectMoveComments);
  const moveAnnotations = useDraftStore(selectMoveAnnotations);
  const metadata = useDraftStore(selectGameMetadata);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const [isSaveNoticeVisible, setIsSaveNoticeVisible] = useState(false);
  const hasMountedRef = useRef(false);
  const lastSavedSnapshot = useRef<string | null>(null);
  const saveNoticeTimeoutId = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }

    const draftSnapshot: DraftAutosaveSnapshot = {
      gameState,
      historyItems,
      moveComments,
      moveAnnotations,
      metadata,
      savedAt: new Date().toISOString(),
    };
    const serializedDraft = serializeDraft(draftSnapshot);

    if (lastSavedSnapshot.current === serializedDraft) {
      return;
    }

    saveDraft(serializedDraft);
    lastSavedSnapshot.current = serializedDraft;
    setLastSavedAt(draftSnapshot.savedAt);
    setIsSaveNoticeVisible(true);

    if (saveNoticeTimeoutId.current !== null) {
      clearTimeout(saveNoticeTimeoutId.current);
    }

    saveNoticeTimeoutId.current = setTimeout(() => {
      setIsSaveNoticeVisible(false);
      saveNoticeTimeoutId.current = null;
    }, 2000);
  }, [gameState, historyItems, moveComments, moveAnnotations, metadata]);

  useEffect(() => {
    return () => {
      if (saveNoticeTimeoutId.current !== null) {
        clearTimeout(saveNoticeTimeoutId.current);
      }
    };
  }, []);

  return { lastSavedAt, isSaveNoticeVisible };
};
