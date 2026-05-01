import { isCheck } from '../engines/check-engine.js';
import { GAME_RESULT_STATUS, getGameResult, REASON } from '../engines/game-result-engine.js';
import { getLegalMoves } from '../engines/legal-move-engine.js';
import {
  COLOR,
  MOVE_KIND,
  PIECE_TYPE,
  type GameState,
  type Move,
  type Piece,
  type Square,
} from '../models/game-state.js';
import { getFile, getRank } from '../utils/board-utils.js';

type SanPieceNotation = '' | 'N' | 'B' | 'R' | 'Q' | 'K';
type SanCheckSuffix = '' | '+' | '#';

/**
 * 이동 전/후 상태와 착수 정보를 바탕으로 한 수의 SAN 문자열을 반환합니다.
 *
 * @param state 이동 전 게임 상태
 * @param move SAN으로 변환할 착수 정보
 * @param nextState 이동이 적용된 후 게임 상태
 * @returns 표준 대수 표기법 문자열
 *
 * const san = convertToSan(state, move, nextState);
 */
export const convertToSan = (state: GameState, move: Move, nextState: GameState): string => {
  const checkSuffix = suffixForCheckState(nextState);

  if (move.kind === MOVE_KIND.CASTLE_KING_SIDE) return `O-O${checkSuffix}`;
  if (move.kind === MOVE_KIND.CASTLE_QUEEN_SIDE) return `O-O-O${checkSuffix}`;

  const movingPiece = state.board[move.from];

  if (movingPiece == null) {
    throw new Error(`Cannot convert SAN without a piece on source square: ${move.from}`);
  }

  const pieceNotation = getPieceNotation(movingPiece);
  const targetSquareNotation = toSquareNotation(move.to);
  const ambiguityNotation = resolveAmbiguity(move.from, move.to, state, movingPiece);
  const captureNotation = getCaptureNotation(move, state, movingPiece);
  const promotionNotation = getPromotionNotation(move);

  const result = `${pieceNotation}${ambiguityNotation}${captureNotation}${targetSquareNotation}${promotionNotation}${checkSuffix}`;

  return result;
};

const getFileNotation = (file: number): string => {
  return String.fromCharCode('a'.charCodeAt(0) + file);
};

const getRankNotation = (rank: number): string => {
  return String(rank + 1);
};

const getPieceNotation = (piece: Piece): SanPieceNotation => {
  switch (piece.type) {
    case PIECE_TYPE.PAWN:
      return '';
    case PIECE_TYPE.KNIGHT:
      return 'N';
    case PIECE_TYPE.BISHOP:
      return 'B';
    case PIECE_TYPE.ROOK:
      return 'R';
    case PIECE_TYPE.QUEEN:
      return 'Q';
    case PIECE_TYPE.KING:
      return 'K';
    default:
      throw new Error(`Unknown piece type: ${piece.type}`);
  }
};

const toSquareNotation = (square: Square): string => {
  const file = getFile(square);
  const rank = getRank(square);

  return `${getFileNotation(file)}${getRankNotation(rank)}`;
};

const resolveAmbiguity = (
  fromSquare: Square,
  toSquare: Square,
  state: GameState,
  piece: Piece,
): string => {
  if (piece.type === PIECE_TYPE.PAWN || piece.type === PIECE_TYPE.KING) return '';

  const ambiguousCandidates: Square[] = [];

  for (let square = 0; square < 64; square++) {
    const sourceSquare = square as Square;

    if (sourceSquare === fromSquare) continue;
    if (
      state.board[sourceSquare]?.type !== piece.type ||
      state.board[sourceSquare]?.color !== piece.color
    )
      continue;

    const legalMoves = getLegalMoves(sourceSquare, state);

    if (legalMoves.some((move) => move.to === toSquare)) ambiguousCandidates.push(sourceSquare);
  }

  if (ambiguousCandidates.length === 0) return '';

  const fromFile = getFile(fromSquare);
  const fromRank = getRank(fromSquare);

  const hasSameFile = ambiguousCandidates.some((square) => getFile(square) === fromFile);
  const hasSameRank = ambiguousCandidates.some((square) => getRank(square) === fromRank);

  if (hasSameFile && hasSameRank) return `${getFileNotation(fromFile)}${getRankNotation(fromRank)}`;
  if (hasSameFile) return getRankNotation(fromRank);
  if (hasSameRank) return getFileNotation(fromFile);

  return getFileNotation(fromFile);
};

const isCapture = (move: Move, state: GameState): boolean => {
  if (move.kind === MOVE_KIND.EN_PASSANT) return true;

  if (state.board[move.to] !== null) return true;

  return false;
};

const getCaptureNotation = (move: Move, state: GameState, piece: Piece): string => {
  if (isCapture(move, state)) {
    if (piece.type === PIECE_TYPE.PAWN) {
      return `${getFileNotation(getFile(move.from))}x`;
    }

    return 'x';
  }

  return '';
};

const getPromotionNotation = (move: Move): string => {
  if (move.promotion !== undefined)
    return `=${getPieceNotation({ type: move.promotion, color: COLOR.WHITE })}`;

  return '';
};

const isCheckmate = (nextState: GameState): boolean => {
  const gameResult = getGameResult(nextState, {});

  if (gameResult.status === GAME_RESULT_STATUS.FINISHED && gameResult.reason === REASON.CHECKMATE) {
    return true;
  }

  return false;
};

const suffixForCheckState = (nextState: GameState): SanCheckSuffix => {
  if (isCheckmate(nextState)) return '#';
  if (isCheck(nextState, nextState.turn)) return '+';

  return '';
};
