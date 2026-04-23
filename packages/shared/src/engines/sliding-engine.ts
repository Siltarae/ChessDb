import {
  MOVE_KIND,
  type Color,
  type GameState,
  type Move,
  type Square,
} from '../models/game-state.js';
import { isEmpty, isEnemyPiece } from '../utils/board-utils.js';
import { getRay, type Direction } from '../utils/ray-table.js';

/**
 * 슬라이딩 기물이 지정한 방향들로 이동할 수 있는 의사 합법 수를 반환합니다.
 *
 * @param square 이동을 시작할 기물의 현재 칸
 * @param directions 탐색할 진행 방향 목록
 * @param state 현재 게임 상태
 * @param color 이동할 기물의 색상
 * @returns 경로를 따라 계산한 이동 가능 칸 목록
 *
 * const moves = getSlidingMoves(SQUARE.A1, directions, state, color);
 */
export const getSlidingMoves = (
  square: Square,
  directions: Direction[],
  state: GameState,
  color: Color,
): Move[] => {
  const moves: Move[] = [];

  for (const direction of directions) {
    const ray = getRay(square, direction);

    for (const target of ray) {
      if (isEmpty(target, state)) {
        moves.push({ from: square, to: target, kind: MOVE_KIND.NORMAL });
        continue;
      }

      if (isEnemyPiece(state, target, color)) {
        moves.push({ from: square, to: target, kind: MOVE_KIND.NORMAL });
        break;
      }

      break;
    }
  }

  return moves;
};
