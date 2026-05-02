import type { Board, Color, Square } from '@chess-db/shared';
import type { DragEndEvent, DragOverEvent, DragStartEvent } from '@dnd-kit/react';
import { useCallback, useState } from 'react';
import { canStartDndMove, isLegalDropTarget } from './board-dnd-guard';
import { getSourceSquareFromDndOperation, getTargetSquareFromDndOperation } from './board-dnd-id';

type UseBoardDndMoveParams = {
  readonly boardState: Board;
  readonly turn: Color;
  readonly isBoardInputDisabled: boolean;
  readonly pendingPromotionMoveExists: boolean;
  readonly highlightSquares: Square[];
  readonly selectSquare: (square: Square) => void;
  readonly clearSelection: () => void;
  readonly makeMove: (targetSquare: Square) => boolean;
};

type UseBoardDndMoveResult = {
  readonly activeDragSquare: Square | null;
  readonly dragOverSquare: Square | null;
  readonly handleDragStart: (event: DragStartEvent) => void;
  readonly handleDragOver: (event: DragOverEvent) => void;
  readonly handleDragEnd: (event: DragEndEvent) => void;
};

export const useBoardDndMove = ({
  boardState,
  turn,
  isBoardInputDisabled,
  pendingPromotionMoveExists,
  highlightSquares,
  selectSquare,
  clearSelection,
  makeMove,
}: UseBoardDndMoveParams): UseBoardDndMoveResult => {
  const [activeDragSquare, setActiveDragSquare] = useState<Square | null>(null);
  const [dragOverSquare, setDragOverSquare] = useState<Square | null>(null);

  const resetDndState = useCallback(() => {
    setActiveDragSquare(null);
    setDragOverSquare(null);
  }, []);

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const square = getSourceSquareFromDndOperation(event.operation);

      if (square === null) {
        return;
      }

      if (
        !canStartDndMove({
          boardState,
          turn,
          sourceSquare: square,
          isBoardInputDisabled,
          pendingPromotionMoveExists,
        })
      ) {
        return;
      }

      setActiveDragSquare(square);
      selectSquare(square);
    },
    [boardState, turn, isBoardInputDisabled, pendingPromotionMoveExists, selectSquare],
  );

  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      const square = getTargetSquareFromDndOperation(event.operation);

      if (square === null || !isLegalDropTarget({ targetSquare: square, highlightSquares })) {
        setDragOverSquare(null);
        return;
      }

      setDragOverSquare(square);
    },
    [highlightSquares],
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      if (event.canceled) {
        resetDndState();
        clearSelection();
        return;
      }

      const sourceSquare = activeDragSquare;

      if (sourceSquare === null) {
        resetDndState();
        clearSelection();
        return;
      }

      if (
        !canStartDndMove({
          boardState,
          turn,
          sourceSquare,
          isBoardInputDisabled,
          pendingPromotionMoveExists,
        })
      ) {
        resetDndState();
        clearSelection();
        return;
      }

      const targetSquare = getTargetSquareFromDndOperation(event.operation);

      if (targetSquare === null || !isLegalDropTarget({ targetSquare, highlightSquares })) {
        resetDndState();
        clearSelection();
        return;
      }

      makeMove(targetSquare);
      resetDndState();
    },
    [
      activeDragSquare,
      boardState,
      turn,
      isBoardInputDisabled,
      pendingPromotionMoveExists,
      highlightSquares,
      makeMove,
      resetDndState,
      clearSelection,
    ],
  );

  return {
    activeDragSquare,
    dragOverSquare,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  };
};
