import type { MoveHistoryItem } from '@/entities/move-history';
import { useCallback } from 'react';

type DeriveCurrentHalfMoveIndexParams = {
  readonly historyLength: number;
  readonly selectedHalfMoveIndex: number | null;
};

type DerivePreviousHalfMoveIndexParams = {
  readonly currentHalfMoveIndex: number | null;
};

type DeriveNextHalfMoveIndexParams = {
  readonly historyLength: number;
  readonly selectedHalfMoveIndex: number | null;
};

type CanUndoParams = {
  readonly currentHalfMoveIndex: number | null;
};

type CanRedoParams = {
  readonly historyLength: number;
  readonly selectedHalfMoveIndex: number | null;
};

type UseHistoryNavigationResult = {
  readonly canUndo: boolean;
  readonly canRedo: boolean;
  readonly goToPreviousHalfMove: () => void;
  readonly goToNextHalfMove: () => void;
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
  const canRedo = deriveCanRedo({ historyLength, selectedHalfMoveIndex });

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

  const goToNextHalfMove = useCallback(() => {
    if (!canRedo) {
      return;
    }

    const nextHalfMoveIndex = deriveNextHalfMoveIndex({
      historyLength,
      selectedHalfMoveIndex,
    });

    if (nextHalfMoveIndex === null) {
      return;
    }

    selectHalfMove(nextHalfMoveIndex);
  }, [canRedo, historyLength, selectedHalfMoveIndex, selectHalfMove]);

  return { canUndo, canRedo, goToPreviousHalfMove, goToNextHalfMove };
};

const deriveCanUndo = ({ currentHalfMoveIndex }: CanUndoParams): boolean => {
  return derivePreviousHalfMoveIndex({ currentHalfMoveIndex }) !== null;
};

const deriveCanRedo = ({ historyLength, selectedHalfMoveIndex }: CanRedoParams): boolean => {
  return deriveNextHalfMoveIndex({ historyLength, selectedHalfMoveIndex }) !== null;
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

const deriveNextHalfMoveIndex = ({
  historyLength,
  selectedHalfMoveIndex,
}: DeriveNextHalfMoveIndexParams) => {
  if (historyLength === 0 || selectedHalfMoveIndex === null) {
    return null;
  }

  if (selectedHalfMoveIndex >= historyLength - 1) {
    return null;
  }

  return selectedHalfMoveIndex + 1;
};
