import {
  COLOR,
  type Color,
  type GameState,
  type Piece,
  type Square,
} from '../models/game-state.js';

/**
 * 숫자가 유효한 보드 칸 인덱스인지 확인합니다.
 *
 * @param value 검사할 숫자 값
 * @returns 값이 `Square` 범위면 `true`
 *
 * const valid = isSquare(12);
 */
export const isSquare = (value: number): value is Square => {
  return value >= 0 && value <= 63;
};

/**
 * 숫자를 `Square` 타입 또는 `null`로 안전하게 변환합니다.
 *
 * @param value 변환할 숫자 값
 * @returns 유효한 칸이면 `Square`, 아니면 `null`
 *
 * const square = toSquare(36);
 */
export const toSquare = (value: number): Square | null => {
  return isSquare(value) ? value : null;
};

/**
 * 보드 칸 인덱스를 행 값으로 변환합니다.
 *
 * @param square 행 값을 구할 보드 칸
 * @returns `0`부터 `7` 사이의 행 값
 *
 * const rank = getRank(SQUARE.E4);
 */
export const getRank = (square: Square): number => {
  return Math.floor(square / 8);
};

/**
 * 보드 칸 인덱스를 열 값으로 변환합니다.
 *
 * @param square 열 값을 구할 보드 칸
 * @returns `0`부터 `7` 사이의 열 값
 *
 * const file = getFile(SQUARE.E4);
 */
export const getFile = (square: Square): number => {
  return square % 8;
};

/**
 * 기물의 색상을 반환합니다.
 *
 * @param piece 색상을 읽을 기물
 * @returns 기물의 색상 값
 *
 * const color = getColor(piece);
 */
export const getColor = (piece: Piece): Color => {
  return piece.color;
};

/**
 * 특정 칸이 비어 있는지 확인합니다.
 *
 * @param square 확인할 보드 칸
 * @param state 현재 게임 상태
 * @returns 해당 칸이 비어 있으면 `true`
 *
 * const empty = isEmpty(SQUARE.E4, state);
 */
export const isEmpty = (square: Square, state: GameState): boolean => {
  return state.board[square] === null;
};

/**
 * 특정 칸에 상대 기물이 있는지 확인합니다.
 *
 * @param state 현재 게임 상태
 * @param square 검사할 보드 칸
 * @param myColor 내 기물 색상
 * @returns 상대 기물이 있으면 `true`
 *
 * const enemy = isEnemyPiece(state, SQUARE.E5, COLOR.WHITE);
 */
export const isEnemyPiece = (state: GameState, square: Square, myColor: Color): boolean => {
  const piece = state.board[square];

  if (!piece) {
    return false;
  }

  return piece.color !== myColor;
};

/**
 * 현재 색상의 상대 색상을 반환합니다.
 *
 * @param color 기준이 되는 현재 색상
 * @returns 반대편 색상
 *
 * const opponent = getOpponentColor(COLOR.WHITE);
 */
export const getOpponentColor = (color: Color): Color => {
  return color === COLOR.WHITE ? COLOR.BLACK : COLOR.WHITE;
};
