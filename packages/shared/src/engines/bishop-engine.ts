import { PIECE_TYPE, type GameState, type Move, type Square } from '../models/game-state.js';
import { getColor } from '../utils/board-utils.js';
import { DIRECTION } from '../utils/ray-table.js';
import { getSlidingMoves } from './sliding-engine.js';

/**
 * 특정 칸의 비숍이 이동할 수 있는 의사 합법 수를 반환합니다.
 *
 * @param square 이동할 비숍이 있는 시작 칸
 * @param state 현재 게임 상태
 * @returns 비숍의 의사 합법 이동 칸 목록
 *
 * const moves = getBishopMoves(SQUARE.C1, state);
 */
export const getBishopMoves = (square: Square, state: GameState): Move[] => {
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

  const color = getColor(piece);
  return getSlidingMoves(square, BISHOP_DIRECTIONS, state, color);
};
