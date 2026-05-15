import {
  selectMoveCommentByHalfMoveIndex,
  selectUpdateMoveComment,
  useDraftStore,
} from '@/entities/draft';
import { selectSelectedHalfMoveIndex, useMoveHistoryStore } from '@/entities/move-history';
import { useCallback } from 'react';

export type UseMoveCommentEditResult = {
  readonly selectedHalfMoveIndex: number | null;
  readonly currentComment: string;
  readonly isDisabled: boolean;
  readonly updateComment: (nextComment: string) => void;
};

export const useMoveCommentEdit = (): UseMoveCommentEditResult => {
  const selectedHalfMoveIndex = useMoveHistoryStore(selectSelectedHalfMoveIndex);
  const moveComment = useDraftStore((state) => {
    if (selectedHalfMoveIndex === null) {
      return null;
    }

    return selectMoveCommentByHalfMoveIndex(selectedHalfMoveIndex)(state);
  });
  const updateMoveComment = useDraftStore(selectUpdateMoveComment);

  const updateComment = useCallback(
    (nextComment: string) => {
      if (selectedHalfMoveIndex === null) {
        return;
      }

      updateMoveComment(selectedHalfMoveIndex, nextComment);
    },
    [selectedHalfMoveIndex, updateMoveComment],
  );

  return {
    selectedHalfMoveIndex,
    currentComment: moveComment?.comment ?? '',
    isDisabled: selectedHalfMoveIndex === null,
    updateComment,
  };
};
