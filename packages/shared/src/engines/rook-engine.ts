import { PIECE_TYPE, type GameState, type Square } from '../models/game-state.js';
import { getColor } from '../utils/board-utils.js';
import { DIRECTION } from '../utils/ray-table.js';
import { getSlidingMoves } from './sliding-engine.js';

/**
 * 특정 칸의 룩이 이동할 수 있는 의사 합법 수를 반환합니다.
 *
 * @param square 이동할 룩이 있는 시작 칸
 * @param state 현재 게임 상태
 * @returns 룩의 의사 합법 이동 칸 목록
 *
 * const moves = getRookMoves(SQUARE.A1, state);
 */
export const getRookMoves = (square: Square, state: GameState): Square[] => {
  const ROOK_DIRECTIONS = [DIRECTION.NORTH, DIRECTION.SOUTH, DIRECTION.EAST, DIRECTION.WEST];

  const piece = state.board[square];

  if (!piece || piece.type !== PIECE_TYPE.ROOK) {
    return [];
  }

  const color = getColor(piece);
  return getSlidingMoves(square, ROOK_DIRECTIONS, state, color);
};
