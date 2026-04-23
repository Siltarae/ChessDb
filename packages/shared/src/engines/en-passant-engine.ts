import {
  COLOR,
  MOVE_KIND,
  PIECE_TYPE,
  type Color,
  type GameState,
  type Move,
  type Square,
} from '../models/game-state.js';
import { getColor, getFile, toSquare } from '../utils/board-utils.js';

const PAWN_MOVE = {
  captureWest: { [COLOR.WHITE]: 7, [COLOR.BLACK]: -9 },
  captureEast: { [COLOR.WHITE]: 9, [COLOR.BLACK]: -7 },
} as const;

/**
 * 특정 칸의 폰이 수행할 수 있는 앙파상 이동 칸을 반환합니다.
 *
 * @param square 이동할 폰이 있는 시작 칸
 * @param state 현재 게임 상태
 * @returns 앙파상으로 이동 가능한 목적지 칸 목록
 *
 * const moves = getEnPassantMoves(SQUARE.E5, state);
 */
export const getEnPassantMoves = (square: Square, state: GameState): Move[] => {
  const pawn = state.board[square];
  if (pawn == null || pawn.type !== PIECE_TYPE.PAWN) {
    return [];
  }

  const color = getColor(pawn);
  if (color !== state.turn) {
    return [];
  }

  const enPassantSquare = state.enPassantSquare;
  if (enPassantSquare == null) {
    return [];
  }

  const captureTargets = getCaptureTargets(square, color);
  const targetSquare = captureTargets.find(
    (candidateSquare) => candidateSquare === enPassantSquare,
  );

  if (targetSquare == null) {
    return [];
  }

  if (state.board[targetSquare] != null) {
    return [];
  }

  const capturedPawnSquare = getCapturedPawnSquare(color, targetSquare);
  const capturedPawn = state.board[capturedPawnSquare];

  if (
    capturedPawn == null ||
    capturedPawn.type !== PIECE_TYPE.PAWN ||
    capturedPawn.color === color
  ) {
    return [];
  }

  return [
    {
      from: square,
      to: targetSquare,
      kind: MOVE_KIND.EN_PASSANT,
      capturedSquare: capturedPawnSquare,
    },
  ];
};

/**
 * 앙파상 이동을 실행한 다음 게임 상태를 반환합니다.
 *
 * @param square 이동할 폰이 있는 시작 칸
 * @param targetSquare 앙파상으로 이동할 목적지 칸
 * @param state 현재 게임 상태
 * @returns 앙파상 실행 결과 상태, 실행할 수 없으면 원본 상태
 *
 * const nextState = executeEnPassant(SQUARE.E5, SQUARE.D6, state);
 */
export const executeEnPassant = (
  square: Square,
  targetSquare: Square,
  state: GameState,
): GameState => {
  const pawn = state.board[square];
  if (pawn == null || pawn.type !== PIECE_TYPE.PAWN || pawn.color !== state.turn) {
    return state;
  }

  const enPassantSquare = state.enPassantSquare;
  if (enPassantSquare == null || targetSquare !== enPassantSquare) {
    return state;
  }

  const color = getColor(pawn);
  const captureTargets = getCaptureTargets(square, color);

  if (!captureTargets.includes(targetSquare)) {
    return state;
  }

  const capturedPawnSquare = getCapturedPawnSquare(color, targetSquare);
  const capturedPawn = state.board[capturedPawnSquare];

  if (
    capturedPawn == null ||
    capturedPawn.type !== PIECE_TYPE.PAWN ||
    capturedPawn.color === color
  ) {
    return state;
  }

  const nextBoard = [...state.board];
  nextBoard[square] = null;
  nextBoard[targetSquare] = pawn;
  nextBoard[capturedPawnSquare] = null;

  return {
    ...state,
    board: nextBoard,
    enPassantSquare: null,
  };
};

const getCaptureTargets = (square: Square, color: Color): Square[] => {
  const file = getFile(square);
  const captureTargets: Square[] = [];

  if (file !== 0) {
    captureTargets.push(toSquare(square + PAWN_MOVE.captureWest[color])!);
  }

  if (file !== 7) {
    captureTargets.push(toSquare(square + PAWN_MOVE.captureEast[color])!);
  }

  return captureTargets;
};

const getCapturedPawnSquare = (color: Color, targetSquare: Square): Square =>
  (color === COLOR.WHITE ? targetSquare - 8 : targetSquare + 8) as Square;
