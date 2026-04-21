import { PIECE_TYPE, type GameState, type Square } from '../models/game-state.js';
import { DIRECTION } from '../utils/ray-table.js';
import { getSlidingMoves } from './sliding-engine.js';

/**
 * [TASK-007] 룩(Rook) 합법 수 판정 로직
 * @param square 현재 룩의 위치 (0-63)
 * @param state 현재 게임 상태
 * @returns 이동 가능한 좌표 배열
 */
export const getRookMoves = (square: Square, state: GameState): Square[] => {
  const ROOK_DIRECTIONS = [DIRECTION.NORTH, DIRECTION.SOUTH, DIRECTION.EAST, DIRECTION.WEST];

  const piece = state.board[square];

  if (!piece || piece.type !== PIECE_TYPE.ROOK) {
    return [];
  }

  return getSlidingMoves(square, ROOK_DIRECTIONS, state);
};
