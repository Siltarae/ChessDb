import { Navigate, useParams } from 'react-router';
import { useLayoutEffect, useState } from 'react';

import { selectMoveAnnotations, selectMoveComments, useDraftStore } from '@/entities/draft';
import { selectResetGameState, useGameStore } from '@/entities/game';
import {
  selectClearMoveHistory,
  selectMoveHistoryItems,
  useMoveHistoryStore,
} from '@/entities/move-history';
import { useRepositoryListQuery } from '@/entities/repository';
import { ResetDraftDialog } from '@/features/draft-management';
import { StartNotationInputButton, useStartNotationInput } from '@/features/new-game-entry';
import { SaveGameButton } from '@/features/save-game';
import type { BoardOrientation } from '@/widgets/chess-board';
import { BoardShell, SidebarShell } from '@/widgets/notation-input-layout';

export const RepositoryHomePage = () => {
  const { repositoryId } = useParams();
  const { data: repositories = [], isLoading } = useRepositoryListQuery();
  const historyItems = useMoveHistoryStore(selectMoveHistoryItems);
  const moveComments = useDraftStore(selectMoveComments);
  const moveAnnotations = useDraftStore(selectMoveAnnotations);
  const resetGameState = useGameStore(selectResetGameState);
  const clearMoveHistory = useMoveHistoryStore(selectClearMoveHistory);
  const [boardOrientation, setBoardOrientation] = useState<BoardOrientation>('white');
  const [hasDraftToReplace] = useState(
    () => historyItems.length > 0 || moveComments.length > 0 || moveAnnotations.length > 0,
  );
  const { isDraftReplaceDialogOpen, startNotationInput, cancelDraftReplace, confirmDraftReplace } =
    useStartNotationInput({ hasDraftToReplace });

  const toggleBoardOrientation = () => {
    setBoardOrientation((currentOrientation) =>
      currentOrientation === 'white' ? 'black' : 'white',
    );
  };

  useLayoutEffect(() => {
    resetGameState();
    clearMoveHistory();
  }, [clearMoveHistory, repositoryId, resetGameState]);

  const hasActiveRepository =
    repositoryId !== undefined && repositories.some((repository) => repository.id === repositoryId);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background text-foreground">
        <p role="status" className="sr-only">
          저장소 확인 중
        </p>
      </main>
    );
  }

  if (!hasActiveRepository) {
    return <Navigate to="/repositories" replace />;
  }

  return (
    <>
      <ResetDraftDialog
        open={isDraftReplaceDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            cancelDraftReplace();
          }
        }}
        onConfirm={confirmDraftReplace}
      />
      <main className="min-h-screen bg-background text-foreground">
        <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 px-4 py-4 lg:grid lg:grid-cols-[minmax(0,1fr)_360px] lg:px-6 lg:py-6">
          <section
            aria-label="저장소 보드 작업 영역"
            className="flex min-w-0 items-center justify-center"
          >
            <BoardShell orientation={boardOrientation} />
          </section>

          <div className="min-h-0 min-w-0 lg:max-h-[calc(100vh-3rem)]">
            <SidebarShell
              boardOrientation={boardOrientation}
              onToggleBoardOrientation={toggleBoardOrientation}
              toolbarSlot={
                <div className="flex items-center gap-2">
                  <span className="sr-only">{repositoryId}</span>
                  <h1 className="sr-only">저장소 보드</h1>
                  <StartNotationInputButton
                    onStart={() => {
                      if (repositoryId !== undefined) {
                        startNotationInput(repositoryId);
                      }
                    }}
                    disabled={repositoryId === undefined}
                  />
                  <SaveGameButton onSave={() => undefined} isSaving={false} disabled />
                </div>
              }
            />
          </div>
        </div>
      </main>
    </>
  );
};
