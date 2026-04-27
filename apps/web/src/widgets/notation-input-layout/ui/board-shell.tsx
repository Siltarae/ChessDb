import { selectBoardState, useGameStore } from '@/entities/game/model/game-store';
import { ChessBoard } from '@/widgets/chess-board/ui/chess-board';

export const BoardShell = () => {
  const boardState = useGameStore(selectBoardState);

  return (
    <section
      aria-label="기보 입력 보드 영역"
      className="flex aspect-square w-full max-w-180 items-center justify-center rounded-md border bg-muted text-sm text-muted-foreground"
    >
      <ChessBoard boardState={boardState} />
    </section>
  );
};
