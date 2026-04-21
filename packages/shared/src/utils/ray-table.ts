import { type Square } from '../models/game-state.js';
import { getFile, getRank } from './board-utils.js';

export const DIRECTION = {
  NORTH: 0,
  SOUTH: 1,
  EAST: 2,
  WEST: 3,
  NORTH_EAST: 4,
  NORTH_WEST: 5,
  SOUTH_EAST: 6,
  SOUTH_WEST: 7,
} as const;
export type Direction = (typeof DIRECTION)[keyof typeof DIRECTION];

export const RAY_DIRECTION = {
  [DIRECTION.NORTH]: { dx: 0, dy: 1 },
  [DIRECTION.SOUTH]: { dx: 0, dy: -1 },
  [DIRECTION.EAST]: { dx: 1, dy: 0 },
  [DIRECTION.WEST]: { dx: -1, dy: 0 },
  [DIRECTION.NORTH_EAST]: { dx: 1, dy: 1 },
  [DIRECTION.NORTH_WEST]: { dx: -1, dy: 1 },
  [DIRECTION.SOUTH_EAST]: { dx: 1, dy: -1 },
  [DIRECTION.SOUTH_WEST]: { dx: -1, dy: -1 },
} as const;

export type Ray = Square[];

export type RaysByDirection = readonly [
  north: Ray,
  south: Ray,
  east: Ray,
  west: Ray,
  northEast: Ray,
  northWest: Ray,
  southEast: Ray,
  southWest: Ray,
];

export type RayTable = RaysByDirection[];

const createRay = (square: Square, direction: Direction): Ray => {
  const rayDirection = RAY_DIRECTION[direction];
  const ray: Square[] = [];

  const file = getFile(square);
  const rank = getRank(square);

  let currentFile = file + rayDirection.dx;
  let currentRank = rank + rayDirection.dy;

  while (currentFile >= 0 && currentFile <= 7 && currentRank >= 0 && currentRank <= 7) {
    const square = currentFile + currentRank * 8;
    ray.push(square as Square);

    currentFile += rayDirection.dx;
    currentRank += rayDirection.dy;
  }

  return ray;
};

const createRaysByDirection = (square: Square): RaysByDirection => [
  createRay(square, DIRECTION.NORTH),
  createRay(square, DIRECTION.SOUTH),
  createRay(square, DIRECTION.EAST),
  createRay(square, DIRECTION.WEST),
  createRay(square, DIRECTION.NORTH_EAST),
  createRay(square, DIRECTION.NORTH_WEST),
  createRay(square, DIRECTION.SOUTH_EAST),
  createRay(square, DIRECTION.SOUTH_WEST),
];

const createRayTable = (): RayTable =>
  Array.from({ length: 64 }, (_, square) => createRaysByDirection(square as Square));

/**
 * 방향별 ray 테이블 생성
 *
 * @example
 * RAY_TABLE[SQUARE][DIRECTION]
 */
export const RAY_TABLE = createRayTable();

export const getRay = (square: Square, direction: Direction): Ray => RAY_TABLE[square]![direction];
