import type { Color, GameState, Square } from '../models/game-state.js';
import { isEmpty, isEnemyPiece } from '../utils/board-utils.js';
import { getRay, type Direction } from '../utils/ray-table.js';

export const getSlidingMoves = (
  square: Square,
  directions: Direction[],
  state: GameState,
  color: Color,
): Square[] => {
  const moves: Square[] = [];

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
