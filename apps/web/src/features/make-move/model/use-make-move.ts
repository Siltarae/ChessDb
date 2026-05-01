import type { LastMove } from '@/entities/game/model/game-view-state';
import type { AppendMoveHistoryInput } from '@/features/move-history/model/move-history-store';
import {
  convertToSan,
  executeMove,
  getLegalMoves,
  type GameState,
  type Move,
  type PromotionPieceType,
  type Square,
} from '@chess-db/shared';
import { useCallback, useState } from 'react';

type UseMakeMoveParams = {
  gameState: GameState;
  selectedSquare: Square | null;
  highlightSquares: Square[];
  applyGameState: (nextGameState: GameState) => void;
  appendMoveHistory: (input: AppendMoveHistoryInput) => void;
  clearSelection: () => void;
};

type PendingPromotionMove = {
  from: Square;
  to: Square;
  candidates: Move[];
};

type UseMakeMoveResult = {
  makeMove: (targetSquare: Square) => boolean;
  selectPromotionPiece: (promotionPiece: PromotionPieceType) => boolean;
  lastMove: LastMove | null;
  pendingPromotionMove: PendingPromotionMove | null;
  clearPendingPromotion: () => void;
};

export const useMakeMove = ({
  gameState,
  selectedSquare,
  highlightSquares,
  applyGameState,
  appendMoveHistory,
  clearSelection,
}: UseMakeMoveParams): UseMakeMoveResult => {
  const [lastMove, setLastMove] = useState<LastMove | null>(null);
  const [pendingPromotionMove, setPendingPromotionMove] = useState<PendingPromotionMove | null>(
    null,
  );

  const commitMove = useCallback(
    (move: Move): void => {
      const nextGameState = executeMove(gameState, move);

      const san = convertToSan(gameState, move, nextGameState);

      appendMoveHistory({
        beforeState: gameState,
        move,
        afterState: nextGameState,
        san,
      });

      applyGameState(nextGameState);

      setLastMove({
        from: move.from,
        to: move.to,
      });

      clearSelection();
    },
    [gameState, applyGameState, clearSelection, appendMoveHistory],
  );

  const makeMove = useCallback(
    (targetSquare: Square): boolean => {
      if (selectedSquare === null) return false;
      if (highlightSquares.includes(targetSquare) === false) {
        return false;
      }

      const legalMoves = getLegalMoves(selectedSquare, gameState);

      const promotionCandidates = findPromotionCandidates(selectedSquare, targetSquare, legalMoves);
      if (promotionCandidates.length > 0) {
        setPendingPromotionMove({
          from: selectedSquare,
          to: targetSquare,
          candidates: promotionCandidates,
        });
        return true;
      }

      const move = findLegalMove(selectedSquare, targetSquare, legalMoves);

      if (move === null) {
        return false;
      }

      commitMove(move);
      return true;
    },
    [gameState, highlightSquares, selectedSquare, commitMove],
  );

  const selectPromotionPiece = useCallback(
    (promotionPiece: PromotionPieceType): boolean => {
      if (pendingPromotionMove === null) {
        return false;
      }
      const move = pendingPromotionMove.candidates.find(
        (move) => move.promotion === promotionPiece,
      );

      if (!move) {
        return false;
      }

      commitMove(move);
      setPendingPromotionMove(null);
      return true;
    },
    [commitMove, pendingPromotionMove],
  );

  const clearPendingPromotion = useCallback(() => {
    setPendingPromotionMove(null);
  }, []);

  return {
    makeMove,
    lastMove,
    pendingPromotionMove,
    clearPendingPromotion,
    selectPromotionPiece,
  };
};

export const findLegalMove = (
  selectedSquare: Square | null,
  targetSquare: Square,
  legalMoves: Move[],
): Move | null => {
  if (selectedSquare === null) {
    return null;
  }

  return legalMoves.find((move) => move.to === targetSquare) ?? null;
};

export const findPromotionCandidates = (
  selectedSquare: Square | null,
  targetSquare: Square,
  legalMoves: Move[],
): Move[] => {
  if (selectedSquare === null) {
    return [];
  }

  return legalMoves.filter(
    (move) =>
      move.from === selectedSquare && move.to === targetSquare && move.promotion !== undefined,
  );
};
