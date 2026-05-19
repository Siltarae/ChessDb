import {
  COLOR,
  GAME_RECORD_RESULT,
  GAME_TERMINATION_REASON,
  GameStateSchema,
  MOVE_ANNOTATION,
  MOVE_KIND,
  PIECE_TYPE,
} from '@chess-db/shared';

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

export const saveDraft = (serializedDraft: string, storage: Storage = localStorage): boolean => {
  try {
    storage.setItem(CHESS_DB_DRAFT_KEY, serializedDraft);
    return true;
  } catch {
    return false;
  }
};

export const removeDraft = (storage: Storage = localStorage): void => {
  storage.removeItem(CHESS_DB_DRAFT_KEY);
};

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null;
};

const isValidHalfMoveIndex = (value: unknown): value is number => {
  return typeof value === 'number' && Number.isInteger(value) && value >= 0;
};

const isSquare = (value: unknown): value is number => {
  return typeof value === 'number' && Number.isInteger(value) && value >= 0 && value <= 63;
};

const isDateOnlyString = (value: unknown): value is string => {
  if (typeof value !== 'string') {
    return false;
  }

  const match = /^(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})$/.exec(value);

  if (match?.groups === undefined) {
    return false;
  }

  const year = Number(match.groups.year);
  const month = Number(match.groups.month);
  const day = Number(match.groups.day);
  const parsedDate = new Date(Date.UTC(year, month - 1, day));

  return (
    parsedDate.getUTCFullYear() === year &&
    parsedDate.getUTCMonth() === month - 1 &&
    parsedDate.getUTCDate() === day
  );
};

const isOneOf = <TValue extends string | number>(
  value: unknown,
  candidates: Record<string, TValue>,
): value is TValue => {
  return Object.values(candidates).includes(value as TValue);
};

const isValidGameState = (value: unknown): boolean => {
  return GameStateSchema.safeParse(value).success;
};

const isValidMove = (value: unknown): boolean => {
  if (!isRecord(value) || !isSquare(value.from) || !isSquare(value.to)) {
    return false;
  }

  if (value.kind === MOVE_KIND.EN_PASSANT) {
    return isSquare(value.capturedSquare) && !('promotion' in value);
  }

  const isStandardMoveKind =
    value.kind === MOVE_KIND.NORMAL ||
    value.kind === MOVE_KIND.DOUBLE_PAWN_PUSH ||
    value.kind === MOVE_KIND.CASTLE_KING_SIDE ||
    value.kind === MOVE_KIND.CASTLE_QUEEN_SIDE;

  if (!isStandardMoveKind || 'capturedSquare' in value) {
    return false;
  }

  return (
    value.promotion === undefined ||
    isOneOf(value.promotion, {
      QUEEN: PIECE_TYPE.QUEEN,
      ROOK: PIECE_TYPE.ROOK,
      BISHOP: PIECE_TYPE.BISHOP,
      KNIGHT: PIECE_TYPE.KNIGHT,
    })
  );
};

const isValidMoveHistoryItem = (value: unknown): boolean => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    isValidHalfMoveIndex(value.halfMoveIndex) &&
    typeof value.moveNumber === 'number' &&
    Number.isInteger(value.moveNumber) &&
    value.moveNumber >= 1 &&
    isOneOf(value.side, COLOR) &&
    typeof value.san === 'string' &&
    value.san.length > 0 &&
    isValidMove(value.move) &&
    isValidGameState(value.beforeState) &&
    isValidGameState(value.afterState)
  );
};

const isValidDraftMoveComment = (value: unknown): boolean => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    isValidHalfMoveIndex(value.halfMoveIndex) &&
    (typeof value.comment === 'string' || value.comment === null)
  );
};

const isValidDraftMoveAnnotation = (value: unknown): boolean => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    isValidHalfMoveIndex(value.halfMoveIndex) &&
    (value.annotation === null || isOneOf(value.annotation, MOVE_ANNOTATION))
  );
};

const isValidDraftMetadata = (value: unknown): boolean => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    (value.result === null || isOneOf(value.result, GAME_RECORD_RESULT)) &&
    (value.terminationReason === null ||
      isOneOf(value.terminationReason, GAME_TERMINATION_REASON)) &&
    (value.playedAt === null || isDateOnlyString(value.playedAt)) &&
    (!('resultSource' in value) ||
      value.resultSource === null ||
      value.resultSource === 'AUTO' ||
      value.resultSource === 'MANUAL')
  );
};

const isSerializedDraftSnapshot = (value: unknown): value is SerializedDraftSnapshot => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    isValidGameState(value.gameState) &&
    Array.isArray(value.historyItems) &&
    value.historyItems.every(isValidMoveHistoryItem) &&
    Array.isArray(value.moveComments) &&
    value.moveComments.every(isValidDraftMoveComment) &&
    Array.isArray(value.moveAnnotations) &&
    value.moveAnnotations.every(isValidDraftMoveAnnotation) &&
    isValidDraftMetadata(value.metadata) &&
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
