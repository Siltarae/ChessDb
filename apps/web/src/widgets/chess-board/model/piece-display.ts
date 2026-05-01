import { COLOR, PIECE_TYPE, type Piece } from '@chess-db/shared';

import whiteBishop from '../assets/pieces/white-bishop.svg';
import whiteKing from '../assets/pieces/white-king.svg';
import whiteKnight from '../assets/pieces/white-knight.svg';
import whitePawn from '../assets/pieces/white-pawn.svg';
import whiteQueen from '../assets/pieces/white-queen.svg';
import whiteRook from '../assets/pieces/white-rook.svg';

import blackBishop from '../assets/pieces/black-bishop.svg';
import blackKing from '../assets/pieces/black-king.svg';
import blackKnight from '../assets/pieces/black-knight.svg';
import blackPawn from '../assets/pieces/black-pawn.svg';
import blackQueen from '../assets/pieces/black-queen.svg';
import blackRook from '../assets/pieces/black-rook.svg';

const PIECE_ASSET_BY_COLOR_AND_TYPE = {
  [COLOR.WHITE]: {
    [PIECE_TYPE.PAWN]: whitePawn,
    [PIECE_TYPE.KNIGHT]: whiteKnight,
    [PIECE_TYPE.BISHOP]: whiteBishop,
    [PIECE_TYPE.ROOK]: whiteRook,
    [PIECE_TYPE.QUEEN]: whiteQueen,
    [PIECE_TYPE.KING]: whiteKing,
  },
  [COLOR.BLACK]: {
    [PIECE_TYPE.PAWN]: blackPawn,
    [PIECE_TYPE.KNIGHT]: blackKnight,
    [PIECE_TYPE.BISHOP]: blackBishop,
    [PIECE_TYPE.ROOK]: blackRook,
    [PIECE_TYPE.QUEEN]: blackQueen,
    [PIECE_TYPE.KING]: blackKing,
  },
} as const;

const PIECE_ACCESSIBLE_NAME_BY_COLOR_AND_TYPE = {
  [COLOR.WHITE]: {
    [PIECE_TYPE.PAWN]: 'white pawn',
    [PIECE_TYPE.KNIGHT]: 'white knight',
    [PIECE_TYPE.BISHOP]: 'white bishop',
    [PIECE_TYPE.ROOK]: 'white rook',
    [PIECE_TYPE.QUEEN]: 'white queen',
    [PIECE_TYPE.KING]: 'white king',
  },
  [COLOR.BLACK]: {
    [PIECE_TYPE.PAWN]: 'black pawn',
    [PIECE_TYPE.KNIGHT]: 'black knight',
    [PIECE_TYPE.BISHOP]: 'black bishop',
    [PIECE_TYPE.ROOK]: 'black rook',
    [PIECE_TYPE.QUEEN]: 'black queen',
    [PIECE_TYPE.KING]: 'black king',
  },
} as const;

export const getPieceAsset = (piece: Piece): string | null => {
  if (piece.type === PIECE_TYPE.NONE) {
    return null;
  }

  return PIECE_ASSET_BY_COLOR_AND_TYPE[piece.color][piece.type];
};

export const getPieceAccessibleName = (piece: Piece): string | null => {
  if (piece.type === PIECE_TYPE.NONE) {
    return null;
  }

  return PIECE_ACCESSIBLE_NAME_BY_COLOR_AND_TYPE[piece.color][piece.type];
};
