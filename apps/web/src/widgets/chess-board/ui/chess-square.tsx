import { ChessPiece } from '@/entities/piece';
import { toDraggablePieceId, toDroppableSquareId } from '@/features/make-move';
import type { Piece, Square } from '@chess-db/shared';
import { useDraggable, useDroppable } from '@dnd-kit/react';

type ChessSquareProps = {
  square: Square;
  label: string;
  tone: 'light' | 'dark';
  piece: Piece | null;
  isLegalMoveHighlighted: boolean;
  isSelected: boolean;
  isLastMove: boolean;
  isCheckedKingSquare: boolean;
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
  isCheckedKingSquare,
  onClick,
}: ChessSquareProps): React.ReactNode => {
  const { ref: droppableRef } = useDroppable({
    id: toDroppableSquareId(square),
    data: { targetSquare: square },
  });

  const squareToneClass = tone === 'dark' ? 'bg-[#8ca07c]' : 'bg-[#eef0df]';
  const selectedClass = isSelected ? 'bg-square-selected' : '';
  const hasPiece = piece !== null;
  const lastMoveClass = isLastMove ? 'bg-square-last-move' : '';

  const legalMoveClass = isLegalMoveHighlighted
    ? hasPiece
      ? 'bg-square-capture'
      : 'bg-square-legal'
    : '';

  const checkClass = isCheckedKingSquare ? 'bg-square-checked-king' : '';

  return (
    <div
      ref={droppableRef}
      key={square}
      data-square={label}
      data-tone={tone}
      data-selected={isSelected}
      data-legal-move={isLegalMoveHighlighted}
      data-last-move={isLastMove}
      data-checked={isCheckedKingSquare}
      aria-label={label}
      role="button"
      tabIndex={0}
      className={`relative flex aspect-square items-center justify-center ${squareToneClass} ${selectedClass} ${legalMoveClass} ${lastMoveClass} ${checkClass}`}
      onClick={onClick}
    >
      {hasPiece ? <DraggablePiece square={square} piece={piece} /> : null}
    </div>
  );
};

const DraggablePiece = ({ square, piece }: { square: Square; piece: Piece }) => {
  const { ref: draggableRef } = useDraggable({
    id: toDraggablePieceId(square),
    data: { sourceSquare: square, pieceColor: piece.color },
  });

  return (
    <div ref={draggableRef} className="size-full">
      <ChessPiece piece={piece} />
    </div>
  );
};
