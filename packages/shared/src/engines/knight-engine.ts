import { MOVE_KIND, type GameState, type Move, type Square } from '../models/game-state.js';
import { getColor, isEmpty, isEnemyPiece } from '../utils/board-utils.js';
import { getKnightTargets } from '../utils/knight-move-table.js';

/**
 * 특정 칸의 나이트가 이동할 수 있는 의사 합법 수를 반환합니다.
 *
 * @param square 이동할 나이트가 있는 시작 칸
 * @param state 현재 게임 상태
 * @returns 나이트의 의사 합법 이동 칸 목록
 *
 * const moves = getKnightMoves(SQUARE.B1, state);
 */
export const getKnightMoves = (square: Square, state: GameState): Move[] => {
  const piece = state.board[square];
  if (!piece) {
    return [];
  }

  const moves: Move[] = [];
  const color = getColor(piece);

  const targets = getKnightTargets(square);

  for (const target of targets) {
    if (isEmpty(target, state) || isEnemyPiece(state, target, color)) {
      moves.push({ from: square, to: target, kind: MOVE_KIND.NORMAL });
    }
  }

  return moves;
};
