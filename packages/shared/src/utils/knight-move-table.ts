import { FILE, type Square } from '../models/game-state.js';
import { getFile, toSquare } from './board-utils.js';

export type KnightMoves = readonly Square[];
export type KnightMoveTable = KnightMoves[];

const KNIGHT_MOVES = [
  { plus: -17, startFile: FILE.B, endFile: FILE.H },
  { plus: -15, startFile: FILE.A, endFile: FILE.G },
  { plus: -10, startFile: FILE.C, endFile: FILE.H },
  { plus: -6, startFile: FILE.A, endFile: FILE.F },
  { plus: 6, startFile: FILE.C, endFile: FILE.H },
  { plus: 10, startFile: FILE.A, endFile: FILE.F },
  { plus: 15, startFile: FILE.B, endFile: FILE.H },
  { plus: 17, startFile: FILE.A, endFile: FILE.G },
];

const createKnightMove = (square: Square): Square[] => {
  const moves: Square[] = [];
  const file = getFile(square);

  for (const move of KNIGHT_MOVES) {
    if (move.startFile <= file && file <= move.endFile) {
      const target = toSquare(square + move.plus);

      if (target !== null) {
        moves.push(target);
      }
    }
  }

  return moves;
};

const createKnightMoveTable = (): KnightMoveTable =>
  Array.from({ length: 64 }, (_, square) => createKnightMove(square as Square));

/**
 * 시작 칸별 나이트 이동 테이블을 반환합니다.
 *
 * @returns 각 시작 칸에 대응하는 나이트 이동 후보 테이블
 *
 * const table = KNIGHT_MOVE_TABLE;
 */
export const KNIGHT_MOVE_TABLE = createKnightMoveTable();

/**
 * 특정 칸의 나이트 기본 이동 후보를 조회합니다.
 *
 * @param square 이동 후보를 조회할 시작 칸
 * @returns 해당 칸에서 도달 가능한 나이트 이동 칸 목록
 *
 * const targets = getKnightTargets(SQUARE.B1);
 */
export const getKnightTargets = (square: Square): KnightMoves => KNIGHT_MOVE_TABLE[square]!;
