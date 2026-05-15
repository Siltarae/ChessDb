import { selectGameState, selectRepetitionHistory, useGameStore } from '@/entities/game';
import { useGameResultStatus } from '@/features/game-result';
import { useHistoryNavigation } from '@/features/history-navigation';
import { groupMoveHistoryRows, useMoveHistoryStore } from '@/entities/move-history';
import { MoveHistoryPanel } from '@/widgets/move-history';
import type { BoardOrientation } from '@/widgets/chess-board';
import { useEffect, useMemo } from 'react';
import { MoveMetadataTabs } from './move-metadata-tabs';

type SidebarShellProps = {
  boardOrientation: BoardOrientation;
  onToggleBoardOrientation: () => void;
};

export function SidebarShell({ boardOrientation, onToggleBoardOrientation }: SidebarShellProps) {
  const gameState = useGameStore(selectGameState);
  const repetitionHistory = useGameStore(selectRepetitionHistory);

  const { historyItems, selectedHalfMoveIndex, selectHalfMove } = useMoveHistoryStore();
  const gameResultStatus = useGameResultStatus(gameState, repetitionHistory);
  const { canUndo, canRedo, goToPreviousHalfMove, goToNextHalfMove } = useHistoryNavigation({
    historyItems,
    selectedHalfMoveIndex,
    selectHalfMove,
  });

  const rows = useMemo(() => groupMoveHistoryRows(historyItems), [historyItems]);

  const handleSelectHalfMove = (halfMoveIndex: number) => {
    selectHalfMove(halfMoveIndex);
  };

  useEffect(() => {
    const handleHistoryNavigationKeyDown = (event: KeyboardEvent) => {
      if (shouldIgnoreHistoryNavigationKey(event)) {
        return;
      }

      if (event.key === 'ArrowLeft' && canUndo) {
        event.preventDefault();
        goToPreviousHalfMove();
        return;
      }

      if (event.key === 'ArrowRight' && canRedo) {
        event.preventDefault();
        goToNextHalfMove();
      }
    };

    window.addEventListener('keydown', handleHistoryNavigationKeyDown);

    return () => {
      window.removeEventListener('keydown', handleHistoryNavigationKeyDown);
    };
  }, [canRedo, canUndo, goToNextHalfMove, goToPreviousHalfMove]);

  return (
    <aside
      aria-label="기보 입력 사이드 패널"
      className="flex h-full min-h-80 flex-col rounded-md border bg-card text-card-foreground"
    >
      <div className="border-b px-4 py-3">
        <h2 className="text-sm font-semibold">기보 작업</h2>
        <p className="mt-1 text-xs text-muted-foreground">수순, 메모, 작업 도구가 들어갈 영역</p>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        <div className="flex min-h-full flex-col gap-4">
          <MoveHistoryPanel
            rows={rows}
            selectedHalfMoveIndex={selectedHalfMoveIndex}
            gameResultStatus={gameResultStatus}
            canUndo={canUndo}
            canRedo={canRedo}
            boardOrientation={boardOrientation}
            onToggleBoardOrientation={onToggleBoardOrientation}
            onSelectHalfMove={handleSelectHalfMove}
            onUndo={goToPreviousHalfMove}
            onRedo={goToNextHalfMove}
          />
          <MoveMetadataTabs />
        </div>
      </div>
    </aside>
  );
}

const shouldIgnoreHistoryNavigationKey = (event: KeyboardEvent) => {
  if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') {
    return true;
  }

  if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
    return true;
  }

  const target = event.target;

  if (!(target instanceof HTMLElement)) {
    return false;
  }

  if (target.isContentEditable) {
    return true;
  }

  return ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName);
};
