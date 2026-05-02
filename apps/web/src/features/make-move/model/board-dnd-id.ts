import type { Square } from '@chess-db/shared';

type DndIdentifier = string | number;

type DraggablePieceId = `piece:${Square}`;
type DroppableSquareId = `square:${Square}`;

type BoardDraggableData = {
  readonly sourceSquare?: Square;
};

type BoardDroppableData = {
  readonly targetSquare?: Square;
};

type DndOperationSource = {
  readonly id: DndIdentifier;
  readonly data?: BoardDraggableData | null;
};

type DndOperationTarget = {
  readonly id: DndIdentifier;
  readonly data?: BoardDroppableData | null;
};

type DndSourceOperation = {
  readonly source?: DndOperationSource | null;
};

type DndTargetOperation = {
  readonly target?: DndOperationTarget | null;
};

export const toDraggablePieceId = (square: Square): DraggablePieceId => `piece:${square}`;

export const toDroppableSquareId = (square: Square): DroppableSquareId => `square:${square}`;

const parseSquareValue = (value: string): Square | null => {
  const square = Number(value);

  if (!isSquare(square)) {
    return null;
  }

  return square;
};

const isSquare = (value: unknown): value is Square => {
  if (typeof value !== 'number') return false;
  if (!Number.isInteger(value)) return false;
  if (value < 0 || value > 63) return false;
  return true;
};

export const parseDraggablePieceId = (id: DndIdentifier): Square | null => {
  if (typeof id !== 'string') return null;

  const [prefix, square] = id.split(':');
  if (prefix !== 'piece' || !square) return null;

  return parseSquareValue(square);
};

export const parseDroppableSquareId = (id: DndIdentifier): Square | null => {
  if (typeof id !== 'string') return null;

  const [prefix, square] = id.split(':');
  if (prefix !== 'square' || !square) return null;

  return parseSquareValue(square);
};

export const getSourceSquareFromDndOperation = (operation: DndSourceOperation): Square | null => {
  const sourceSquare = operation.source?.data?.sourceSquare;

  if (isSquare(sourceSquare)) {
    return sourceSquare;
  }

  const sourceId = operation.source?.id;

  if (sourceId === undefined) {
    return null;
  }

  return parseDraggablePieceId(sourceId);
};

export const getTargetSquareFromDndOperation = (operation: DndTargetOperation): Square | null => {
  const targetSquare = operation.target?.data?.targetSquare;

  if (isSquare(targetSquare)) {
    return targetSquare;
  }

  const targetId = operation.target?.id;

  if (targetId === undefined) {
    return null;
  }

  return parseDroppableSquareId(targetId);
};
