import type { Piece, Square } from '@chess-db/shared';
import { ChessPiece } from './chess-piece';

type ChessSquareProps = {
  square: Square;
  label: string;
  tone: 'light' | 'dark';
  piece: Piece | null;
};

export const ChessSquare = ({ square, label, tone, piece }: ChessSquareProps): React.ReactNode => {
  const squareToneClass = tone === 'dark' ? 'bg-[#8ca07c]' : 'bg-[#eef0df]';

  return (
    <div
      key={square}
      data-square={label}
      data-tone={tone}
      aria-label={label}
      className={`flex aspect-square items-center justify-center ${squareToneClass}`}
    >
      {piece ? <ChessPiece piece={piece} /> : null}
    </div>
  );
};
