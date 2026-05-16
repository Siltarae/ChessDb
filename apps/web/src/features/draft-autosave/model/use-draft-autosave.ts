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
  loadDraft,
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

type DraftAutosaveContent = Omit<DraftAutosaveSnapshot, 'savedAt'>;

export const useDraftAutosave = (): DraftAutosaveStatus => {
  const gameState = useGameStore(selectGameState);
  const historyItems = useMoveHistoryStore(selectMoveHistoryItems);
  const moveComments = useDraftStore(selectMoveComments);
  const moveAnnotations = useDraftStore(selectMoveAnnotations);
  const metadata = useDraftStore(selectGameMetadata);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const [isSaveNoticeVisible, setIsSaveNoticeVisible] = useState(false);
  const hasMountedRef = useRef(false);
  const lastSavedContent = useRef<string | null>(null);
  const saveNoticeTimeoutId = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }

    const draftContent: DraftAutosaveContent = {
      gameState,
      historyItems,
      moveComments,
      moveAnnotations,
      metadata,
    };
    const serializedDraftContent = serializeDraftContent(draftContent);

    if (lastSavedContent.current === serializedDraftContent) {
      return;
    }

    const storedDraft = loadDraft<
      GameState,
      MoveHistoryItem,
      DraftMoveComment,
      DraftMoveAnnotation,
      DraftGameMetadata
    >();

    if (
      storedDraft !== null &&
      serializeDraftContent(toDraftAutosaveContent(storedDraft)) === serializedDraftContent
    ) {
      lastSavedContent.current = serializedDraftContent;
      return;
    }

    const draftSnapshot: DraftAutosaveSnapshot = {
      ...draftContent,
      savedAt: new Date().toISOString(),
    };
    const serializedDraft = serializeDraft(draftSnapshot);

    saveDraft(serializedDraft);
    lastSavedContent.current = serializedDraftContent;
    /* eslint-disable react-hooks/set-state-in-effect -- 저장 완료 상태를 훅 반환값으로 노출한다. */
    setLastSavedAt(draftSnapshot.savedAt);
    setIsSaveNoticeVisible(true);
    /* eslint-enable react-hooks/set-state-in-effect */

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

const toDraftAutosaveContent = (draftSnapshot: DraftAutosaveSnapshot): DraftAutosaveContent => {
  return {
    gameState: draftSnapshot.gameState,
    historyItems: draftSnapshot.historyItems,
    moveComments: draftSnapshot.moveComments,
    moveAnnotations: draftSnapshot.moveAnnotations,
    metadata: draftSnapshot.metadata,
  };
};

const serializeDraftContent = (draftContent: DraftAutosaveContent): string => {
  return JSON.stringify(draftContent);
};
