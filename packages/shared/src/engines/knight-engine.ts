import { FILE, type GameState, type Square } from '../models/game-state.js';
import { getColor, getFile, isEmpty, isEnemyPiece, toSquare } from '../utils/board-utils.js';

/**
 * [TASK-005] 나이트(Knight)의 합법 수 판정 로직
 * @param square 현재 나이트의 위치 (0-63)
 * @param state 현재 게임 상태
 * @returns 이동 가능한 좌표 배열
 */
export const getKnightMoves = (square: Square, state: GameState): Square[] => {
  const piece = state.board[square];
  if (!piece) {
    return [];
  }

  const KNIGHT_MOVES = [
    { plus: 17, startFile: FILE.A, endFile: FILE.G },
    { plus: 15, startFile: FILE.B, endFile: FILE.H },
    { plus: 10, startFile: FILE.A, endFile: FILE.F },
    { plus: 6, startFile: FILE.C, endFile: FILE.H },
    { plus: -6, startFile: FILE.A, endFile: FILE.F },
    { plus: -10, startFile: FILE.C, endFile: FILE.H },
    { plus: -15, startFile: FILE.A, endFile: FILE.G },
    { plus: -17, startFile: FILE.B, endFile: FILE.H },
  ];

  const moves: Square[] = [];
  const file = getFile(square);
  const color = getColor(piece);

  for (const move of KNIGHT_MOVES) {
    if (move.startFile <= file && file <= move.endFile) {
      const target = toSquare(square + move.plus);

      if (target !== null && (isEmpty(target, state) || isEnemyPiece(state, target, color))) {
        moves.push(target);
      }
    }
  }

  return moves;
};
