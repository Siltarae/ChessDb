import {
  MOVE_KIND,
  PIECE_TYPE,
  type GameState,
  type Move,
  type Square,
} from '../models/game-state.js';
import { getBishopMoves } from './bishop-engine.js';
import { isCheck } from './check-engine.js';
import { executeEnPassant } from './en-passant-engine.js';
import { getKingMoves } from './king-engine.js';
import { getKnightMoves } from './knight-engine.js';
import { getPawnMoves } from './pawn-engine.js';
import { getQueenMoves } from './queen-engine.js';
import { getRookMoves } from './rook-engine.js';

/**
 * 특정 칸의 기물이 실제로 둘 수 있는 합법 수만 반환합니다.
 *
 * @param square 이동 후보를 구할 시작 칸
 * @param state 현재 게임 상태
 * @returns 체크 상태를 통과한 합법 이동 칸 목록
 *
 * const moves = getLegalMoves(SQUARE.E2, state);
 */
export const getLegalMoves = (square: Square, state: GameState): Move[] => {
  const piece = state.board[square];

  if (piece == null || state.turn !== piece.color) {
    return [];
  }

  const moves = getPseudoLegalMoves(square, state);

  const color = state.turn;

  const legalMoves: Move[] = [];

  for (const move of moves) {
    const newState = simulateMove(square, move, state);
    if (!isCheck(newState, color)) {
      legalMoves.push(move);
    }
  }

  return legalMoves;
};

const getPseudoLegalMoves = (square: Square, state: GameState): Move[] => {
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

const simulateMove = (square: Square, move: Move, state: GameState): GameState => {
  const newBoard = [...state.board];
  const piece = newBoard[square]!;

  const isEnPassantMove = move.kind === MOVE_KIND.EN_PASSANT;

  if (isEnPassantMove) {
    return executeEnPassant(square, move.to, state);
  }

  newBoard[move.to] = piece;
  newBoard[square] = null;

  return {
    ...state,
    board: newBoard,
  };
};
