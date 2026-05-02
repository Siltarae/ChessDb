import type { MoveHistoryItem } from '@/entities/move-history';
import { useCallback } from 'react';

type DeriveCurrentHalfMoveIndexParams = {
  readonly historyLength: number;
  readonly selectedHalfMoveIndex: number | null;
};

type DerivePreviousHalfMoveIndexParams = {
  readonly currentHalfMoveIndex: number | null;
};

type CanUndoParams = {
  readonly currentHalfMoveIndex: number | null;
};

type UseHistoryNavigationResult = {
  readonly canUndo: boolean;
  readonly goToPreviousHalfMove: () => void;
};

type UseHistoryNavigationParams = {
  readonly historyItems: readonly MoveHistoryItem[];
  readonly selectedHalfMoveIndex: number | null;
  readonly selectHalfMove: (halfMoveIndex: number) => void;
};

export const useHistoryNavigation = ({
  historyItems,
  selectedHalfMoveIndex,
  selectHalfMove,
}: UseHistoryNavigationParams): UseHistoryNavigationResult => {
  const historyLength = historyItems.length;

  const currentHalfMoveIndex = deriveCurrentHalfMoveIndex({
    historyLength,
    selectedHalfMoveIndex,
  });

  const canUndo = deriveCanUndo({ currentHalfMoveIndex });

  const goToPreviousHalfMove = useCallback(() => {
    if (!canUndo) {
      return;
    }

    const previousHalfMoveIndex = derivePreviousHalfMoveIndex({ currentHalfMoveIndex });

    if (previousHalfMoveIndex === null) {
      return;
    }

    selectHalfMove(previousHalfMoveIndex);
  }, [canUndo, currentHalfMoveIndex, selectHalfMove]);

  return { canUndo, goToPreviousHalfMove };
};

const deriveCanUndo = ({ currentHalfMoveIndex }: CanUndoParams): boolean => {
  return derivePreviousHalfMoveIndex({ currentHalfMoveIndex }) !== null;
};

const deriveCurrentHalfMoveIndex = ({
  historyLength,
  selectedHalfMoveIndex,
}: DeriveCurrentHalfMoveIndexParams) => {
  if (historyLength === 0) {
    return null;
  }

  if (selectedHalfMoveIndex === null) {
    return historyLength - 1;
  }

  return selectedHalfMoveIndex;
};

const derivePreviousHalfMoveIndex = ({
  currentHalfMoveIndex,
}: DerivePreviousHalfMoveIndexParams) => {
  if (currentHalfMoveIndex === null) {
    return null;
  }

  if (currentHalfMoveIndex <= 0) {
    return null;
  }

  return currentHalfMoveIndex - 1;
};
