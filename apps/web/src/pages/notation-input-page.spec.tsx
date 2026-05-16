import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { NotationInputPage } from './notation-input-page';

const useDraftAutosaveMock = vi.fn();

vi.mock('@/features/draft-autosave', () => ({
  useDraftAutosave: () => {
    useDraftAutosaveMock();
    return { lastSavedAt: '2026-05-16T00:00:00.000Z', isSaveNoticeVisible: true };
  },
}));

vi.mock('@/widgets/notation-input-layout', () => ({
  BoardShell: ({ orientation }: { readonly orientation: string }) => (
    <div data-testid="board-shell">{orientation}</div>
  ),
  NotationInputLayout: ({
    boardSlot,
    sidebarSlot,
  }: {
    readonly boardSlot: React.ReactNode;
    readonly sidebarSlot: React.ReactNode;
  }) => (
    <main>
      {boardSlot}
      {sidebarSlot}
    </main>
  ),
  SidebarShell: ({
    boardOrientation,
  }: {
    readonly boardOrientation: string;
    readonly onToggleBoardOrientation: () => void;
  }) => <aside data-testid="sidebar-shell">{boardOrientation}</aside>,
}));

describe('NotationInputPage', () => {
  afterEach(() => {
    cleanup();
    useDraftAutosaveMock.mockClear();
  });

  it('페이지 렌더링 시 초안 자동 저장 훅을 활성화해야 한다', () => {
    render(<NotationInputPage />);

    expect(useDraftAutosaveMock).toHaveBeenCalledTimes(1);
  });

  it('기존 보드와 사이드바 슬롯에 기본 백 시점 값을 전달해야 한다', () => {
    render(<NotationInputPage />);

    expect(screen.getByTestId('board-shell')).toHaveTextContent('white');
    expect(screen.getByTestId('sidebar-shell')).toHaveTextContent('white');
  });

  it('초안 저장 시 토스트 상태를 표시해야 한다', () => {
    render(<NotationInputPage />);

    expect(screen.getByRole('status')).toHaveTextContent('초안 저장됨');
  });
});
