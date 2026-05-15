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
  readonly updateGameMetadata: (metadataPatch: Partial<DraftGameMetadata>) => void;
  readonly clearDraftComments: () => void;
  readonly clearDraftAnnotations: () => void;
  readonly clearGameMetadata: () => void;
};

const createInitialGameMetadata = (): DraftGameMetadata => {
  return {
    result: null,
    terminationReason: null,
    playedAt: createDefaultPlayedAt(),
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
          moveAnnotations: [...state.moveAnnotations, { halfMoveIndex, annotation: nextAnnotation }],
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

  updateGameMetadata: (metadataPatch: Partial<DraftGameMetadata>) => {
    set((state) => {
      if (!isValidGameMetadataPatch(metadataPatch)) {
        return state;
      }

      return {
        ...state,
        metadata: {
          ...state.metadata,
          ...metadataPatch,
        },
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

export const selectClearDraftComments = (state: DraftStoreState) => state.clearDraftComments;

export const selectClearDraftAnnotations = (state: DraftStoreState) =>
  state.clearDraftAnnotations;

export const selectClearGameMetadata = (state: DraftStoreState) => state.clearGameMetadata;

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

  return true;
};
