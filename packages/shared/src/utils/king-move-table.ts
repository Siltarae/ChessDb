import type { Square } from '../models/game-state.js';
import { getFile, getRank } from './board-utils.js';

export type KingMove = Square[];
export type KingMoveTable = KingMove[];

const createKingMove = (square: Square): KingMove => {
  const kingMove: Square[] = [];

  const file = getFile(square);
  const rank = getRank(square);

  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (dx === 0 && dy === 0) continue;
      const targetFile = file + dx;
      const targetRank = rank + dy;
      if (targetFile >= 0 && targetFile <= 7 && targetRank >= 0 && targetRank <= 7) {
        const square = targetFile + targetRank * 8;
        kingMove.push(square as Square);
      }
    }
  }

  return kingMove;
};

const createKingMoveTable = (): KingMoveTable => {
  const kingMoveTable: KingMoveTable = [];

  for (let i = 0; i < 64; i++) {
    const square = i as Square;
    kingMoveTable.push(createKingMove(square));
  }

  return kingMoveTable;
};

/**
 * 시작 칸별 킹 이동 테이블을 반환합니다.
 *
 * @returns 각 시작 칸에 대응하는 킹 이동 후보 테이블
 *
 * const table = KING_MOVE_TABLE;
 */
export const KING_MOVE_TABLE = createKingMoveTable();

/**
 * 특정 칸의 킹 기본 이동 후보를 조회합니다.
 *
 * @param square 이동 후보를 조회할 시작 칸
 * @returns 해당 칸에서 도달 가능한 킹 이동 칸 목록
 *
 * const targets = getKingTargets(SQUARE.E4);
 */
export const getKingTargets = (square: Square): KingMove => KING_MOVE_TABLE[square]!;
