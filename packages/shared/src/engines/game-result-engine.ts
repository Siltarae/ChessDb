import {
  COLOR,
  PIECE_TYPE,
  type Color,
  type GameState,
  type Piece,
  type Square,
} from '../models/game-state.js';
import { getOpponentColor } from '../utils/board-utils.js';
import { isCheck } from './check-engine.js';
import { getLegalMoves } from './legal-move-engine.js';

export const GAME_RESULT_STATUS = {
  ONGOING: 'ONGOING',
  FINISHED: 'FINISHED',
} as const;
export type GameResultStatus = (typeof GAME_RESULT_STATUS)[keyof typeof GAME_RESULT_STATUS];

const DRAW_REASON = {
  STALEMATE: 'STALEMATE',
  FIFTY_MOVE: 'FIFTY_MOVE',
  THREEFOLD_REPETITION: 'THREEFOLD_REPETITION',
  INSUFFICIENT_MATERIAL: 'INSUFFICIENT_MATERIAL',
} as const;
export type DrawReason = (typeof DRAW_REASON)[keyof typeof DRAW_REASON];

const CHECKMATE = 'CHECKMATE';

export const REASON = {
  ...DRAW_REASON,
  CHECKMATE,
} as const;
export type Reason = (typeof REASON)[keyof typeof REASON];

type OngoingGameResult = {
  status: typeof GAME_RESULT_STATUS.ONGOING;
};

type DrawGameResult = {
  status: typeof GAME_RESULT_STATUS.FINISHED;
  reason: DrawReason;
};

type WinGameResult = {
  status: typeof GAME_RESULT_STATUS.FINISHED;
  reason: typeof CHECKMATE;
  winner: Color;
};

/**
 * 현재 게임의 종료 상태를 표현합니다.
 */
export type GameResult = OngoingGameResult | DrawGameResult | WinGameResult;

/**
 * 현재 상태와 과거 이력을 바탕으로 게임 결과를 반환합니다.
 *
 * @param state 현재 게임 상태
 * @param history 현재 상태를 제외한 과거 게임 상태 목록
 * @returns 현재 게임의 종료 상태
 *
 * const result = getGameResult(state, history);
 */
export const getGameResult = (state: GameState, history: Record<string, number>): GameResult => {
  if (!hasAnyLegalMove(state)) {
    if (isCheck(state, state.turn)) {
      return {
        status: GAME_RESULT_STATUS.FINISHED,
        reason: REASON.CHECKMATE,
        winner: getOpponentColor(state.turn),
      };
    }

    return {
      status: GAME_RESULT_STATUS.FINISHED,
      reason: REASON.STALEMATE,
    };
  }

  if (state.halfmoveClock >= 100) {
    return {
      status: GAME_RESULT_STATUS.FINISHED,
      reason: REASON.FIFTY_MOVE,
    };
  }

  const fingerprint = positionFingerprint(state);
  const count = history[fingerprint] ?? 0;

  if (count >= 2) {
    return {
      status: GAME_RESULT_STATUS.FINISHED,
      reason: REASON.THREEFOLD_REPETITION,
    };
  }

  if (hasInsufficientMaterial(state)) {
    return {
      status: GAME_RESULT_STATUS.FINISHED,
      reason: REASON.INSUFFICIENT_MATERIAL,
    };
  }

  return {
    status: GAME_RESULT_STATUS.ONGOING,
  };
};

const hasAnyLegalMove = (state: GameState): boolean => {
  const color = state.turn;

  for (let i = 0; i < 64; i++) {
    const square = i as Square;
    const piece = state.board[square];
    if (piece == null || piece.color !== color) {
      continue;
    }

    const moves = getLegalMoves(square, state);
    if (moves.length > 0) {
      return true;
    }
  }

  return false;
};

export const positionFingerprint = (state: GameState): string => {
  const boardKey = state.board.map(toPieceKey).join(',');
  const turnKey = state.turn === COLOR.WHITE ? 'w' : 'b';
  const castlingKey = String(state.castlingRights);
  const enPassantKey = state.enPassantSquare === null ? '-' : String(state.enPassantSquare);

  return `${boardKey}|${turnKey}|${castlingKey}|${enPassantKey}`;
};

const toPieceKey = (piece: Piece | null): string => {
  if (piece === null) {
    return '__';
  }

  const colorKey = piece.color === COLOR.WHITE ? 'w' : 'b';

  switch (piece.type) {
    case PIECE_TYPE.PAWN:
      return `${colorKey}P`;
    case PIECE_TYPE.KNIGHT:
      return `${colorKey}N`;
    case PIECE_TYPE.BISHOP:
      return `${colorKey}B`;
    case PIECE_TYPE.ROOK:
      return `${colorKey}R`;
    case PIECE_TYPE.QUEEN:
      return `${colorKey}Q`;
    case PIECE_TYPE.KING:
      return `${colorKey}K`;
    default:
      return `${colorKey}X`;
  }
};

const hasInsufficientMaterial = (state: GameState): boolean => {
  let count = 0;
  for (let i = 0; i < 64; i++) {
    const piece = state.board[i as Square];
    if (!piece) {
      continue;
    }

    if (
      piece.type === PIECE_TYPE.PAWN ||
      piece.type === PIECE_TYPE.ROOK ||
      piece.type === PIECE_TYPE.QUEEN
    ) {
      return false;
    }

    if ((piece.type === PIECE_TYPE.BISHOP || piece.type === PIECE_TYPE.KNIGHT) && count === 0) {
      count += 1;
    } else if (
      (piece.type === PIECE_TYPE.BISHOP || piece.type === PIECE_TYPE.KNIGHT) &&
      count === 1
    ) {
      return false;
    }
  }

  return true;
};
