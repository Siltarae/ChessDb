import { PIECE_TYPE, type Board, type Color, type Square } from '@chess-db/shared';

type CanStartDndMoveParams = {
  readonly boardState: Board;
  readonly turn: Color;
  readonly sourceSquare: Square;
  readonly isBoardInputDisabled: boolean;
  readonly pendingPromotionMoveExists: boolean;
};

type IsLegalDropTargetParams = {
  readonly targetSquare: Square | null;
  readonly highlightSquares: Square[];
};

export const canStartDndMove = ({
  boardState,
  turn,
  sourceSquare,
  isBoardInputDisabled,
  pendingPromotionMoveExists,
}: CanStartDndMoveParams): boolean => {
  if (isBoardInputDisabled) return false;
  if (pendingPromotionMoveExists) return false;
  const piece = boardState[sourceSquare];
  if (!piece) return false;
  if (piece.color !== turn) return false;
  if (piece.type === PIECE_TYPE.NONE) return false;

  return true;
};

export const isLegalDropTarget = ({
  targetSquare,
  highlightSquares,
}: IsLegalDropTargetParams): boolean => {
  return targetSquare !== null && highlightSquares.includes(targetSquare);
};
