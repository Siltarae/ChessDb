import {
  selectApplyGameState,
  selectBoardState,
  selectGameState,
  useGameStore,
} from '@/entities/game/model/game-store';
import { useLegalMoveHighlight } from '@/features/legal-move-highlight/model/use-legal-move-highlight';
import { useMakeMove } from '@/features/make-move/model/use-make-move';
import { ChessBoard } from '@/widgets/chess-board/ui/chess-board';
import { COLOR, type Color, type Square } from '@chess-db/shared';

export const BoardShell = () => {
  const gameState = useGameStore(selectGameState);
  const boardState = useGameStore(selectBoardState);
  const applyGameState = useGameStore(selectApplyGameState);

  const { selectedSquare, highlightSquares, selectSquare, clearSelection } =
    useLegalMoveHighlight(gameState);

  const { makeMove, lastMove } = useMakeMove({
    gameState,
    applyGameState,
    selectedSquare,
    highlightSquares,
    clearSelection,
  });

  const handleSquareClick = (square: Square) => {
    const moveSucceeded = makeMove(square);
    if (moveSucceeded) return;

    selectSquare(square);
  };

  return (
    <section
      aria-label="기보 입력 보드 영역"
      className="flex aspect-square w-full max-w-180 items-center justify-center rounded-md border bg-muted text-sm text-muted-foreground"
    >
      <p
        role="status"
        aria-label={`현재 턴 ${toCurrentTurnLabel(gameState.turn)}`}
        className="sr-only"
      >
        현재 턴: {toCurrentTurnLabel(gameState.turn)}
      </p>
      <ChessBoard
        boardState={boardState}
        highlightSquares={highlightSquares}
        selectedSquare={selectedSquare}
        onSquareClick={handleSquareClick}
        lastMove={lastMove}
      />
    </section>
  );
};

const toCurrentTurnLabel = (turn: Color) => {
  return turn === COLOR.WHITE ? '백' : '흑';
};
