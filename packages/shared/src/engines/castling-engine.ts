import {
  CASTLE_RIGHTS,
  COLOR,
  MOVE_KIND,
  PIECE_TYPE,
  SIDE,
  SQUARE,
  type Color,
  type GameState,
  type Move,
  type Side,
  type Square,
} from '../models/game-state.js';
import { getOpponentColor, isEmpty } from '../utils/board-utils.js';
import { isCheck } from './check-engine.js';
import { isSquareAttacked } from './square-attack-engine.js';

const KING_SQUARE = {
  [COLOR.WHITE]: SQUARE.E1,
  [COLOR.BLACK]: SQUARE.E8,
};

const ROOK_SQUARE = {
  [COLOR.WHITE]: {
    [SIDE.KINGSIDE]: SQUARE.H1,
    [SIDE.QUEENSIDE]: SQUARE.A1,
  },
  [COLOR.BLACK]: {
    [SIDE.KINGSIDE]: SQUARE.H8,
    [SIDE.QUEENSIDE]: SQUARE.A8,
  },
};

const CASTLE_PATH = {
  [COLOR.WHITE]: {
    [SIDE.KINGSIDE]: [SQUARE.F1, SQUARE.G1],
    [SIDE.QUEENSIDE]: [SQUARE.D1, SQUARE.C1, SQUARE.B1],
  },
  [COLOR.BLACK]: {
    [SIDE.KINGSIDE]: [SQUARE.F8, SQUARE.G8],
    [SIDE.QUEENSIDE]: [SQUARE.D8, SQUARE.C8, SQUARE.B8],
  },
};

const CASTLE_KING_SQUARE = {
  [SIDE.KINGSIDE]: {
    [COLOR.WHITE]: SQUARE.G1,
    [COLOR.BLACK]: SQUARE.G8,
  },
  [SIDE.QUEENSIDE]: {
    [COLOR.WHITE]: SQUARE.C1,
    [COLOR.BLACK]: SQUARE.C8,
  },
};

const CASTLE_ROOK_SQUARE = {
  [SIDE.KINGSIDE]: {
    [COLOR.WHITE]: SQUARE.F1,
    [COLOR.BLACK]: SQUARE.F8,
  },
  [SIDE.QUEENSIDE]: {
    [COLOR.WHITE]: SQUARE.D1,
    [COLOR.BLACK]: SQUARE.D8,
  },
};

/**
 * 현재 상태에서 지정한 색이 둘 수 있는 캐슬링 목적지 칸만 반환합니다.
 *
 * @param state 현재 게임 상태
 * @param color 캐슬링 가능 여부를 확인할 색상
 * @returns 가능한 캐슬링 도착 칸 목록
 *
 * const moves = getCastlingMoves(state, COLOR.WHITE);
 */
export const getCastlingMoves = (state: GameState, color: Color): Move[] => {
  const moves: Move[] = [];

  if (isCheck(state, color)) return moves;

  if (canCastleKingside(state, color)) {
    moves.push({
      from: KING_SQUARE[color],
      to: CASTLE_KING_SQUARE[SIDE.KINGSIDE][color],
      kind: MOVE_KIND.CASTLE_KING_SIDE,
    });
  }

  if (canCastleQueenside(state, color)) {
    moves.push({
      from: KING_SQUARE[color],
      to: CASTLE_KING_SQUARE[SIDE.QUEENSIDE][color],
      kind: MOVE_KIND.CASTLE_QUEEN_SIDE,
    });
  }

  return moves;
};

/**
 * 캐슬링 착수를 보드 상태에 반영합니다.
 *
 * @param square 캐슬링을 시도하는 킹의 시작 칸
 * @param targetSquare 캐슬링 목적지 칸
 * @param state 현재 게임 상태
 * @returns 캐슬링 결과가 반영된 다음 게임 상태
 *
 * const nextState = executeCastling(SQUARE.E1, SQUARE.G1, state);
 */
export const executeCastling = (
  square: Square,
  targetSquare: Square,
  state: GameState,
): GameState => {
  if (square !== KING_SQUARE[state.turn]) {
    return state;
  }

  const king = state.board[square];
  if (king == null || king.type !== PIECE_TYPE.KING || king.color !== state.turn) {
    return state;
  }

  const isKingside = targetSquare === SQUARE.G1 || targetSquare === SQUARE.G8;

  const isQueenside = targetSquare === SQUARE.C1 || targetSquare === SQUARE.C8;

  if (!isKingside && !isQueenside) {
    return state;
  }

  const side = isKingside ? SIDE.KINGSIDE : SIDE.QUEENSIDE;

  const rookSquare = ROOK_SQUARE[state.turn][side];
  const rook = state.board[rookSquare];
  if (rook == null || rook.type !== PIECE_TYPE.ROOK || rook.color !== state.turn) {
    return state;
  }

  const newBoard = [...state.board];
  newBoard[square] = null;
  newBoard[rookSquare] = null;

  newBoard[targetSquare] = king;
  newBoard[CASTLE_ROOK_SQUARE[side][state.turn]] = rook;

  return {
    ...state,
    board: newBoard,
    castlingRights: removeCastlingRightsForColor(state, state.turn),
  };
};

const canCastleKingside = (state: GameState, color: Color): boolean => {
  if (!hasCastlingRight(state, color, SIDE.KINGSIDE)) return false;
  if (!hasRequiredPieces(state, color, SIDE.KINGSIDE)) return false;
  if (!isPathClear(state, color, SIDE.KINGSIDE)) return false;
  if (!isPathSafe(state, color, SIDE.KINGSIDE)) return false;

  return true;
};

const canCastleQueenside = (state: GameState, color: Color): boolean => {
  if (!hasCastlingRight(state, color, SIDE.QUEENSIDE)) return false;
  if (!hasRequiredPieces(state, color, SIDE.QUEENSIDE)) return false;
  if (!isPathClear(state, color, SIDE.QUEENSIDE)) return false;
  if (!isPathSafe(state, color, SIDE.QUEENSIDE)) return false;

  return true;
};

const hasCastlingRight = (state: GameState, color: Color, side: Side): boolean => {
  const castleRights = CASTLE_RIGHTS[color][side];

  return (state.castlingRights & castleRights) !== 0;
};

const hasRequiredPieces = (state: GameState, color: Color, side: Side): boolean => {
  const kingSquare = KING_SQUARE[color];
  const rookSquare = ROOK_SQUARE[color][side];

  const king = state.board[kingSquare];
  const rook = state.board[rookSquare];

  if (!king || !rook) {
    return false;
  }

  if (king.type !== PIECE_TYPE.KING || king.color !== color) {
    return false;
  }

  if (rook.type !== PIECE_TYPE.ROOK || rook.color !== color) {
    return false;
  }

  return true;
};

const isPathClear = (state: GameState, color: Color, side: Side): boolean => {
  const path = CASTLE_PATH[color][side];

  for (const square of path) {
    if (!isEmpty(square, state)) {
      return false;
    }
  }

  return true;
};

const isPathSafe = (state: GameState, color: Color, side: Side): boolean => {
  const path = [CASTLE_KING_SQUARE[side][color], CASTLE_ROOK_SQUARE[side][color]];
  const attackerColor = getOpponentColor(color);

  for (const square of path) {
    if (isSquareAttacked(square, attackerColor, state)) {
      return false;
    }
  }

  return true;
};

const removeCastlingRightsForColor = (state: GameState, color: Color): number => {
  const newCastlingRights =
    state.castlingRights &
    ~CASTLE_RIGHTS[color][SIDE.KINGSIDE] &
    ~CASTLE_RIGHTS[color][SIDE.QUEENSIDE];
  return newCastlingRights;
};
