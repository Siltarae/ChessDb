import {
  MOVE_KIND,
  type Move,
  type PromotionPieceType,
  type Square,
} from '../models/game-state.js';

export const moveTargets = (moves: readonly Move[]): Square[] => moves.map((move) => move.to);

export const normalMove = (from: Square, to: Square, promotion?: PromotionPieceType): Move => ({
  from,
  to,
  kind: MOVE_KIND.NORMAL,
  ...(promotion === undefined ? {} : { promotion }),
});

export const doublePawnPushMove = (from: Square, to: Square): Move => ({
  from,
  to,
  kind: MOVE_KIND.DOUBLE_PAWN_PUSH,
});

export const castleKingsideMove = (from: Square, to: Square): Move => ({
  from,
  to,
  kind: MOVE_KIND.CASTLE_KING_SIDE,
});

export const castleQueensideMove = (from: Square, to: Square): Move => ({
  from,
  to,
  kind: MOVE_KIND.CASTLE_QUEEN_SIDE,
});

export const enPassantMove = (from: Square, to: Square, capturedSquare: Square): Move => ({
  from,
  to,
  kind: MOVE_KIND.EN_PASSANT,
  capturedSquare,
});
