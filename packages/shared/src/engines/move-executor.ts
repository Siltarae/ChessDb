import {
  CASTLE,
  COLOR,
  MOVE_KIND,
  PIECE_TYPE,
  RANK,
  SQUARE,
  type GameState,
  type Move,
  type Piece,
  type Square,
} from '../models/game-state.js';
import { getColor, getOpponentColor, getRank, toSquare } from '../utils/board-utils.js';
import { executeCastling } from './castling-engine.js';
import { executeEnPassant } from './en-passant-engine.js';
import { executePromotion } from './promotion-engine.js';

/**
 * 착수 정보를 적용한 다음 게임 상태를 반환합니다.
 *
 * @param state 현재 게임 상태
 * @param move 실행할 착수 정보
 * @returns 착수 결과가 반영된 다음 게임 상태
 *
 * const nextState = executeMove(state, { from: SQUARE.E2, to: SQUARE.E4 });
 */
export const executeMove = (state: GameState, move: Move): GameState => {
  const piece = state.board[move.from];
  if (!piece) {
    throw new Error('Invalid move');
  }

  if (move.kind === MOVE_KIND.EN_PASSANT) {
    return executeEnPassant(move.from, move.to, state);
  }

  if (move.kind === MOVE_KIND.CASTLE_KING_SIDE || move.kind === MOVE_KIND.CASTLE_QUEEN_SIDE) {
    return executeCastling(move.from, move.to, state);
  }

  if (move.promotion) {
    return { ...executePromotion(move.from, move.to, state, move.promotion), halfmoveClock: 0 };
  }

  const nextState = executeNormalMove(state, move, piece);

  return {
    ...nextState,
    halfmoveClock: computeHalfmoveClock(state, move, piece),
    turn: getOpponentColor(state.turn),
    enPassantSquare: computeEnPassantTarget(move, piece),
    fullmoveNumber: computeFullmoveNumber(state),
    castlingRights: computeCastleRights(state, move, piece),
  };
};

const executeNormalMove = (state: GameState, move: Move, piece: Piece): GameState => {
  const board = [...state.board];
  board[move.to] = piece;
  board[move.from] = null;

  return {
    ...state,
    board,
  };
};

const computeHalfmoveClock = (state: GameState, move: Move, piece: Piece): number => {
  if (piece.type === PIECE_TYPE.PAWN) {
    return 0;
  }

  const capturePiece = state.board[move.to];
  if (capturePiece) {
    return 0;
  }

  return state.halfmoveClock + 1;
};

const computeEnPassantTarget = (move: Move, piece: Piece): Square | null => {
  if (piece.type !== PIECE_TYPE.PAWN) {
    return null;
  }

  if (move.kind !== MOVE_KIND.DOUBLE_PAWN_PUSH) {
    return null;
  }

  const color = getColor(piece);
  const rank = getRank(move.to);

  if (color === COLOR.WHITE && rank === RANK[4]) {
    return toSquare(move.to - 8);
  }

  if (color === COLOR.BLACK && rank === RANK[5]) {
    return toSquare(move.to + 8);
  }

  return null;
};

const computeFullmoveNumber = (state: GameState): number =>
  state.turn === COLOR.WHITE ? state.fullmoveNumber : state.fullmoveNumber + 1;

const computeCastleRights = (state: GameState, move: Move, piece: Piece): number => {
  const color = piece.color;

  let rights = state.castlingRights;

  if (piece.type === PIECE_TYPE.KING) {
    if (COLOR.WHITE === color) {
      rights &= ~CASTLE.WHITE_KING_SIDE & ~CASTLE.WHITE_QUEEN_SIDE;
    }

    if (COLOR.BLACK === color) {
      rights &= ~CASTLE.BLACK_KING_SIDE & ~CASTLE.BLACK_QUEEN_SIDE;
    }
  }

  if (piece.type === PIECE_TYPE.ROOK) {
    if (COLOR.WHITE === color) {
      if (move.from === SQUARE.A1) {
        rights &= ~CASTLE.WHITE_QUEEN_SIDE;
      }

      if (move.from === SQUARE.H1) {
        rights &= ~CASTLE.WHITE_KING_SIDE;
      }
    }

    if (COLOR.BLACK === color) {
      if (move.from === SQUARE.A8) {
        rights &= ~CASTLE.BLACK_QUEEN_SIDE;
      }

      if (move.from === SQUARE.H8) {
        rights &= ~CASTLE.BLACK_KING_SIDE;
      }
    }
  }

  const capturePiece = state.board[move.to];
  if (capturePiece) {
    if (COLOR.WHITE === capturePiece.color) {
      if (move.to === SQUARE.A1) {
        return rights & ~CASTLE.WHITE_QUEEN_SIDE;
      }

      if (move.to === SQUARE.H1) {
        return rights & ~CASTLE.WHITE_KING_SIDE;
      }
    }

    if (COLOR.BLACK === capturePiece.color) {
      if (move.to === SQUARE.A8) {
        return rights & ~CASTLE.BLACK_QUEEN_SIDE;
      }

      if (move.to === SQUARE.H8) {
        return rights & ~CASTLE.BLACK_KING_SIDE;
      }
    }
  }

  return rights;
};
