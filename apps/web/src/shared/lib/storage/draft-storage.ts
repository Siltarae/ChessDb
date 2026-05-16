export const CHESS_DB_DRAFT_KEY = 'chess-db:draft';

export type SerializedDraftSnapshot<
  GameStateSnapshot = unknown,
  MoveHistorySnapshot = unknown,
  MoveCommentSnapshot = unknown,
  MoveAnnotationSnapshot = unknown,
  MetadataSnapshot = unknown,
> = {
  readonly gameState: GameStateSnapshot;
  readonly historyItems: readonly MoveHistorySnapshot[];
  readonly moveComments: readonly MoveCommentSnapshot[];
  readonly moveAnnotations: readonly MoveAnnotationSnapshot[];
  readonly metadata: MetadataSnapshot;
  readonly savedAt: string;
};

export const serializeDraft = (draftSnapshot: SerializedDraftSnapshot): string => {
  return JSON.stringify(draftSnapshot);
};

export const saveDraft = (serializedDraft: string, storage: Storage = localStorage): void => {
  storage.setItem(CHESS_DB_DRAFT_KEY, serializedDraft);
};
