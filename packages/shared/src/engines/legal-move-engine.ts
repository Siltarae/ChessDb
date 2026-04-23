import { PIECE_TYPE, type GameState, type Square } from '../models/game-state.js';
import { getBishopMoves } from './bishop-engine.js';
import { isCheck } from './check-engine.js';
import { getKingMoves } from './king-engine.js';
import { getKnightMoves } from './knight-engine.js';
import { getPawnMoves } from './pawn-engine.js';
import { getQueenMoves } from './queen-engine.js';
import { getRookMoves } from './rook-engine.js';

/**
 * [TASK-011] 체크 상태 기준 합법 수 필터링 로직 스켈레톤
 * 현재는 테스트/구현 진입점을 고정하기 위한 최소 뼈대만 제공합니다.
 */
export const getLegalMoves = (square: Square, state: GameState): Square[] => {
  const piece = state.board[square];

  if (piece == null || state.turn !== piece.color) {
    return [];
  }

  const moves = getPseudoLegalMoves(square, state);

  const color = state.turn;

  const legalMoves: Square[] = [];

  for (const targetSquare of moves) {
    const newState = simulateMove(square, targetSquare, state);
    if (!isCheck(newState, color)) {
      legalMoves.push(targetSquare);
    }
  }

  return legalMoves;
};

const getPseudoLegalMoves = (square: Square, state: GameState): Square[] => {
  const piece = state.board[square]!;
  switch (piece.type) {
    case PIECE_TYPE.PAWN:
      return getPawnMoves(square, state);
    case PIECE_TYPE.KNIGHT:
      return getKnightMoves(square, state);
    case PIECE_TYPE.BISHOP:
      return getBishopMoves(square, state);
    case PIECE_TYPE.ROOK:
      return getRookMoves(square, state);
    case PIECE_TYPE.QUEEN:
      return getQueenMoves(square, state);
    case PIECE_TYPE.KING:
      return getKingMoves(square, state);
    default:
      return [];
  }
};

const simulateMove = (square: Square, targetSquare: Square, state: GameState): GameState => {
  const newBoard = [...state.board];
  const piece = newBoard[square]!;

  newBoard[targetSquare] = piece;
  newBoard[square] = null;

  return {
    ...state,
    board: newBoard,
  };
};
