import { BoardShell } from '@/widgets/notation-input-layout/ui/board-shell';
import { NotationInputLayout } from '@/widgets/notation-input-layout/ui/notation-input-layout';
import { SidebarShell } from '@/widgets/notation-input-layout/ui/sidebar-shell';

export const NotationInputPage = () => {
  return <NotationInputLayout boardSlot={<BoardShell />} sidebarSlot={<SidebarShell />} />;
};
