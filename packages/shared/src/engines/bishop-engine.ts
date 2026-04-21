import { PIECE_TYPE, type GameState, type Square } from '../models/game-state.js';
import { DIRECTION } from '../utils/ray-table.js';
import { getSlidingMoves } from './sliding-engine.js';

export const getBishopMoves = (square: Square, state: GameState) => {
  const BISHOP_DIRECTIONS = [
    DIRECTION.NORTH_EAST,
    DIRECTION.SOUTH_EAST,
    DIRECTION.NORTH_WEST,
    DIRECTION.SOUTH_WEST,
  ];

  const piece = state.board[square];

  if (!piece || piece.type !== PIECE_TYPE.BISHOP) {
    return [];
  }

  return getSlidingMoves(square, BISHOP_DIRECTIONS, state);
};
