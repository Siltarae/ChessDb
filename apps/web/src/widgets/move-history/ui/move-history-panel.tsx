import type { GameResultStatusView } from '@/features/game-result/model/use-game-result-status';
import type { MoveHistoryRow } from '@/features/move-history/model/move-history-store';

type MoveHistoryPanelProps = {
  rows: MoveHistoryRow[];
  selectedHalfMoveIndex: number | null;
  gameResultStatus: GameResultStatusView;
  canUndo: boolean;
  onSelectHalfMove: (halfMoveIndex: number) => void;
  onUndo: () => void;
};

export const MoveHistoryPanel = ({
  rows,
  selectedHalfMoveIndex,
  gameResultStatus,
  canUndo,
  onSelectHalfMove,
  onUndo,
}: MoveHistoryPanelProps) => {
  const hasMoves = rows.length > 0;
  const latestHalfMoveIndex = getLatestHalfMoveIndex(rows);

  return (
    <section aria-label="수순 목록" className="flex min-h-0 flex-col rounded-md border bg-muted/30">
      <header className="flex items-center justify-between border-b px-4 py-3">
        <div>
          <h2 className="text-sm font-semibold">수순 목록</h2>
        </div>

        <div aria-label="수순 목록 보조 액션" className="flex items-center gap-2">
          <button
            type="button"
            className="size-7 rounded-md border bg-background text-sm"
            disabled={!canUndo}
            onClick={() => onUndo()}
          >
            ↶
          </button>
          <button type="button" className="size-7 rounded-md border bg-muted text-sm" disabled>
            ↷
          </button>
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
        {hasMoves ? (
          <div className="grid grid-cols-[2.5rem_minmax(0,1fr)_minmax(0,1fr)] gap-x-2 gap-y-2 text-sm">
            <div className="text-xs text-muted-foreground">#</div>
            <div className="text-xs text-muted-foreground">백</div>
            <div className="text-xs text-muted-foreground">흑</div>

            {rows.map((row) => (
              <MoveHistoryRowView
                key={row.moveNumber}
                row={row}
                selectedHalfMoveIndex={selectedHalfMoveIndex}
                latestHalfMoveIndex={latestHalfMoveIndex}
                onSelectHalfMove={onSelectHalfMove}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-md border border-dashed bg-background px-4 py-8 text-center text-sm text-muted-foreground">
            아직 기록된 수가 없습니다.
          </div>
        )}
      </div>

      <footer className="border-t px-4 py-3 text-sm">
        {gameResultStatus.isGameOver && (
          <div className="font-semibold">
            <span>
              {gameResultStatus.isWhiteWin
                ? '1-0'
                : gameResultStatus.isBlackWin
                  ? '0-1'
                  : '1/2-1/2'}
            </span>
            {gameResultStatus.resultReason !== null ? (
              <span className="ml-2 text-xs text-muted-foreground">
                {gameResultStatus.resultReason}
              </span>
            ) : null}
          </div>
        )}
      </footer>
    </section>
  );
};

type MoveHistoryRowViewProps = {
  row: MoveHistoryRow;
  selectedHalfMoveIndex: number | null;
  latestHalfMoveIndex: number | null;
  onSelectHalfMove: (halfMoveIndex: number) => void;
};

const MoveHistoryRowView = ({
  row,
  selectedHalfMoveIndex,
  latestHalfMoveIndex,
  onSelectHalfMove,
}: MoveHistoryRowViewProps) => {
  return (
    <>
      <div className="py-1 font-medium">{row.moveNumber}.</div>

      <MoveHistoryCell
        san={row.white?.san ?? null}
        halfMoveIndex={row.white?.halfMoveIndex ?? null}
        isSelected={row.white?.halfMoveIndex === selectedHalfMoveIndex}
        isLastMove={row.white?.halfMoveIndex === latestHalfMoveIndex}
        onSelectHalfMove={onSelectHalfMove}
      />

      <MoveHistoryCell
        san={row.black?.san ?? null}
        halfMoveIndex={row.black?.halfMoveIndex ?? null}
        isSelected={row.black?.halfMoveIndex === selectedHalfMoveIndex}
        isLastMove={row.black?.halfMoveIndex === latestHalfMoveIndex}
        onSelectHalfMove={onSelectHalfMove}
      />
    </>
  );
};

type MoveHistoryCellProps = {
  san: string | null;
  halfMoveIndex: number | null;
  isSelected: boolean;
  isLastMove: boolean;
  onSelectHalfMove: (halfMoveIndex: number) => void;
};

const MoveHistoryCell = ({
  san,
  halfMoveIndex,
  isSelected,
  isLastMove,
  onSelectHalfMove,
}: MoveHistoryCellProps) => {
  if (san === null || halfMoveIndex === null) {
    return <div className="min-h-8 rounded-md border border-dashed bg-background/60" />;
  }

  return (
    <button
      type="button"
      aria-current={isLastMove ? 'step' : undefined}
      data-selected={isSelected}
      className={[
        'min-h-8 rounded-md border px-3 text-left text-sm font-medium',
        isSelected ? 'border-emerald-500 bg-emerald-50' : 'bg-background hover:bg-muted',
      ].join(' ')}
      onClick={() => onSelectHalfMove(halfMoveIndex)}
    >
      {san}
    </button>
  );
};

const getLatestHalfMoveIndex = (rows: readonly MoveHistoryRow[]) => {
  const lastRow = rows.at(-1);

  return lastRow?.black?.halfMoveIndex ?? lastRow?.white?.halfMoveIndex ?? null;
};
