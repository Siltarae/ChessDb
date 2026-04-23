import { COLOR, FILE, RANK, type GameState, type Square } from '../models/game-state.js';
import {
  getColor,
  getFile,
  getRank,
  isEmpty,
  isEnemyPiece,
  toSquare,
} from '../utils/board-utils.js';

/**
 * 특정 칸의 폰이 이동할 수 있는 의사 합법 수를 반환합니다.
 *
 * @param square 이동할 폰이 있는 시작 칸
 * @param state 현재 게임 상태
 * @returns 폰의 의사 합법 이동 칸 목록
 *
 * const moves = getPawnMoves(SQUARE.E2, state);
 */
export const getPawnMoves = (square: Square, state: GameState): Square[] => {
  const piece = state.board[square];
  if (!piece) {
    return [];
  }
  const color = getColor(piece);

  const pawnMove = {
    pushOne: color === COLOR.WHITE ? 8 : -8,
    pushTwo: color === COLOR.WHITE ? 16 : -16,
    captureWest: color === COLOR.WHITE ? 7 : -9,
    captureEast: color === COLOR.WHITE ? 9 : -7,
    startRank: color === COLOR.WHITE ? RANK[2] : RANK[7],
    endRank: color === COLOR.WHITE ? RANK[8] : RANK[1],
  };

  const moves: Square[] = [];
  const rank = getRank(square);
  const file = getFile(square);

  const oneStep = toSquare(square + pawnMove.pushOne);
  const twoStep = toSquare(square + pawnMove.pushTwo);

  const westCapture = toSquare(square + pawnMove.captureWest);
  const eastCapture = toSquare(square + pawnMove.captureEast);

  // 전진 1칸
  if (rank !== pawnMove.endRank && oneStep !== null && isEmpty(oneStep, state)) {
    moves.push(oneStep);
  }

  // 전진 2칸 (시작 위치이고 경로가 비어있을 때)
  if (
    rank === pawnMove.startRank &&
    oneStep !== null &&
    twoStep !== null &&
    isEmpty(oneStep, state) &&
    isEmpty(twoStep, state)
  ) {
    moves.push(twoStep);
  }

  // 서쪽 대각선 캡처
  if (file !== FILE.A && westCapture !== null && isEnemyPiece(state, westCapture, color)) {
    moves.push(westCapture);
  }

  // 동쪽 대각선 캡처
  if (file !== FILE.H && eastCapture !== null && isEnemyPiece(state, eastCapture, color)) {
    moves.push(eastCapture);
  }

  return moves;
};
