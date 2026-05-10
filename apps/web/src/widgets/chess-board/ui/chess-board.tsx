import type { LastMove } from '@/entities/game';
import type { Board, Square } from '@chess-db/shared';
import {
  getDisplaySquares,
  getSquareTone,
  toSquareLabel,
  type BoardOrientation,
} from '../model/board-coordinate';
import { ChessSquare } from './chess-square';

type ChessBoardProps = {
  boardState: Board;
  orientation?: BoardOrientation;
  highlightSquares: Square[];
  selectedSquare: Square | null;
  onSquareClick: (square: Square) => void;
  lastMove: LastMove | null;
  checkedKingSquare: Square | null;
};

export const ChessBoard = ({
  boardState,
  orientation = 'white',
  highlightSquares,
  selectedSquare,
  onSquareClick,
  lastMove,
  checkedKingSquare,
}: ChessBoardProps): React.ReactNode => {
  const displaySquares = getDisplaySquares(orientation);

  return (
    <div className="grid aspect-square  w-full  grid-cols-8">
      {displaySquares.map((displaySquare, displayIndex) => {
        const piece = boardState[displaySquare] ?? null;
        const label = toSquareLabel(displaySquare);
        const tone = getSquareTone(displaySquare);
        const isBottomRow = displayIndex >= 56;
        const isRightColumn = displayIndex % 8 === 7;
        const fileLabel = label.charAt(0);
        const rankLabel = label.charAt(1);

        const isLegalMoveHighlighted = highlightSquares.includes(displaySquare);
        const isSelected = selectedSquare === displaySquare;
        const isLastMove = lastMove?.from === displaySquare || lastMove?.to === displaySquare;
        const isCheckedKingSquare = checkedKingSquare === displaySquare;

        return (
          <ChessSquare
            key={displaySquare}
            square={displaySquare}
            label={label}
            tone={tone}
            piece={piece}
            fileLabel={isBottomRow ? fileLabel : null}
            rankLabel={isRightColumn ? rankLabel : null}
            isLegalMoveHighlighted={isLegalMoveHighlighted}
            isSelected={isSelected}
            isLastMove={isLastMove}
            isCheckedKingSquare={isCheckedKingSquare}
            onClick={() => onSquareClick(displaySquare)}
          />
        );
      })}
    </div>
  );
};
