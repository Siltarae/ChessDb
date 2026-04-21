import { describe, expect, it } from 'vitest';
import { SQUARE } from '../models/game-state.js';
import { DIRECTION, RAY_TABLE } from './ray-table.js';

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

const ALL_DIRECTIONS = [
  DIRECTION.NORTH,
  DIRECTION.SOUTH,
  DIRECTION.EAST,
  DIRECTION.WEST,
  DIRECTION.NORTH_EAST,
  DIRECTION.NORTH_WEST,
  DIRECTION.SOUTH_EAST,
  DIRECTION.SOUTH_WEST,
] as const;

const getFile = (square: number): number => square % 8;
const getRank = (square: number): number => Math.floor(square / 8);
const getRaysBySquare = (square: number) => RAY_TABLE[square]!;

describe('RayTable', () => {
  describe('중앙 칸의 ray를 확인할 때', () => {
    it('D4의 동쪽 ray는 같은 랭크의 오른쪽 칸만 순서대로 가져야 한다', () => {
      expect(getRaysBySquare(SQUARE.D4)[DIRECTION.EAST]).toEqual([
        SQUARE.E4,
        SQUARE.F4,
        SQUARE.G4,
        SQUARE.H4,
      ]);
    });

    it('D4의 북동쪽 ray는 대각선 위 칸만 순서대로 가져야 한다', () => {
      expect(getRaysBySquare(SQUARE.D4)[DIRECTION.NORTH_EAST]).toEqual([
        SQUARE.E5,
        SQUARE.F6,
        SQUARE.G7,
        SQUARE.H8,
      ]);
    });

    it('D4의 남서쪽 ray는 대각선 아래 칸만 순서대로 가져야 한다', () => {
      expect(getRaysBySquare(SQUARE.D4)[DIRECTION.SOUTH_WEST]).toEqual([
        SQUARE.C3,
        SQUARE.B2,
        SQUARE.A1,
      ]);
    });
  });

  describe('가장자리 칸의 ray를 확인할 때', () => {
    it('A1의 서쪽과 남쪽 ray는 빈 배열이어야 한다', () => {
      expect(getRaysBySquare(SQUARE.A1)[DIRECTION.WEST]).toEqual([]);
      expect(getRaysBySquare(SQUARE.A1)[DIRECTION.SOUTH]).toEqual([]);
    });

    it('A1의 북동쪽 ray는 보드 경계를 넘지 않아야 한다', () => {
      expect(getRaysBySquare(SQUARE.A1)[DIRECTION.NORTH_EAST]).toEqual([
        SQUARE.B2,
        SQUARE.C3,
        SQUARE.D4,
        SQUARE.E5,
        SQUARE.F6,
        SQUARE.G7,
        SQUARE.H8,
      ]);
    });

    it('H8의 동쪽과 북쪽 ray는 빈 배열이어야 한다', () => {
      expect(getRaysBySquare(SQUARE.H8)[DIRECTION.EAST]).toEqual([]);
      expect(getRaysBySquare(SQUARE.H8)[DIRECTION.NORTH]).toEqual([]);
    });
  });

  describe('공통 안전성을 확인할 때', () => {
    it('지정한 대표 square들은 모든 방향 ray를 정확히 가져야 한다', () => {
      REPRESENTATIVE_SQUARES.forEach((square) => {
        const raysByDirection = getRaysBySquare(square);

        expect(raysByDirection).toBeDefined();
        expect(Object.keys(raysByDirection)).toHaveLength(8);

        ALL_DIRECTIONS.forEach((direction) => {
          expect(raysByDirection[direction]).toBeDefined();
        });
      });
    });

    it('모든 square는 direction 개수가 정확히 8개여야 한다', () => {
      Object.values(RAY_TABLE).forEach((raysByDirection) => {
        expect(Object.keys(raysByDirection)).toHaveLength(8);
      });
    });

    it('각 ray의 길이는 0 이상 7 이하여야 한다', () => {
      Object.values(RAY_TABLE).forEach((raysByDirection) => {
        Object.values(raysByDirection).forEach((ray) => {
          expect(ray.length).toBeGreaterThanOrEqual(0);
          expect(ray.length).toBeLessThanOrEqual(7);
        });
      });
    });

    it('모든 ray의 대상 칸은 0 이상 63 이하의 유효한 보드 인덱스여야 한다', () => {
      Object.values(RAY_TABLE).forEach((rays) => {
        Object.values(rays).forEach((ray) => {
          ray?.forEach((target) => {
            expect(target).toBeGreaterThanOrEqual(0);
            expect(target).toBeLessThanOrEqual(63);
          });
        });
      });
    });

    it('각 ray 안에는 중복 square가 없어야 한다', () => {
      Object.values(RAY_TABLE).forEach((raysByDirection) => {
        Object.values(raysByDirection).forEach((ray) => {
          expect(new Set(ray).size).toBe(ray.length);
        });
      });
    });

    it('ray 순서는 반드시 시작 칸에서 가까운 칸부터여야 한다', () => {
      Object.entries(RAY_TABLE).forEach(([originKey, raysByDirection]) => {
        const origin = Number(originKey);
        const originFile = getFile(origin);
        const originRank = getRank(origin);

        Object.values(raysByDirection).forEach((ray) => {
          let previousDistance = 0;

          ray.forEach((target) => {
            const fileDistance = Math.abs(getFile(target) - originFile);
            const rankDistance = Math.abs(getRank(target) - originRank);
            const distance = Math.max(fileDistance, rankDistance);

            expect(distance).toBe(previousDistance + 1);
            previousDistance = distance;
          });
        });
      });
    });

    it('각 ray는 같은 rank, file 또는 diagonal 위의 square만 포함해야 한다', () => {
      Object.entries(RAY_TABLE).forEach(([originKey, raysByDirection]) => {
        const origin = Number(originKey);
        const originFile = getFile(origin);
        const originRank = getRank(origin);

        Object.entries(raysByDirection).forEach(([directionKey, ray]) => {
          const direction = Number(directionKey);

          ray.forEach((target) => {
            const fileDelta = getFile(target) - originFile;
            const rankDelta = getRank(target) - originRank;

            switch (direction) {
              case DIRECTION.NORTH:
                expect(fileDelta).toBe(0);
                expect(rankDelta).toBeGreaterThan(0);
                break;
              case DIRECTION.SOUTH:
                expect(fileDelta).toBe(0);
                expect(rankDelta).toBeLessThan(0);
                break;
              case DIRECTION.EAST:
                expect(fileDelta).toBeGreaterThan(0);
                expect(rankDelta).toBe(0);
                break;
              case DIRECTION.WEST:
                expect(fileDelta).toBeLessThan(0);
                expect(rankDelta).toBe(0);
                break;
              case DIRECTION.NORTH_EAST:
                expect(fileDelta).toBeGreaterThan(0);
                expect(rankDelta).toBeGreaterThan(0);
                expect(Math.abs(fileDelta)).toBe(Math.abs(rankDelta));
                break;
              case DIRECTION.NORTH_WEST:
                expect(fileDelta).toBeLessThan(0);
                expect(rankDelta).toBeGreaterThan(0);
                expect(Math.abs(fileDelta)).toBe(Math.abs(rankDelta));
                break;
              case DIRECTION.SOUTH_EAST:
                expect(fileDelta).toBeGreaterThan(0);
                expect(rankDelta).toBeLessThan(0);
                expect(Math.abs(fileDelta)).toBe(Math.abs(rankDelta));
                break;
              case DIRECTION.SOUTH_WEST:
                expect(fileDelta).toBeLessThan(0);
                expect(rankDelta).toBeLessThan(0);
                expect(Math.abs(fileDelta)).toBe(Math.abs(rankDelta));
                break;
              default:
                throw new Error(`지원하지 않는 direction: ${direction}`);
            }
          });
        });
      });
    });
  });
});
