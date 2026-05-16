import { useDraftAutosave } from '@/features/draft-autosave';
import type { BoardOrientation } from '@/widgets/chess-board';
import { BoardShell, NotationInputLayout, SidebarShell } from '@/widgets/notation-input-layout';
import { useState } from 'react';

export const NotationInputPage = () => {
  const { isSaveNoticeVisible } = useDraftAutosave();

  const [boardOrientation, setBoardOrientation] = useState<BoardOrientation>('white');

  const toggleBoardOrientation = () => {
    setBoardOrientation((currentOrientation) =>
      currentOrientation === 'white' ? 'black' : 'white',
    );
  };

  return (
    <>
      <DraftSavedToast isVisible={isSaveNoticeVisible} />
      <NotationInputLayout
        boardSlot={<BoardShell orientation={boardOrientation} />}
        sidebarSlot={
          <SidebarShell
            boardOrientation={boardOrientation}
            onToggleBoardOrientation={toggleBoardOrientation}
          />
        }
      />
    </>
  );
};

const DraftSavedToast = ({ isVisible }: { readonly isVisible: boolean }) => {
  if (!isVisible) {
    return null;
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed right-4 top-4 z-50 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 shadow-sm"
    >
      초안 저장됨
    </div>
  );
};
