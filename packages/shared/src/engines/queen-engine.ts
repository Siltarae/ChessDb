import { PIECE_TYPE, type GameState, type Move, type Square } from '../models/game-state.js';
import { getColor } from '../utils/board-utils.js';
import { DIRECTION } from '../utils/ray-table.js';
import { getSlidingMoves } from './sliding-engine.js';

/**
 * 특정 칸의 퀸이 이동할 수 있는 의사 합법 수를 반환합니다.
 *
 * @param square 이동할 퀸이 있는 시작 칸
 * @param state 현재 게임 상태
 * @returns 퀸의 의사 합법 이동 칸 목록
 *
 * const moves = getQueenMoves(SQUARE.D1, state);
 */
export const getQueenMoves = (square: Square, state: GameState): Move[] => {
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
