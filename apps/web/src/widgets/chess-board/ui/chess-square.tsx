import type { Piece, Square } from '@chess-db/shared';
import { ChessPiece } from './chess-piece';

type ChessSquareProps = {
  square: Square;
  label: string;
  tone: 'light' | 'dark';
  piece: Piece | null;
  isLegalMoveHighlighted: boolean;
  isSelected: boolean;
  onClick: () => void;
};

export const ChessSquare = ({
  square,
  label,
  tone,
  piece,
  isLegalMoveHighlighted,
  isSelected,
  onClick,
}: ChessSquareProps): React.ReactNode => {
  const squareToneClass = tone === 'dark' ? 'bg-[#8ca07c]' : 'bg-[#eef0df]';
  const selectedClass = isSelected ? 'bg-square-selected' : '';
  const hasPiece = piece !== null;

  const legalMoveClass = isLegalMoveHighlighted
    ? hasPiece
      ? 'bg-square-capture'
      : 'bg-square-legal'
    : '';

  return (
    <div
      key={square}
      data-square={label}
      data-tone={tone}
      aria-label={label}
      className={`relative flex aspect-square items-center justify-center ${squareToneClass} ${selectedClass} ${legalMoveClass}`}
      onClick={onClick}
    >
      {hasPiece ? <ChessPiece piece={piece} /> : null}
    </div>
  );
};
