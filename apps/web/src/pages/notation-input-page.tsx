import type { BoardOrientation } from '@/widgets/chess-board';
import { BoardShell, NotationInputLayout, SidebarShell } from '@/widgets/notation-input-layout';
import { useState } from 'react';

export const NotationInputPage = () => {
  const [boardOrientation, setBoardOrientation] = useState<BoardOrientation>('white');

  const toggleBoardOrientation = () => {
    setBoardOrientation((currentOrientation) =>
      currentOrientation === 'white' ? 'black' : 'white',
    );
  };

  return (
    <NotationInputLayout
      boardSlot={<BoardShell orientation={boardOrientation} />}
      sidebarSlot={
        <SidebarShell
          boardOrientation={boardOrientation}
          onToggleBoardOrientation={toggleBoardOrientation}
        />
      }
    />
  );
};
