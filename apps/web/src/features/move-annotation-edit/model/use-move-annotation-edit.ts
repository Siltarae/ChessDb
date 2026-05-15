import type { MoveAnnotation } from '@chess-db/shared';
import {
  selectMoveAnnotationByHalfMoveIndex,
  selectUpdateMoveAnnotation,
  useDraftStore,
} from '@/entities/draft';
import { selectSelectedHalfMoveIndex, useMoveHistoryStore } from '@/entities/move-history';
import { useCallback } from 'react';

export type UseMoveAnnotationEditResult = {
  readonly selectedHalfMoveIndex: number | null;
  readonly selectedAnnotation: MoveAnnotation | null;
  readonly isDisabled: boolean;
  readonly updateAnnotation: (nextAnnotation: MoveAnnotation) => void;
  readonly clearAnnotation: () => void;
};

export const useMoveAnnotationEdit = (): UseMoveAnnotationEditResult => {
  const selectedHalfMoveIndex = useMoveHistoryStore(selectSelectedHalfMoveIndex);
  const moveAnnotation = useDraftStore((state) => {
    if (selectedHalfMoveIndex === null) {
      return null;
    }

    return selectMoveAnnotationByHalfMoveIndex(selectedHalfMoveIndex)(state);
  });
  const updateMoveAnnotation = useDraftStore(selectUpdateMoveAnnotation);

  const updateAnnotation = useCallback(
    (nextAnnotation: MoveAnnotation) => {
      if (selectedHalfMoveIndex === null) {
        return;
      }

      updateMoveAnnotation(selectedHalfMoveIndex, nextAnnotation);
    },
    [selectedHalfMoveIndex, updateMoveAnnotation],
  );

  const clearAnnotation = useCallback(() => {
    if (selectedHalfMoveIndex === null) {
      return;
    }

    updateMoveAnnotation(selectedHalfMoveIndex, null);
  }, [selectedHalfMoveIndex, updateMoveAnnotation]);

  return {
    selectedHalfMoveIndex,
    selectedAnnotation: moveAnnotation?.annotation ?? null,
    isDisabled: selectedHalfMoveIndex === null,
    updateAnnotation,
    clearAnnotation,
  };
};
