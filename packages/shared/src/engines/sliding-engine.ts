import type { GameState, Square } from '../models/game-state.js';
import { getColor, isEmpty, isEnemyPiece } from '../utils/board-utils.js';
import { getRay, type Direction } from '../utils/ray-table.js';

export const getSlidingMoves = (
  square: Square,
  directions: Direction[],
  state: GameState,
): Square[] => {
  const piece = state.board[square];

  if (!piece) {
    return [];
  }

  const moves: Square[] = [];

  const color = getColor(piece);

  for (const direction of directions) {
    const ray = getRay(square, direction);

    for (const target of ray) {
      if (isEmpty(target, state)) {
        moves.push(target);
        continue;
      }

      if (isEnemyPiece(state, target, color)) {
        moves.push(target);
        break;
      }

      break;
    }
  }

  return moves;
};
