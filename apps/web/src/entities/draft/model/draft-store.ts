import {
  GAME_RECORD_RESULT,
  GAME_TERMINATION_REASON,
  MOVE_ANNOTATION,
  type GameRecordResult,
  type GameTerminationReason,
  type MoveAnnotation,
} from '@chess-db/shared';
import { create } from 'zustand';

export type DraftMoveComment = {
  readonly halfMoveIndex: number;
  readonly comment: string | null;
};

export type DraftMoveAnnotation = {
  readonly halfMoveIndex: number;
  readonly annotation: MoveAnnotation | null;
};

export type DraftGameMetadata = {
  readonly result: GameRecordResult | null;
  readonly terminationReason: GameTerminationReason | null;
  readonly playedAt: string | null;
  readonly resultSource: DraftGameMetadataResultSource;
};

export const DRAFT_GAME_METADATA_RESULT_SOURCE = {
  AUTO: 'AUTO',
  MANUAL: 'MANUAL',
} as const;

export type DraftGameMetadataResultSource =
  | (typeof DRAFT_GAME_METADATA_RESULT_SOURCE)[keyof typeof DRAFT_GAME_METADATA_RESULT_SOURCE]
  | null;

export type HydratableDraftGameMetadata = Omit<DraftGameMetadata, 'resultSource'> &
  Partial<Pick<DraftGameMetadata, 'resultSource'>>;

export type HydrateDraftInput = {
  readonly moveComments: readonly DraftMoveComment[];
  readonly moveAnnotations: readonly DraftMoveAnnotation[];
  readonly metadata: HydratableDraftGameMetadata;
};

type DraftStoreState = {
  readonly moveComments: readonly DraftMoveComment[];
  readonly moveAnnotations: readonly DraftMoveAnnotation[];
  readonly metadata: DraftGameMetadata;
  readonly updateMoveComment: (halfMoveIndex: number, nextComment: string) => void;
  readonly updateMoveAnnotation: (
    halfMoveIndex: number,
    nextAnnotation: MoveAnnotation | null,
  ) => void;
  readonly updateGameMetadata: (
    metadataPatch: Partial<DraftGameMetadata>,
    resultSource?: Exclude<DraftGameMetadataResultSource, null>,
  ) => void;
  readonly hydrateDraft: (input: HydrateDraftInput) => void;
  readonly clearDraftComments: () => void;
  readonly clearDraftAnnotations: () => void;
  readonly clearGameMetadata: () => void;
  readonly resetDraft: () => void;
};

const createInitialGameMetadata = (): DraftGameMetadata => {
  return {
    result: null,
    terminationReason: null,
    playedAt: createDefaultPlayedAt(),
    resultSource: null,
  };
};

export const useDraftStore = create<DraftStoreState>((set) => ({
  moveComments: [],
  moveAnnotations: [],
  metadata: createInitialGameMetadata(),

  updateMoveComment: (halfMoveIndex: number, nextComment: string) => {
    set((state) => {
      if (!isValidHalfMoveIndex(halfMoveIndex)) {
        return state;
      }

      const normalizedComment = normalizeMoveComment(nextComment);
      const existingCommentIndex = state.moveComments.findIndex(
        (moveComment) => moveComment.halfMoveIndex === halfMoveIndex,
      );

      if (existingCommentIndex === -1) {
        return {
          ...state,
          moveComments: [...state.moveComments, { halfMoveIndex, comment: normalizedComment }],
        };
      }

      return {
        ...state,
        moveComments: state.moveComments.map((moveComment) =>
          moveComment.halfMoveIndex === halfMoveIndex
            ? { ...moveComment, comment: normalizedComment }
            : moveComment,
        ),
      };
    });
  },

  updateMoveAnnotation: (halfMoveIndex: number, nextAnnotation: MoveAnnotation | null) => {
    set((state) => {
      if (!isValidHalfMoveIndex(halfMoveIndex) || !isNullableMoveAnnotation(nextAnnotation)) {
        return state;
      }

      const existingAnnotationIndex = state.moveAnnotations.findIndex(
        (moveAnnotation) => moveAnnotation.halfMoveIndex === halfMoveIndex,
      );

      if (existingAnnotationIndex === -1) {
        return {
          ...state,
          moveAnnotations: [
            ...state.moveAnnotations,
            { halfMoveIndex, annotation: nextAnnotation },
          ],
        };
      }

      return {
        ...state,
        moveAnnotations: state.moveAnnotations.map((moveAnnotation) =>
          moveAnnotation.halfMoveIndex === halfMoveIndex
            ? { ...moveAnnotation, annotation: nextAnnotation }
            : moveAnnotation,
        ),
      };
    });
  },

  updateGameMetadata: (
    metadataPatch: Partial<DraftGameMetadata>,
    resultSource?: Exclude<DraftGameMetadataResultSource, null>,
  ) => {
    set((state) => {
      if (!isValidGameMetadataPatch(metadataPatch)) {
        return state;
      }

      if (
        resultSource === DRAFT_GAME_METADATA_RESULT_SOURCE.AUTO &&
        state.metadata.resultSource === DRAFT_GAME_METADATA_RESULT_SOURCE.MANUAL
      ) {
        return state;
      }

      const nextResultSource = resolveNextResultSource(
        state.metadata.resultSource,
        metadataPatch,
        resultSource,
      );

      return {
        ...state,
        metadata: {
          ...state.metadata,
          ...metadataPatch,
          resultSource: nextResultSource,
        },
      };
    });
  },

  hydrateDraft: (input: HydrateDraftInput) => {
    set((state) => {
      if (!isValidDraftHydrationInput(input)) {
        return state;
      }

      return {
        ...state,
        moveComments: [...input.moveComments],
        moveAnnotations: [...input.moveAnnotations],
        metadata: normalizeHydratedGameMetadata(input.metadata),
      };
    });
  },

  clearDraftComments: () => {
    set((state) => ({
      ...state,
      moveComments: [],
    }));
  },

  clearDraftAnnotations: () => {
    set((state) => ({
      ...state,
      moveAnnotations: [],
    }));
  },

  clearGameMetadata: () => {
    set((state) => ({
      ...state,
      metadata: createInitialGameMetadata(),
    }));
  },

  resetDraft: () => {
    set((state) => ({
      ...state,
      moveComments: [],
      moveAnnotations: [],
      metadata: createInitialGameMetadata(),
    }));
  },
}));

export const normalizeMoveComment = (nextComment: string): string | null => {
  const trimmedComment = nextComment.trim();

  if (trimmedComment.length === 0) {
    return null;
  }

  return trimmedComment;
};

export function formatLocalDateOnly(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function isDateOnlyString(value: unknown): value is string {
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
}

export function createDefaultPlayedAt(): string {
  return formatLocalDateOnly(new Date());
}

export const selectMoveComments = (state: DraftStoreState) => state.moveComments;

export const selectMoveAnnotations = (state: DraftStoreState) => state.moveAnnotations;

export const selectGameMetadata = (state: DraftStoreState) => state.metadata;

export const selectMoveCommentByHalfMoveIndex =
  (halfMoveIndex: number) =>
  (state: DraftStoreState): DraftMoveComment | null => {
    return (
      state.moveComments.find((moveComment) => moveComment.halfMoveIndex === halfMoveIndex) ?? null
    );
  };

export const selectMoveAnnotationByHalfMoveIndex =
  (halfMoveIndex: number) =>
  (state: DraftStoreState): DraftMoveAnnotation | null => {
    return (
      state.moveAnnotations.find(
        (moveAnnotation) => moveAnnotation.halfMoveIndex === halfMoveIndex,
      ) ?? null
    );
  };

export const selectUpdateMoveComment = (state: DraftStoreState) => state.updateMoveComment;

export const selectUpdateMoveAnnotation = (state: DraftStoreState) => state.updateMoveAnnotation;

export const selectUpdateGameMetadata = (state: DraftStoreState) => state.updateGameMetadata;

export const selectHydrateDraft = (state: DraftStoreState) => state.hydrateDraft;

export const selectClearDraftComments = (state: DraftStoreState) => state.clearDraftComments;

export const selectClearDraftAnnotations = (state: DraftStoreState) => state.clearDraftAnnotations;

export const selectClearGameMetadata = (state: DraftStoreState) => state.clearGameMetadata;

export const selectResetDraft = (state: DraftStoreState) => state.resetDraft;

const isValidHalfMoveIndex = (halfMoveIndex: number): boolean => {
  return Number.isInteger(halfMoveIndex) && halfMoveIndex >= 0;
};

export const isMoveAnnotation = (value: unknown): value is MoveAnnotation => {
  return Object.values(MOVE_ANNOTATION).includes(value as MoveAnnotation);
};

const isNullableMoveAnnotation = (value: MoveAnnotation | null): value is MoveAnnotation | null => {
  return value === null || isMoveAnnotation(value);
};

export const isGameRecordResult = (value: unknown): value is GameRecordResult => {
  return Object.values(GAME_RECORD_RESULT).includes(value as GameRecordResult);
};

export const isGameTerminationReason = (value: unknown): value is GameTerminationReason => {
  return Object.values(GAME_TERMINATION_REASON).includes(value as GameTerminationReason);
};

const isNullableGameRecordResult = (
  value: GameRecordResult | null,
): value is GameRecordResult | null => {
  return value === null || isGameRecordResult(value);
};

const isNullableGameTerminationReason = (
  value: GameTerminationReason | null,
): value is GameTerminationReason | null => {
  return value === null || isGameTerminationReason(value);
};

export const isGameMetadataResultSource = (
  value: unknown,
): value is DraftGameMetadataResultSource => {
  return (
    value === null ||
    Object.values(DRAFT_GAME_METADATA_RESULT_SOURCE).includes(
      value as Exclude<DraftGameMetadataResultSource, null>,
    )
  );
};

const isValidGameMetadataPatch = (metadataPatch: Partial<DraftGameMetadata>): boolean => {
  if ('result' in metadataPatch && !isNullableGameRecordResult(metadataPatch.result ?? null)) {
    return false;
  }

  if (
    'terminationReason' in metadataPatch &&
    !isNullableGameTerminationReason(metadataPatch.terminationReason ?? null)
  ) {
    return false;
  }

  if (
    'playedAt' in metadataPatch &&
    !(metadataPatch.playedAt === null || isDateOnlyString(metadataPatch.playedAt))
  ) {
    return false;
  }

  if ('resultSource' in metadataPatch && !isGameMetadataResultSource(metadataPatch.resultSource)) {
    return false;
  }

  return true;
};

const resolveNextResultSource = (
  currentResultSource: DraftGameMetadataResultSource,
  metadataPatch: Partial<DraftGameMetadata>,
  resultSource?: Exclude<DraftGameMetadataResultSource, null>,
): DraftGameMetadataResultSource => {
  if (resultSource !== undefined) {
    return resultSource;
  }

  if ('resultSource' in metadataPatch) {
    return metadataPatch.resultSource ?? null;
  }

  if ('result' in metadataPatch || 'terminationReason' in metadataPatch) {
    return DRAFT_GAME_METADATA_RESULT_SOURCE.MANUAL;
  }

  return currentResultSource;
};

const normalizeHydratedGameMetadata = (
  metadata: HydratableDraftGameMetadata,
): DraftGameMetadata => {
  const resultSource =
    metadata.resultSource ??
    (metadata.result !== null || metadata.terminationReason !== null
      ? DRAFT_GAME_METADATA_RESULT_SOURCE.MANUAL
      : null);

  return {
    ...metadata,
    resultSource,
  };
};

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null;
};

const isValidDraftMoveComment = (moveComment: unknown): moveComment is DraftMoveComment => {
  if (!isRecord(moveComment)) {
    return false;
  }

  return (
    typeof moveComment.halfMoveIndex === 'number' &&
    isValidHalfMoveIndex(moveComment.halfMoveIndex) &&
    (typeof moveComment.comment === 'string' || moveComment.comment === null)
  );
};

const isValidDraftMoveAnnotation = (
  moveAnnotation: unknown,
): moveAnnotation is DraftMoveAnnotation => {
  if (!isRecord(moveAnnotation)) {
    return false;
  }

  return (
    typeof moveAnnotation.halfMoveIndex === 'number' &&
    isValidHalfMoveIndex(moveAnnotation.halfMoveIndex) &&
    (moveAnnotation.annotation === null || isMoveAnnotation(moveAnnotation.annotation))
  );
};

const isValidGameMetadata = (metadata: unknown): metadata is DraftGameMetadata => {
  if (!isRecord(metadata)) {
    return false;
  }

  return (
    isNullableGameRecordResult(metadata.result as GameRecordResult | null) &&
    isNullableGameTerminationReason(metadata.terminationReason as GameTerminationReason | null) &&
    (metadata.playedAt === null || isDateOnlyString(metadata.playedAt)) &&
    (!('resultSource' in metadata) || isGameMetadataResultSource(metadata.resultSource))
  );
};

const isValidDraftHydrationInput = (input: HydrateDraftInput): boolean => {
  return (
    Array.isArray(input.moveComments) &&
    input.moveComments.every(isValidDraftMoveComment) &&
    Array.isArray(input.moveAnnotations) &&
    input.moveAnnotations.every(isValidDraftMoveAnnotation) &&
    isValidGameMetadata(input.metadata)
  );
};
