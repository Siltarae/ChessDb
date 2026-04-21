import { type GameState, type Square } from '../models/game-state.js';
import { getColor, isEmpty, isEnemyPiece } from '../utils/board-utils.js';
import { getKnightTargets } from '../utils/knight-move-table.js';

/**
 * [TASK-005] 나이트(Knight)의 합법 수 판정 로직
 * @param square 현재 나이트의 위치 (0-63)
 * @param state 현재 게임 상태
 * @returns 이동 가능한 좌표 배열
 */
export const getKnightMoves = (square: Square, state: GameState): Square[] => {
  const piece = state.board[square];
  if (!piece) {
    return [];
  }

  const moves: Square[] = [];
  const color = getColor(piece);

  const targets = getKnightTargets(square);

  for (const target of targets) {
    if (isEmpty(target, state) || isEnemyPiece(state, target, color)) {
      moves.push(target);
    }
  }

  return moves;
};
