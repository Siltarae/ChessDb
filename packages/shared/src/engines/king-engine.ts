import { PIECE_TYPE, type GameState, type Square } from '../models/game-state.js';
import { getColor, isEmpty, isEnemyPiece } from '../utils/board-utils.js';
import { getKingTargets } from '../utils/king-move-table.js';
import { getCastlingMoves } from './castling-engine.js';

/**
 * 특정 칸의 킹이 이동할 수 있는 의사 합법 수를 반환합니다.
 *
 * @param square 이동할 킹이 있는 시작 칸
 * @param state 현재 게임 상태
 * @returns 킹의 의사 합법 이동 칸 목록
 *
 * const moves = getKingMoves(SQUARE.E1, state);
 */
export const getKingMoves = (square: Square, state: GameState): Square[] => {
  const piece = state.board[square];
  if (!piece || piece.type !== PIECE_TYPE.KING) {
    return [];
  }
  const color = getColor(piece);

  const targets = getKingTargets(square);
  const moves: Square[] = [];

  for (const target of targets) {
    if (isEmpty(target, state) || isEnemyPiece(state, target, color)) {
      moves.push(target);
    }
  }

  moves.push(...getCastlingMoves(state, color));

  return moves;
};
