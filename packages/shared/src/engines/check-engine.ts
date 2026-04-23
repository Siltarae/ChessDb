import { PIECE_TYPE, type Color, type GameState, type Square } from '../models/game-state.js';
import { getOpponentColor } from '../utils/board-utils.js';
import { isSquareAttacked } from './square-attack-engine.js';

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
