import type { Piece, Square } from '@chess-db/shared';
import { ChessPiece } from './chess-piece';

type ChessSquareProps = {
  square: Square;
  label: string;
  tone: 'light' | 'dark';
  piece: Piece | null;
  isLegalMoveHighlighted: boolean;
  isSelected: boolean;
  isLastMove: boolean;
  onClick: () => void;
};

export const ChessSquare = ({
  square,
  label,
  tone,
  piece,
  isLegalMoveHighlighted,
  isSelected,
  isLastMove,
  onClick,
}: ChessSquareProps): React.ReactNode => {
  const squareToneClass = tone === 'dark' ? 'bg-[#8ca07c]' : 'bg-[#eef0df]';
  const selectedClass = isSelected ? 'bg-square-selected' : '';
  const hasPiece = piece !== null;
  const lastMoveClass = isLastMove ? 'bg-square-last-move' : '';

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
      data-selected={isSelected}
      data-legal-move={isLegalMoveHighlighted}
      data-last-move={isLastMove}
      aria-label={label}
      role="button"
      tabIndex={0}
      className={`relative flex aspect-square items-center justify-center ${squareToneClass} ${selectedClass} ${legalMoveClass} ${lastMoveClass}`}
      onClick={onClick}
    >
      {hasPiece ? <ChessPiece piece={piece} /> : null}
    </div>
  );
};
