import { selectBoardState, selectGameState, useGameStore } from '@/entities/game/model/game-store';
import { useLegalMoveHighlight } from '@/features/legal-move-highlight/model/use-legal-move-highlight';
import { ChessBoard } from '@/widgets/chess-board/ui/chess-board';
import type { Square } from '@chess-db/shared';

export const BoardShell = () => {
  const gameState = useGameStore(selectGameState);
  const boardState = useGameStore(selectBoardState);

  const { selectedSquare, highlightSquares, selectSquare } = useLegalMoveHighlight(gameState);

  const handleSquareClick = (square: Square) => {
    selectSquare(square);
  };

  return (
    <section
      aria-label="기보 입력 보드 영역"
      className="flex aspect-square w-full max-w-180 items-center justify-center rounded-md border bg-muted text-sm text-muted-foreground"
    >
      <ChessBoard
        boardState={boardState}
        highlightSquares={highlightSquares}
        selectedSquare={selectedSquare}
        onSquareClick={handleSquareClick}
      />
    </section>
  );
};
