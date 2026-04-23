import {
  COLOR,
  type Color,
  type GameState,
  type Piece,
  type Square,
} from '../models/game-state.js';

/**
 * 숫자가 유효한 보드 인덱스(0-63)인지 확인하는 타입 가드
 */
export const isSquare = (value: number): value is Square => {
  return value >= 0 && value <= 63;
};

/**
 * 숫자를 안전하게 Square 타입 또는 null로 변환
 */
export const toSquare = (value: number): Square | null => {
  return isSquare(value) ? value : null;
};

/**
 * 인덱스를 행(Rank)으로 변환 (0-7)
 */
export const getRank = (square: Square): number => {
  return Math.floor(square / 8);
};

/**
 * 인덱스를 열(File)으로 변환 (0-7)
 */
export const getFile = (square: Square): number => {
  return square % 8;
};

/**
 * 기물의 색상을 반환
 */
export const getColor = (piece: Piece): Color => {
  return piece.color;
};

/**
 * 특정 칸이 비어있는지 확인
 */
export const isEmpty = (square: Square, state: GameState): boolean => {
  return state.board[square] === null;
};

/**
 * 특정 칸에 상대방 기물이 있는지 확인
 */
export const isEnemyPiece = (state: GameState, square: Square, myColor: Color): boolean => {
  const piece = state.board[square];

  if (!piece) {
    return false;
  }

  return piece.color !== myColor;
};

/**
 * 상대방 색상을 반환
 * @param color 현재 색상
 * @returns 상대방 색상
 */
export const getOpponentColor = (color: Color): Color => {
  return color === COLOR.WHITE ? COLOR.BLACK : COLOR.WHITE;
};
