import {
  COLOR,
  PIECE_TYPE,
  type Color,
  type GameState,
  type Square,
} from '../models/game-state.js';
import { getFile, getOpponentColor, getRank } from '../utils/board-utils.js';
import { getKingTargets } from '../utils/king-move-table.js';
import { getKnightTargets } from '../utils/knight-move-table.js';
import { DIRECTION } from '../utils/ray-table.js';
import { getSlidingMoves } from './sliding-engine.js';

export const isSquareAttacked = (square: Square, attackerColor: Color, state: GameState) => {
  if (isAttackedByPawn(square, attackerColor, state)) return true;
  if (isAttackedByKnight(square, attackerColor, state)) return true;
  if (isAttackedByKing(square, attackerColor, state)) return true;
  if (isAttackedByBishop(square, attackerColor, state)) return true;
  if (isAttackedByRook(square, attackerColor, state)) return true;
  return false;
};

const isAttackedByPawn = (square: Square, attackerColor: Color, state: GameState) => {
  const attackedSquare =
    attackerColor === COLOR.WHITE
      ? [
          { dx: -1, dy: -1 },
          { dx: 1, dy: -1 },
        ]
      : [
          { dx: -1, dy: 1 },
          { dx: 1, dy: 1 },
        ];
  const file = getFile(square);
  const rank = getRank(square);

  for (const { dx, dy } of attackedSquare) {
    const targetFile = file + dx;
    const targetRank = rank + dy;
    if (targetFile >= 0 && targetFile <= 7 && targetRank >= 0 && targetRank <= 7) {
      const targetSquare = targetFile + targetRank * 8;
      if (
        state.board[targetSquare]?.type === PIECE_TYPE.PAWN &&
        state.board[targetSquare]?.color === attackerColor
      ) {
        return true;
      }
    }
  }
  return false;
};
const isAttackedByKnight = (square: Square, attackerColor: Color, state: GameState) => {
  const attackedSquare = getKnightTargets(square);
  for (const targetSquare of attackedSquare) {
    if (
      state.board[targetSquare]?.type === PIECE_TYPE.KNIGHT &&
      state.board[targetSquare]?.color === attackerColor
    ) {
      return true;
    }
  }
  return false;
};
const isAttackedByKing = (square: Square, attackerColor: Color, state: GameState) => {
  const attackedSquare = getKingTargets(square);
  for (const targetSquare of attackedSquare) {
    if (
      state.board[targetSquare]?.type === PIECE_TYPE.KING &&
      state.board[targetSquare]?.color === attackerColor
    ) {
      return true;
    }
  }
  return false;
};
const isAttackedByBishop = (square: Square, attackerColor: Color, state: GameState) => {
  const directions = [
    DIRECTION.NORTH_EAST,
    DIRECTION.SOUTH_EAST,
    DIRECTION.NORTH_WEST,
    DIRECTION.SOUTH_WEST,
  ];

  const color = getOpponentColor(attackerColor);

  const attackedSquare = getSlidingMoves(square, directions, state, color);
  for (const targetSquare of attackedSquare) {
    if (
      state.board[targetSquare]?.type === PIECE_TYPE.BISHOP ||
      state.board[targetSquare]?.type === PIECE_TYPE.QUEEN
    ) {
      return true;
    }
  }

  return false;
};
const isAttackedByRook = (square: Square, attackerColor: Color, state: GameState) => {
  const directions = [DIRECTION.NORTH, DIRECTION.SOUTH, DIRECTION.EAST, DIRECTION.WEST];

  const color = getOpponentColor(attackerColor);

  const attackedSquare = getSlidingMoves(square, directions, state, color);
  for (const targetSquare of attackedSquare) {
    if (
      state.board[targetSquare]?.type === PIECE_TYPE.ROOK ||
      state.board[targetSquare]?.type === PIECE_TYPE.QUEEN
    ) {
      return true;
    }
  }

  return false;
};
