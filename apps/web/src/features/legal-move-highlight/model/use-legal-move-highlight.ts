import { getLegalMoves, type GameState, type Square } from '@chess-db/shared';
import { useCallback, useState } from 'react';

export const useLegalMoveHighlight = (gameState: GameState) => {
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [highlightSquares, setHighlightSquares] = useState<Square[]>([]);

  const clearSelection = useCallback(() => {
    setSelectedSquare(null);
    setHighlightSquares([]);
  }, []);

  const selectSquare = useCallback(
    (clickedSquare: Square) => {
      if (selectedSquare === clickedSquare) {
        clearSelection();
        return;
      }

      if (!isSelectablePiece(clickedSquare, gameState)) {
        clearSelection();
        return;
      }

      const nextHighlightSquares = deriveHighlightSquares(clickedSquare, gameState);

      setSelectedSquare(clickedSquare);
      setHighlightSquares(nextHighlightSquares);
    },
    [clearSelection, gameState, selectedSquare],
  );

  return {
    selectedSquare,
    highlightSquares,
    selectSquare,
  };
};

const isSelectablePiece = (square: Square, gameState: GameState) => {
  const piece = gameState.board[square];

  return piece != null && piece.color === gameState.turn;
};

const deriveHighlightSquares = (selectedSquare: Square, gameState: GameState) => {
  const legalMoves = getLegalMoves(selectedSquare, gameState);

  return legalMoves.map((move) => move.to);
};
