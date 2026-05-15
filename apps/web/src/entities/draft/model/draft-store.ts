import { create } from 'zustand';

export type DraftMoveComment = {
  readonly halfMoveIndex: number;
  readonly comment: string | null;
};

type DraftStoreState = {
  readonly moveComments: readonly DraftMoveComment[];
  readonly updateMoveComment: (halfMoveIndex: number, nextComment: string) => void;
  readonly clearDraftComments: () => void;
};

export const useDraftStore = create<DraftStoreState>((set) => ({
  moveComments: [],

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

  clearDraftComments: () => {
    set((state) => ({
      ...state,
      moveComments: [],
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

export const selectMoveCommentByHalfMoveIndex =
  (halfMoveIndex: number) =>
  (state: DraftStoreState): DraftMoveComment | null => {
    return (
      state.moveComments.find((moveComment) => moveComment.halfMoveIndex === halfMoveIndex) ?? null
    );
  };

export const selectUpdateMoveComment = (state: DraftStoreState) => state.updateMoveComment;

export const selectClearDraftComments = (state: DraftStoreState) => state.clearDraftComments;

const isValidHalfMoveIndex = (halfMoveIndex: number): boolean => {
  return Number.isInteger(halfMoveIndex) && halfMoveIndex >= 0;
};
