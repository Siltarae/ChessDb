import { act, cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import type { UseSaveGameResult } from '@/features/save-game';
import { NotationInputPage } from './notation-input-page';

const useDraftAutosaveMock = vi.fn();
const requestSaveGameMock = vi.fn();
const createUseSaveGameResult = (override: Partial<UseSaveGameResult> = {}): UseSaveGameResult => ({
  requestSaveGame: requestSaveGameMock,
  isSaving: false,
  canSaveGame: true,
  savedGameId: null,
  saveStatus: 'idle',
  ...override,
});
const useSaveGameMock = vi.fn<() => UseSaveGameResult>(() => createUseSaveGameResult());

vi.mock('@/features/draft-autosave', () => ({
  useDraftAutosave: () => {
    useDraftAutosaveMock();
    return { lastSavedAt: '2026-05-16T00:00:00.000Z', isSaveNoticeVisible: true };
  },
}));

vi.mock('@/features/save-game', () => ({
  SaveGameButton: ({
    onSave,
    isSaving,
    disabled,
  }: {
    readonly onSave: () => void;
    readonly isSaving: boolean;
    readonly disabled?: boolean;
  }) => (
    <button type="button" onClick={onSave} disabled={disabled || isSaving}>
      {isSaving ? '저장 중' : '기보 저장'}
    </button>
  ),
  useSaveGame: () => useSaveGameMock(),
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
    toolbarSlot,
  }: {
    readonly boardOrientation: string;
    readonly onToggleBoardOrientation: () => void;
    readonly toolbarSlot?: React.ReactNode;
  }) => (
    <aside data-testid="sidebar-shell">
      {boardOrientation}
      {toolbarSlot}
    </aside>
  ),
}));

describe('NotationInputPage', () => {
  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    useDraftAutosaveMock.mockClear();
    requestSaveGameMock.mockClear();
    useSaveGameMock.mockReset();
    useSaveGameMock.mockReturnValue(createUseSaveGameResult());
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

  it('초기화 버튼을 누르면 확인 다이얼로그를 표시해야 한다', async () => {
    const user = userEvent.setup();
    render(<NotationInputPage />);

    await user.click(screen.getByRole('button', { name: '초기화' }));

    expect(screen.getByRole('alertdialog', { name: '초안 초기화' })).toBeInTheDocument();
    expect(
      screen.getByText('현재 입력 중인 초안을 초기화합니다. 계속하시겠습니까?'),
    ).toBeInTheDocument();
  });

  it('기보 저장 버튼을 표시하고 클릭하면 저장 요청을 실행해야 한다', async () => {
    const user = userEvent.setup();
    render(<NotationInputPage />);

    await user.click(screen.getByRole('button', { name: '기보 저장' }));

    expect(requestSaveGameMock).toHaveBeenCalledOnce();
  });

  it('저장할 수 없으면 기보 저장 버튼을 비활성화해야 한다', () => {
    useSaveGameMock.mockReturnValue(
      createUseSaveGameResult({
        canSaveGame: false,
      }),
    );

    render(<NotationInputPage />);

    expect(screen.getByRole('button', { name: '기보 저장' })).toBeDisabled();
  });

  it('기보 저장 성공 상태를 표시해야 한다', () => {
    useSaveGameMock.mockReturnValue(
      createUseSaveGameResult({
        savedGameId: 'game-1',
        saveStatus: 'success',
      }),
    );

    render(<NotationInputPage />);

    expect(screen.getByText('기보가 저장되었습니다.')).toBeInTheDocument();
  });

  it('기보 저장 성공 상태는 일정 시간 후 숨겨야 한다', () => {
    vi.useFakeTimers();
    useSaveGameMock.mockReturnValue(
      createUseSaveGameResult({
        savedGameId: 'game-1',
        saveStatus: 'success',
      }),
    );

    render(<NotationInputPage />);

    expect(screen.getByText('기보가 저장되었습니다.')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(screen.queryByText('기보가 저장되었습니다.')).not.toBeInTheDocument();
  });

  it('기보 저장 실패 상태를 표시해야 한다', () => {
    useSaveGameMock.mockReturnValue(
      createUseSaveGameResult({
        saveStatus: 'error',
      }),
    );

    render(<NotationInputPage />);

    expect(screen.getByText('기보 저장에 실패했습니다.')).toBeInTheDocument();
  });
});
