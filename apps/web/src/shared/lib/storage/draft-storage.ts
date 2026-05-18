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

export const removeDraft = (storage: Storage = localStorage): void => {
  storage.removeItem(CHESS_DB_DRAFT_KEY);
};

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null;
};

const isSerializedDraftSnapshot = (value: unknown): value is SerializedDraftSnapshot => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    'gameState' in value &&
    Array.isArray(value.historyItems) &&
    Array.isArray(value.moveComments) &&
    Array.isArray(value.moveAnnotations) &&
    'metadata' in value &&
    typeof value.savedAt === 'string'
  );
};

export const loadDraft = <
  GameStateSnapshot = unknown,
  MoveHistorySnapshot = unknown,
  MoveCommentSnapshot = unknown,
  MoveAnnotationSnapshot = unknown,
  MetadataSnapshot = unknown,
>(
  storage: Storage = localStorage,
): SerializedDraftSnapshot<
  GameStateSnapshot,
  MoveHistorySnapshot,
  MoveCommentSnapshot,
  MoveAnnotationSnapshot,
  MetadataSnapshot
> | null => {
  const storedDraft = storage.getItem(CHESS_DB_DRAFT_KEY);

  if (storedDraft === null) {
    return null;
  }

  try {
    const parsedDraft: unknown = JSON.parse(storedDraft);

    if (!isSerializedDraftSnapshot(parsedDraft)) {
      return null;
    }

    return parsedDraft as SerializedDraftSnapshot<
      GameStateSnapshot,
      MoveHistorySnapshot,
      MoveCommentSnapshot,
      MoveAnnotationSnapshot,
      MetadataSnapshot
    >;
  } catch {
    return null;
  }
};
