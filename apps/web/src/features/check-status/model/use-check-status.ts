import { isCheck, PIECE_TYPE, type Color, type GameState, type Square } from '@chess-db/shared';

type UseCheckStatus = (gameState: GameState) => CheckStatus;

type CheckStatus = {
  checkedKingSquare: Square | null;
};

export const useCheckStatus: UseCheckStatus = (gameState: GameState) => {
  const currentTurn = gameState.turn;
  const isCurrentTurnInCheck = isCheck(gameState, currentTurn);

  if (!isCurrentTurnInCheck) {
    return {
      checkedKingSquare: null,
    };
  }

  const checkedKingSquare = findKingSquare(gameState, currentTurn);

  if (checkedKingSquare === null) {
    return {
      checkedKingSquare: null,
    };
  }

  return {
    checkedKingSquare,
  };
};

const findKingSquare = (gameState: GameState, color: Color): Square | null => {
  const kingSquare = gameState.board.findIndex(
    (square) => square?.type === PIECE_TYPE.KING && square?.color === color,
  ) as Square | -1;

  if (kingSquare === -1) {
    return null;
  }

  return kingSquare;
};
