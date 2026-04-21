import { describe, expect, it } from 'vitest';
import { SQUARE } from '../models/game-state.js';
import { getKnightTargets, KNIGHT_MOVE_TABLE } from './knight-move-table.js';

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

const getFile = (square: number): number => square % 8;
const getRank = (square: number): number => Math.floor(square / 8);

describe('KnightMoveTable', () => {
  describe('대표 square의 이동을 확인할 때', () => {
    it('D4의 나이트 이동은 8개의 L자 칸을 정확히 가져야 한다', () => {
      expect(getKnightTargets(SQUARE.D4)).toEqual([
        SQUARE.C2,
        SQUARE.E2,
        SQUARE.B3,
        SQUARE.F3,
        SQUARE.B5,
        SQUARE.F5,
        SQUARE.C6,
        SQUARE.E6,
      ]);
    });

    it('A1의 나이트 이동은 보드 내부인 2칸만 가져야 한다', () => {
      expect(getKnightTargets(SQUARE.A1)).toEqual([SQUARE.C2, SQUARE.B3]);
    });

    it('H8의 나이트 이동은 보드 내부인 2칸만 가져야 한다', () => {
      expect(getKnightTargets(SQUARE.H8)).toEqual([SQUARE.G6, SQUARE.F7]);
    });

    it('A4의 나이트 이동은 왼쪽 경계를 넘지 않는 4칸만 가져야 한다', () => {
      expect(getKnightTargets(SQUARE.A4)).toEqual([SQUARE.B2, SQUARE.C3, SQUARE.C5, SQUARE.B6]);
    });

    it('H5의 나이트 이동은 오른쪽 경계를 넘지 않는 4칸만 가져야 한다', () => {
      expect(getKnightTargets(SQUARE.H5)).toEqual([SQUARE.G3, SQUARE.F4, SQUARE.F6, SQUARE.G7]);
    });
  });

  describe('공통 안전성을 확인할 때', () => {
    it('지정한 대표 square들은 knight move 배열을 가져야 한다', () => {
      REPRESENTATIVE_SQUARES.forEach((square) => {
        expect(KNIGHT_MOVE_TABLE[square]).toBeDefined();
        expect(Array.isArray(getKnightTargets(square))).toBe(true);
      });
    });

    it('모든 square는 이동 개수가 0 이상 8 이하여야 한다', () => {
      KNIGHT_MOVE_TABLE.forEach((moves) => {
        expect(moves.length).toBeGreaterThanOrEqual(0);
        expect(moves.length).toBeLessThanOrEqual(8);
      });
    });

    it('모든 이동 대상은 0 이상 63 이하의 유효한 보드 인덱스여야 한다', () => {
      KNIGHT_MOVE_TABLE.forEach((moves) => {
        moves.forEach((target) => {
          expect(target).toBeGreaterThanOrEqual(0);
          expect(target).toBeLessThanOrEqual(63);
        });
      });
    });

    it('각 square의 이동 목록에는 중복 target이 없어야 한다', () => {
      KNIGHT_MOVE_TABLE.forEach((moves) => {
        expect(new Set(moves).size).toBe(moves.length);
      });
    });

    it('모든 이동은 반드시 나이트의 L자 규칙을 만족해야 한다', () => {
      KNIGHT_MOVE_TABLE.forEach((moves, origin) => {
        const originFile = getFile(origin);
        const originRank = getRank(origin);

        moves.forEach((target) => {
          const fileDelta = Math.abs(getFile(target) - originFile);
          const rankDelta = Math.abs(getRank(target) - originRank);

          expect(fileDelta * rankDelta).toBe(2);
        });
      });
    });

    it('모서리 4칸은 항상 2개의 이동만 가져야 한다', () => {
      expect(getKnightTargets(SQUARE.A1)).toHaveLength(2);
      expect(getKnightTargets(SQUARE.H1)).toHaveLength(2);
      expect(getKnightTargets(SQUARE.A8)).toHaveLength(2);
      expect(getKnightTargets(SQUARE.H8)).toHaveLength(2);
    });

    it('중앙에 가까운 D4와 E5는 항상 8개의 이동을 가져야 한다', () => {
      expect(getKnightTargets(SQUARE.D4)).toHaveLength(8);
      expect(getKnightTargets(SQUARE.E5)).toHaveLength(8);
    });
  });
});
