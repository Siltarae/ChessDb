import { BoardShell, NotationInputLayout, SidebarShell } from '@/widgets/notation-input-layout';

export const NotationInputPage = () => {
  return <NotationInputLayout boardSlot={<BoardShell />} sidebarSlot={<SidebarShell />} />;
};
