import type { Board, Square } from '@chess-db/shared';
import { DISPLAY_SQUARES, getSquareTone, toSquareLabel } from '../model/board-coordinate';
import { ChessSquare } from './chess-square';

type ChessBoardProps = {
  boardState: Board;
  highlightSquares: Square[];
  selectedSquare: Square | null;
  onSquareClick: (square: Square) => void;
};

export const ChessBoard = ({
  boardState,
  highlightSquares,
  selectedSquare,
  onSquareClick,
}: ChessBoardProps): React.ReactNode => {
  return (
    <div className="grid aspect-square  w-full  grid-cols-8">
      {DISPLAY_SQUARES.map((displaySquare) => {
        const piece = boardState[displaySquare] ?? null;
        const label = toSquareLabel(displaySquare);
        const tone = getSquareTone(displaySquare);

        const isLegalMoveHighlighted = highlightSquares.includes(displaySquare);
        const isSelected = selectedSquare === displaySquare;

        return (
          <ChessSquare
            key={displaySquare}
            square={displaySquare}
            label={label}
            tone={tone}
            piece={piece}
            isLegalMoveHighlighted={isLegalMoveHighlighted}
            isSelected={isSelected}
            onClick={() => onSquareClick(displaySquare)}
          />
        );
      })}
    </div>
  );
};
