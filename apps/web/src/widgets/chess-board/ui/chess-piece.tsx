import type { Piece } from '@chess-db/shared';
import { getPieceAccessibleName, getPieceAsset } from '../model/piece-display';

type ChessPieceProps = {
  piece: Piece | null;
};

export const ChessPiece = ({ piece }: ChessPieceProps): React.ReactNode => {
  if (!piece) {
    return null;
  }

  const pieceAsset = getPieceAsset(piece);
  const accessibleName = getPieceAccessibleName(piece);

  if (!pieceAsset || !accessibleName) {
    return null;
  }

  return <img src={pieceAsset} alt={accessibleName} className="size-full" />;
};
