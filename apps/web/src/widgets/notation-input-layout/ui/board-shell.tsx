import {
  selectApplyGameState,
  selectBoardState,
  selectGameState,
  useGameStore,
} from '@/entities/game/model/game-store';
import { useCheckStatus } from '@/features/check-status/model/use-check-status';
import { useLegalMoveHighlight } from '@/features/legal-move-highlight/model/use-legal-move-highlight';
import { useMakeMove } from '@/features/make-move/model/use-make-move';
import { PromotionPieceSelector } from '@/features/promotion-selection/ui/promotion-piece-selector';
import { ChessBoard } from '@/widgets/chess-board/ui/chess-board';
import { COLOR, type Color, type Square } from '@chess-db/shared';
import { useCallback, useEffect, useRef } from 'react';

export const BoardShell = () => {
  const promotionSelectorRef = useRef<HTMLDivElement | null>(null);
  const gameState = useGameStore(selectGameState);
  const boardState = useGameStore(selectBoardState);
  const applyGameState = useGameStore(selectApplyGameState);

  const { selectedSquare, highlightSquares, selectSquare, clearSelection } =
    useLegalMoveHighlight(gameState);

  const { makeMove, lastMove, pendingPromotionMove, clearPendingPromotion, selectPromotionPiece } =
    useMakeMove({
      gameState,
      applyGameState,
      selectedSquare,
      highlightSquares,
      clearSelection,
    });

  const { checkedKingSquare } = useCheckStatus(gameState);

  const promotionCandidates =
    pendingPromotionMove?.candidates.flatMap((move) =>
      move.promotion === undefined ? [] : [{ promotion: move.promotion }],
    ) ?? [];

  const promotionPopoverStyle =
    pendingPromotionMove === null
      ? undefined
      : getPromotionPopoverStyle(pendingPromotionMove.to, gameState.turn);

  const handlePromotionCancel = useCallback(() => {
    clearPendingPromotion();
    clearSelection();
  }, [clearPendingPromotion, clearSelection]);

  useEffect(() => {
    if (pendingPromotionMove === null) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (!(event.target instanceof Node)) {
        return;
      }

      if (promotionSelectorRef.current?.contains(event.target)) {
        return;
      }

      handlePromotionCancel();
    };

    document.addEventListener('pointerdown', handlePointerDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [handlePromotionCancel, pendingPromotionMove]);

  const handleSquareClick = (square: Square) => {
    if (pendingPromotionMove !== null) {
      return;
    }

    const moveSucceeded = makeMove(square);
    if (moveSucceeded) return;

    selectSquare(square);
  };

  return (
    <section
      aria-label="기보 입력 보드 영역"
      className="relative flex aspect-square w-full max-w-180 items-center justify-center rounded-md border bg-muted text-sm text-muted-foreground"
    >
      <p
        role="status"
        aria-label={`현재 턴 ${toCurrentTurnLabel(gameState.turn)}`}
        className="sr-only"
      >
        현재 턴: {toCurrentTurnLabel(gameState.turn)}
      </p>
      {pendingPromotionMove !== null ? (
        <div ref={promotionSelectorRef} className="absolute z-20" style={promotionPopoverStyle}>
          <PromotionPieceSelector
            candidates={promotionCandidates}
            side={gameState.turn}
            onSelectPromotionPiece={selectPromotionPiece}
          />
        </div>
      ) : null}
      <ChessBoard
        boardState={boardState}
        highlightSquares={highlightSquares}
        selectedSquare={selectedSquare}
        onSquareClick={handleSquareClick}
        lastMove={lastMove}
        checkedKingSquare={checkedKingSquare}
      />
    </section>
  );
};

const toCurrentTurnLabel = (turn: Color) => {
  return turn === COLOR.WHITE ? '백' : '흑';
};

const getPromotionPopoverStyle = (targetSquare: Square, side: Color): React.CSSProperties => {
  const fileIndex = targetSquare % 8;
  const rankIndex = Math.floor(targetSquare / 8);
  const displayRowIndex = 7 - rankIndex;
  const topRowIndex = side === COLOR.WHITE ? displayRowIndex : displayRowIndex - 3;

  return {
    left: `${(fileIndex / 8) * 100}%`,
    top: `${(topRowIndex / 8) * 100}%`,
    width: '12.5%',
  };
};
