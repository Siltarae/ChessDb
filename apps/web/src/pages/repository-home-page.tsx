import { useParams } from 'react-router';
import { useState } from 'react';

import { StartNotationInputButton, useStartNotationInput } from '@/features/new-game-entry';
import { SaveGameButton } from '@/features/save-game';
import type { BoardOrientation } from '@/widgets/chess-board';
import { BoardShell, SidebarShell } from '@/widgets/notation-input-layout';

export const RepositoryHomePage = () => {
  const { repositoryId } = useParams();
  const [boardOrientation, setBoardOrientation] = useState<BoardOrientation>('white');
  const { startNotationInput } = useStartNotationInput({ hasDraftToReplace: false });

  const toggleBoardOrientation = () => {
    setBoardOrientation((currentOrientation) =>
      currentOrientation === 'white' ? 'black' : 'white',
    );
  };

  return (
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
  );
};
