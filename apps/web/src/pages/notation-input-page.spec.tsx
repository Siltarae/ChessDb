import { act, cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router';
import { afterEach, describe, expect, it, vi } from 'vitest';

import type { UseSaveGameOptions, UseSaveGameResult } from '@/features/save-game';
import { NotationInputPage } from './notation-input-page';

const useDraftAutosaveMock = vi.fn();
let draftAutosaveResult: {
  readonly lastSavedAt: string | null;
  readonly isSaveNoticeVisible: boolean;
  readonly isSaveFailureNoticeVisible: boolean;
} = {
  lastSavedAt: '2026-05-16T00:00:00.000Z',
  isSaveNoticeVisible: true,
  isSaveFailureNoticeVisible: false,
};
const requestSaveGameMock = vi.fn();
const createUseSaveGameResult = (override: Partial<UseSaveGameResult> = {}): UseSaveGameResult => ({
  requestSaveGame: requestSaveGameMock,
  isSaving: false,
  canSaveGame: true,
  savedGameId: null,
  saveStatus: 'idle',
  ...override,
});
const useSaveGameMock = vi.fn((options: UseSaveGameOptions) => {
  void options;
  return createUseSaveGameResult();
});

vi.mock('@/features/draft-autosave', () => ({
  useDraftAutosave: () => {
    useDraftAutosaveMock();
    return draftAutosaveResult;
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
  useSaveGame: (options: UseSaveGameOptions) => useSaveGameMock(options),
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
  const renderNotationInputPage = (
    initialEntry = '/repositories/11111111-1111-4111-8111-111111111111/new',
  ) => {
    return render(
      <MemoryRouter initialEntries={[initialEntry]}>
        <Routes>
          <Route path="/repositories/:repositoryId/new" element={<NotationInputPage />} />
          <Route path="/" element={<NotationInputPage />} />
        </Routes>
      </MemoryRouter>,
    );
  };

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    draftAutosaveResult = {
      lastSavedAt: '2026-05-16T00:00:00.000Z',
      isSaveNoticeVisible: true,
      isSaveFailureNoticeVisible: false,
    };
    useDraftAutosaveMock.mockClear();
    requestSaveGameMock.mockClear();
    useSaveGameMock.mockReset();
    useSaveGameMock.mockReturnValue(createUseSaveGameResult());
  });

  it('페이지 렌더링 시 초안 자동 저장 훅을 활성화해야 한다', () => {
    renderNotationInputPage();

    expect(useDraftAutosaveMock).toHaveBeenCalledTimes(1);
  });

  it('URL의 저장소 ID를 기보 저장 훅에 전달해야 한다', () => {
    renderNotationInputPage();

    expect(useSaveGameMock).toHaveBeenCalledWith({
      repositoryId: '11111111-1111-4111-8111-111111111111',
    });
  });

  it('기존 보드와 사이드바 슬롯에 기본 백 시점 값을 전달해야 한다', () => {
    renderNotationInputPage();

    expect(screen.getByTestId('board-shell')).toHaveTextContent('white');
    expect(screen.getByTestId('sidebar-shell')).toHaveTextContent('white');
  });

  it('초안 저장 시 토스트 상태를 표시해야 한다', () => {
    renderNotationInputPage();

    expect(screen.getByRole('status')).toHaveTextContent('초안 저장됨');
  });

  it('초안 저장에 실패하면 실패 토스트를 표시해야 한다', () => {
    draftAutosaveResult = {
      lastSavedAt: null,
      isSaveNoticeVisible: false,
      isSaveFailureNoticeVisible: true,
    };

    renderNotationInputPage();

    expect(screen.getByRole('status')).toHaveTextContent('초안 저장 실패');
  });

  it('초안 저장 이벤트가 바뀌면 토스트 강조 상태를 갱신해야 한다', () => {
    const { rerender } = renderNotationInputPage();

    const firstToast = screen.getByRole('status');

    expect(firstToast).toHaveAttribute('data-save-event-id', '2026-05-16T00:00:00.000Z');
    expect(firstToast).toHaveClass('animate-[draft-save-toast-highlight_420ms_ease-out]');

    draftAutosaveResult = {
      lastSavedAt: '2026-05-16T00:00:01.000Z',
      isSaveNoticeVisible: true,
      isSaveFailureNoticeVisible: false,
    };
    rerender(
      <MemoryRouter initialEntries={['/repositories/11111111-1111-4111-8111-111111111111/new']}>
        <Routes>
          <Route path="/repositories/:repositoryId/new" element={<NotationInputPage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByRole('status')).toHaveAttribute(
      'data-save-event-id',
      '2026-05-16T00:00:01.000Z',
    );
  });

  it('초기화 버튼을 누르면 확인 다이얼로그를 표시해야 한다', async () => {
    const user = userEvent.setup();
    renderNotationInputPage();

    await user.click(screen.getByRole('button', { name: '초기화' }));

    expect(screen.getByRole('alertdialog', { name: '초안 초기화' })).toBeInTheDocument();
    expect(
      screen.getByText('현재 입력 중인 초안을 초기화합니다. 계속하시겠습니까?'),
    ).toBeInTheDocument();
  });

  it('기보 저장 버튼을 표시하고 클릭하면 저장 요청을 실행해야 한다', async () => {
    const user = userEvent.setup();
    renderNotationInputPage();

    await user.click(screen.getByRole('button', { name: '기보 저장' }));

    expect(requestSaveGameMock).toHaveBeenCalledOnce();
  });

  it('저장할 수 없으면 기보 저장 버튼을 비활성화해야 한다', () => {
    useSaveGameMock.mockReturnValue(
      createUseSaveGameResult({
        canSaveGame: false,
      }),
    );

    renderNotationInputPage();

    expect(screen.getByRole('button', { name: '기보 저장' })).toBeDisabled();
  });

  it('기보 저장 성공 상태를 표시해야 한다', () => {
    useSaveGameMock.mockReturnValue(
      createUseSaveGameResult({
        savedGameId: 'game-1',
        saveStatus: 'success',
      }),
    );

    renderNotationInputPage();

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

    renderNotationInputPage();

    expect(screen.getByText('기보가 저장되었습니다.')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(screen.queryByText('기보가 저장되었습니다.')).not.toBeInTheDocument();
  });

  it('동일한 기보 저장 성공 상태가 반복되어도 다시 표시해야 한다', () => {
    vi.useFakeTimers();
    useSaveGameMock.mockReturnValue(
      createUseSaveGameResult({
        savedGameId: 'game-1',
        saveStatus: 'success',
      }),
    );

    const { rerender } = renderNotationInputPage();

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(screen.queryByText('기보가 저장되었습니다.')).not.toBeInTheDocument();

    useSaveGameMock.mockReturnValue(createUseSaveGameResult({ saveStatus: 'idle' }));
    rerender(
      <MemoryRouter initialEntries={['/repositories/11111111-1111-4111-8111-111111111111/new']}>
        <Routes>
          <Route path="/repositories/:repositoryId/new" element={<NotationInputPage />} />
        </Routes>
      </MemoryRouter>,
    );

    useSaveGameMock.mockReturnValue(
      createUseSaveGameResult({
        savedGameId: 'game-2',
        saveStatus: 'success',
      }),
    );
    rerender(
      <MemoryRouter initialEntries={['/repositories/11111111-1111-4111-8111-111111111111/new']}>
        <Routes>
          <Route path="/repositories/:repositoryId/new" element={<NotationInputPage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('기보가 저장되었습니다.')).toBeInTheDocument();
  });

  it('기보 저장 실패 상태를 표시해야 한다', () => {
    useSaveGameMock.mockReturnValue(
      createUseSaveGameResult({
        saveStatus: 'error',
      }),
    );

    renderNotationInputPage();

    expect(screen.getByText('기보 저장에 실패했습니다.')).toBeInTheDocument();
  });
});
