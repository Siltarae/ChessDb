import {
  executeMove,
  getLegalMoves,
  type GameState,
  type Move,
  type Square,
} from '@chess-db/shared';
import { useCallback, useState } from 'react';
import type { LastMove } from '@/entities/game/model/game-view-state';

type UseMakeMoveParams = {
  gameState: GameState;
  selectedSquare: Square | null;
  highlightSquares: Square[];
  applyGameState: (nextGameState: GameState) => void;
  clearSelection: () => void;
};

type UseMakeMoveResult = {
  makeMove: (targetSquare: Square) => boolean;
  lastMove: LastMove | null;
};

export const useMakeMove = ({
  gameState,
  selectedSquare,
  highlightSquares,
  applyGameState,
  clearSelection,
}: UseMakeMoveParams): UseMakeMoveResult => {
  const [lastMove, setLastMove] = useState<LastMove | null>(null);

  const makeMove = useCallback(
    (targetSquare: Square): boolean => {
      if (selectedSquare === null) return false;
      if (highlightSquares.includes(targetSquare) === false) {
        return false;
      }
      const move = findLegalMove(selectedSquare, targetSquare, gameState);
      if (move === null) {
        return false;
      }

      const nextGameState = executeMove(gameState, move);
      applyGameState(nextGameState);

      setLastMove({ from: selectedSquare, to: targetSquare });
      clearSelection();
      return true;
    },
    [gameState, highlightSquares, selectedSquare, applyGameState, clearSelection],
  );

  return {
    makeMove,
    lastMove,
  };
};

export const findLegalMove = (
  selectedSquare: Square | null,
  targetSquare: Square,
  gameState: GameState,
): Move | null => {
  if (selectedSquare === null) {
    return null;
  }

  const legalMoves = getLegalMoves(selectedSquare, gameState);

  return legalMoves.find((move) => move.to === targetSquare) ?? null;
};
