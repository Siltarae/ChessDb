import { PIECE_TYPE, type Color, type GameState, type Square } from '../models/game-state.js';
import { getOpponentColor } from '../utils/board-utils.js';
import { isSquareAttacked } from './square-attack-engine.js';

/**
 * 지정한 색의 킹이 현재 체크 상태인지 판정합니다.
 *
 * @param state 현재 게임 상태
 * @param color 체크 여부를 확인할 색상
 * @returns 해당 색의 킹이 공격받고 있으면 `true`
 *
 * const checked = isCheck(state, COLOR.WHITE);
 */
export const isCheck = (state: GameState, color: Color) => {
  const kingSquare = getKingSquare(state, color);
  if (kingSquare === null) {
    return false;
  }

  const attackerColor = getOpponentColor(color);

  return isSquareAttacked(kingSquare, attackerColor, state);
};

const getKingSquare = (state: GameState, color: Color): Square | null => {
  for (let i = 0; i < 64; i++) {
    const piece = state.board[i];
    if (piece && piece.type === PIECE_TYPE.KING && piece.color === color) {
      return i as Square;
    }
  }
  return null;
};
