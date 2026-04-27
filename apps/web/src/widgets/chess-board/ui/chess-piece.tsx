import type { Piece } from '@chess-db/shared';
import { getPieceAsset } from '../model/piece-display';

type ChessPieceProps = {
  piece: Piece | null;
};

export const ChessPiece = ({ piece }: ChessPieceProps): React.ReactNode => {
  if (!piece) {
    return null;
  }

  const pieceAsset = getPieceAsset(piece);

  if (!pieceAsset) {
    return null;
  }

  return <img src={pieceAsset} alt={`${piece.color} ${piece.type}`} className="size-full" />;
};
