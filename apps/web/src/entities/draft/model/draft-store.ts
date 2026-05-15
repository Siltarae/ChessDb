import { MOVE_ANNOTATION, type MoveAnnotation } from '@chess-db/shared';
import { create } from 'zustand';

export type DraftMoveComment = {
  readonly halfMoveIndex: number;
  readonly comment: string | null;
};

export type DraftMoveAnnotation = {
  readonly halfMoveIndex: number;
  readonly annotation: MoveAnnotation | null;
};

type DraftStoreState = {
  readonly moveComments: readonly DraftMoveComment[];
  readonly moveAnnotations: readonly DraftMoveAnnotation[];
  readonly updateMoveComment: (halfMoveIndex: number, nextComment: string) => void;
  readonly updateMoveAnnotation: (
    halfMoveIndex: number,
    nextAnnotation: MoveAnnotation | null,
  ) => void;
  readonly clearDraftComments: () => void;
  readonly clearDraftAnnotations: () => void;
};

export const useDraftStore = create<DraftStoreState>((set) => ({
  moveComments: [],
  moveAnnotations: [],

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
}));

export const normalizeMoveComment = (nextComment: string): string | null => {
  const trimmedComment = nextComment.trim();

  if (trimmedComment.length === 0) {
    return null;
  }

  return trimmedComment;
};

export const selectMoveComments = (state: DraftStoreState) => state.moveComments;

export const selectMoveAnnotations = (state: DraftStoreState) => state.moveAnnotations;

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

export const selectClearDraftComments = (state: DraftStoreState) => state.clearDraftComments;

export const selectClearDraftAnnotations = (state: DraftStoreState) =>
  state.clearDraftAnnotations;

const isValidHalfMoveIndex = (halfMoveIndex: number): boolean => {
  return Number.isInteger(halfMoveIndex) && halfMoveIndex >= 0;
};

export const isMoveAnnotation = (value: unknown): value is MoveAnnotation => {
  return Object.values(MOVE_ANNOTATION).includes(value as MoveAnnotation);
};

const isNullableMoveAnnotation = (value: MoveAnnotation | null): value is MoveAnnotation | null => {
  return value === null || isMoveAnnotation(value);
};
