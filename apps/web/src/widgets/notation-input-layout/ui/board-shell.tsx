import {
  selectApplyGameState,
  selectGameState,
  selectRepetitionHistory,
  useGameStore,
} from '@/entities/game';
import {
  selectAppendMoveHistory,
  selectMoveHistoryItems,
  selectSelectedHalfMoveIndex,
  useMoveHistoryStore,
} from '@/entities/move-history';
import { useCheckStatus } from '@/features/check-status';
import { useGameResultStatus } from '@/features/game-result';
import { useLegalMoveHighlight } from '@/features/legal-move-highlight';
import { useBoardDndMove, useMakeMove } from '@/features/make-move';
import { PromotionPieceSelector } from '@/features/promotion-selection';
import { ChessBoard, type BoardOrientation } from '@/widgets/chess-board';
import { COLOR, type Color, type Square } from '@chess-db/shared';
import { DragDropProvider } from '@dnd-kit/react';
import { useCallback, useEffect, useRef } from 'react';

type BoardShellProps = {
  orientation?: BoardOrientation;
};

export const BoardShell = ({ orientation = 'white' }: BoardShellProps) => {
  const promotionSelectorRef = useRef<HTMLDivElement | null>(null);
  const gameState = useGameStore(selectGameState);
  const repetitionHistory = useGameStore(selectRepetitionHistory);
  const applyGameState = useGameStore(selectApplyGameState);

  const { selectedSquare, highlightSquares, selectSquare, clearSelection } =
    useLegalMoveHighlight(gameState);

  const historyItems = useMoveHistoryStore(selectMoveHistoryItems);
  const selectedHalfMoveIndex = useMoveHistoryStore(selectSelectedHalfMoveIndex);
  const appendMoveHistory = useMoveHistoryStore(selectAppendMoveHistory);

  const { makeMove, lastMove, pendingPromotionMove, clearPendingPromotion, selectPromotionPiece } =
    useMakeMove({
      gameState,
      applyGameState,
      appendMoveHistory,
      selectedSquare,
      highlightSquares,
      clearSelection,
    });

  const { isGameOver, resultReason, canStartNewMove } = useGameResultStatus(
    gameState,
    repetitionHistory,
  );

  const promotionCandidates =
    pendingPromotionMove?.candidates.flatMap((move) =>
      move.promotion === undefined ? [] : [{ promotion: move.promotion }],
    ) ?? [];

  const promotionPopoverStyle =
    pendingPromotionMove === null
      ? undefined
      : getPromotionPopoverStyle(pendingPromotionMove.to, gameState.turn);

  const latestHalfMoveIndex = historyItems.length > 0 ? historyItems.length - 1 : null;
  const isViewingHistory =
    selectedHalfMoveIndex !== null && selectedHalfMoveIndex !== latestHalfMoveIndex;

  const selectedHistoryItem =
    selectedHalfMoveIndex === null ? null : historyItems[selectedHalfMoveIndex];

  const displayGameState = selectedHistoryItem?.afterState ?? gameState;
  const displayBoardState = displayGameState.board;
  const displayHighlightSquares = isViewingHistory ? [] : highlightSquares;
  const displaySelectedSquare = isViewingHistory ? null : selectedSquare;
  const { checkedKingSquare: displayCheckedKingSquare } = useCheckStatus(displayGameState);
  const displayLastMove = selectedHistoryItem
    ? {
        from: selectedHistoryItem.move.from,
        to: selectedHistoryItem.move.to,
      }
    : lastMove;
  const isBoardInputDisabled = !canStartNewMove || isViewingHistory;

  const { handleDragStart, handleDragEnd, handleDragOver } = useBoardDndMove({
    boardState: displayBoardState,
    turn: displayGameState.turn,
    isBoardInputDisabled,
    pendingPromotionMoveExists: pendingPromotionMove !== null,
    highlightSquares: displayHighlightSquares,
    selectSquare,
    clearSelection,
    makeMove,
  });

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
    if (isBoardInputDisabled) {
      return;
    }

    if (pendingPromotionMove !== null) {
      return;
    }

    const hasMoveSucceeded = makeMove(square);
    if (hasMoveSucceeded) return;

    selectSquare(square);
  };

  void isGameOver;
  void resultReason;

  return (
    <section
      aria-label="기보 입력 보드 영역"
      className="relative flex aspect-square w-full max-w-180 items-center justify-center rounded-md border bg-muted text-sm text-muted-foreground"
    >
      <p
        role="status"
        aria-label={`현재 턴 ${toCurrentTurnLabel(displayGameState.turn)}`}
        className="sr-only"
      >
        현재 턴: {toCurrentTurnLabel(displayGameState.turn)}
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
      <DragDropProvider
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <ChessBoard
          boardState={displayBoardState}
          orientation={orientation}
          highlightSquares={displayHighlightSquares}
          selectedSquare={displaySelectedSquare}
          onSquareClick={handleSquareClick}
          lastMove={displayLastMove}
          checkedKingSquare={displayCheckedKingSquare}
        />
      </DragDropProvider>
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
