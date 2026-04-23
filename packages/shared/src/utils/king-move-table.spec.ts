import { describe, expect, it } from 'vitest';
import type { Square } from '../models/game-state.js';
import { SQUARE } from '../models/game-state.js';
import { getFile, getRank } from './board-utils.js';
import { getKingTargets, KING_MOVE_TABLE } from './king-move-table.js';

const REPRESENTATIVE_SQUARES = [
  SQUARE.A1,
  SQUARE.H1,
  SQUARE.A8,
  SQUARE.H8,
  SQUARE.A4,
  SQUARE.H5,
  SQUARE.D1,
  SQUARE.E8,
  SQUARE.D4,
  SQUARE.E5,
] as const;

describe('KingMoveTable', () => {
  describe('대표 square의 이동을 확인할 때', () => {
    it('D4의 킹 이동은 주변 8칸을 정확히 가져야 한다', () => {
      const moves = getKingTargets(SQUARE.D4);

      expect(moves).toHaveLength(8);
      expect(moves).toEqual(
        expect.arrayContaining([
          SQUARE.C3,
          SQUARE.D3,
          SQUARE.E3,
          SQUARE.C4,
          SQUARE.E4,
          SQUARE.C5,
          SQUARE.D5,
          SQUARE.E5,
        ]),
      );
    });

    it('A1의 킹 이동은 보드 내부인 3칸만 가져야 한다', () => {
      const moves = getKingTargets(SQUARE.A1);

      expect(moves).toHaveLength(3);
      expect(moves).toEqual(expect.arrayContaining([SQUARE.B1, SQUARE.A2, SQUARE.B2]));
    });

    it('H8의 킹 이동은 보드 내부인 3칸만 가져야 한다', () => {
      const moves = getKingTargets(SQUARE.H8);

      expect(moves).toHaveLength(3);
      expect(moves).toEqual(expect.arrayContaining([SQUARE.G7, SQUARE.H7, SQUARE.G8]));
    });

    it('A4의 킹 이동은 왼쪽 경계를 넘지 않는 5칸만 가져야 한다', () => {
      const moves = getKingTargets(SQUARE.A4);

      expect(moves).toHaveLength(5);
      expect(moves).toEqual(
        expect.arrayContaining([SQUARE.A3, SQUARE.B3, SQUARE.B4, SQUARE.A5, SQUARE.B5]),
      );
    });

    it('H5의 킹 이동은 오른쪽 경계를 넘지 않는 5칸만 가져야 한다', () => {
      const moves = getKingTargets(SQUARE.H5);

      expect(moves).toHaveLength(5);
      expect(moves).toEqual(
        expect.arrayContaining([SQUARE.G4, SQUARE.H4, SQUARE.G5, SQUARE.G6, SQUARE.H6]),
      );
    });
  });

  describe('공통 안전성을 확인할 때', () => {
    it('지정한 대표 square들은 king move 배열을 가져야 한다', () => {
      REPRESENTATIVE_SQUARES.forEach((square) => {
        expect(KING_MOVE_TABLE[square]).toBeDefined();
        expect(Array.isArray(getKingTargets(square))).toBe(true);
      });
    });

    it('모든 square는 이동 개수가 0 이상 8 이하여야 한다', () => {
      KING_MOVE_TABLE.forEach((moves) => {
        expect(moves.length).toBeGreaterThanOrEqual(0);
        expect(moves.length).toBeLessThanOrEqual(8);
      });
    });

    it('모든 이동 대상은 0 이상 63 이하의 유효한 보드 인덱스여야 한다', () => {
      KING_MOVE_TABLE.forEach((moves) => {
        moves.forEach((target) => {
          expect(target).toBeGreaterThanOrEqual(0);
          expect(target).toBeLessThanOrEqual(63);
        });
      });
    });

    it('각 square의 이동 목록에는 중복 target이 없어야 한다', () => {
      KING_MOVE_TABLE.forEach((moves) => {
        expect(new Set(moves).size).toBe(moves.length);
      });
    });

    it('모든 이동은 반드시 파일과 랭크 차이가 각각 1 이하인 인접 칸이어야 한다', () => {
      KING_MOVE_TABLE.forEach((moves, origin) => {
        const originSquare = origin as Square;
        const originFile = getFile(originSquare);
        const originRank = getRank(originSquare);

        moves.forEach((target) => {
          const fileDelta = Math.abs(getFile(target) - originFile);
          const rankDelta = Math.abs(getRank(target) - originRank);

          expect(fileDelta).toBeLessThanOrEqual(1);
          expect(rankDelta).toBeLessThanOrEqual(1);
          expect(fileDelta === 0 && rankDelta === 0).toBe(false);
        });
      });
    });

    it('모서리 4칸은 항상 3개의 이동만 가져야 한다', () => {
      expect(getKingTargets(SQUARE.A1)).toHaveLength(3);
      expect(getKingTargets(SQUARE.H1)).toHaveLength(3);
      expect(getKingTargets(SQUARE.A8)).toHaveLength(3);
      expect(getKingTargets(SQUARE.H8)).toHaveLength(3);
    });

    it('중앙에 가까운 D4와 E5는 항상 8개의 이동을 가져야 한다', () => {
      expect(getKingTargets(SQUARE.D4)).toHaveLength(8);
      expect(getKingTargets(SQUARE.E5)).toHaveLength(8);
    });
  });
});
