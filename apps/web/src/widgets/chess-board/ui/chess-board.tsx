import type { Board } from '@chess-db/shared';
import { DISPLAY_SQUARES, getSquareTone, toSquareLabel } from '../model/board-coordinate';
import { ChessSquare } from './chess-square';

type ChessBoardProps = {
  boardState: Board;
};

export const ChessBoard = ({ boardState }: ChessBoardProps): React.ReactNode => {
  return (
    <div className="grid aspect-square  w-full  grid-cols-8">
      {DISPLAY_SQUARES.map((displaySquare) => {
        const piece = boardState[displaySquare] ?? null;
        const label = toSquareLabel(displaySquare);
        const tone = getSquareTone(displaySquare);

        return (
          <ChessSquare
            key={displaySquare}
            square={displaySquare}
            label={label}
            tone={tone}
            piece={piece}
          />
        );
      })}
    </div>
  );
};
