import { COLOR, PIECE_TYPE, type Piece } from '@chess-db/shared';
import { describe, expect, it } from 'vitest';

import blackBishop from '../assets/pieces/black-bishop.svg';
import blackKing from '../assets/pieces/black-king.svg';
import blackKnight from '../assets/pieces/black-knight.svg';
import blackPawn from '../assets/pieces/black-pawn.svg';
import blackQueen from '../assets/pieces/black-queen.svg';
import blackRook from '../assets/pieces/black-rook.svg';
import whiteBishop from '../assets/pieces/white-bishop.svg';
import whiteKing from '../assets/pieces/white-king.svg';
import whiteKnight from '../assets/pieces/white-knight.svg';
import whitePawn from '../assets/pieces/white-pawn.svg';
import whiteQueen from '../assets/pieces/white-queen.svg';
import whiteRook from '../assets/pieces/white-rook.svg';
import { getPieceAsset } from './piece-display';

const PIECE_ASSET_CASES: readonly [string, Piece, string][] = [
  ['white pawn', { type: PIECE_TYPE.PAWN, color: COLOR.WHITE }, whitePawn],
  ['white knight', { type: PIECE_TYPE.KNIGHT, color: COLOR.WHITE }, whiteKnight],
  ['white bishop', { type: PIECE_TYPE.BISHOP, color: COLOR.WHITE }, whiteBishop],
  ['white rook', { type: PIECE_TYPE.ROOK, color: COLOR.WHITE }, whiteRook],
  ['white queen', { type: PIECE_TYPE.QUEEN, color: COLOR.WHITE }, whiteQueen],
  ['white king', { type: PIECE_TYPE.KING, color: COLOR.WHITE }, whiteKing],
  ['black pawn', { type: PIECE_TYPE.PAWN, color: COLOR.BLACK }, blackPawn],
  ['black knight', { type: PIECE_TYPE.KNIGHT, color: COLOR.BLACK }, blackKnight],
  ['black bishop', { type: PIECE_TYPE.BISHOP, color: COLOR.BLACK }, blackBishop],
  ['black rook', { type: PIECE_TYPE.ROOK, color: COLOR.BLACK }, blackRook],
  ['black queen', { type: PIECE_TYPE.QUEEN, color: COLOR.BLACK }, blackQueen],
  ['black king', { type: PIECE_TYPE.KING, color: COLOR.BLACK }, blackKing],
] as const;

describe('piece-display', () => {
  describe('getPieceAsset으로 기물 표시 asset을 찾을 때', () => {
    it.each(PIECE_ASSET_CASES)('%s 숫자 상수를 SVG asset으로 매핑해야 한다', (_, piece, asset) => {
      expect(getPieceAsset(piece)).toBe(asset);
    });

    it('NONE 타입 기물은 표시 asset 없이 null을 반환해야 한다', () => {
      expect(getPieceAsset({ type: PIECE_TYPE.NONE, color: COLOR.WHITE })).toBeNull();
    });
  });
});
