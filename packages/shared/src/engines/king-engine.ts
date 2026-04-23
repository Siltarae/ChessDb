import { PIECE_TYPE, type GameState, type Square } from '../models/game-state.js';
import { getColor, isEmpty, isEnemyPiece } from '../utils/board-utils.js';
import { getKingTargets } from '../utils/king-move-table.js';
import { getCastlingMoves } from './castling-engine.js';

export const getKingMoves = (square: Square, state: GameState): Square[] => {
  const piece = state.board[square];
  if (!piece || piece.type !== PIECE_TYPE.KING) {
    return [];
  }
  const color = getColor(piece);

  const targets = getKingTargets(square);
  const moves: Square[] = [];

  for (const target of targets) {
    if (isEmpty(target, state) || isEnemyPiece(state, target, color)) {
      moves.push(target);
    }
  }

  moves.push(...getCastlingMoves(state, color));

  return moves;
};
