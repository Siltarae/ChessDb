import { PIECE_TYPE, type GameState, type Square } from '../models/game-state.js';
import { getColor } from '../utils/board-utils.js';
import { DIRECTION } from '../utils/ray-table.js';
import { getSlidingMoves } from './sliding-engine.js';

/**
 * [TASK-008] 퀸(Queen) 합법 수 판정 로직
 * @param square 현재 퀸의 위치 (0-63)
 * @param state 현재 게임 상태
 * @returns 이동 가능한 좌표 배열
 */
export const getQueenMoves = (square: Square, state: GameState): Square[] => {
  const QUEEN_DIRECTIONS = [
    DIRECTION.NORTH_EAST,
    DIRECTION.SOUTH_EAST,
    DIRECTION.NORTH_WEST,
    DIRECTION.SOUTH_WEST,
    DIRECTION.NORTH,
    DIRECTION.SOUTH,
    DIRECTION.EAST,
    DIRECTION.WEST,
  ];

  const piece = state.board[square];

  if (!piece || piece.type !== PIECE_TYPE.QUEEN) {
    return [];
  }

  const color = getColor(piece);

  return getSlidingMoves(square, QUEEN_DIRECTIONS, state, color);
};
