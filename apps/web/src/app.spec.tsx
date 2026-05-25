import { StrictMode } from 'react';
import { cleanup, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  GAME_RECORD_RESULT,
  GAME_TERMINATION_REASON,
  MOVE_ANNOTATION,
  MOVE_KIND,
  SQUARE,
  createInitialGameState,
  executeMove,
  type Move,
} from '@chess-db/shared';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { DRAFT_GAME_METADATA_RESULT_SOURCE, useDraftStore } from '@/entities/draft';
import { useGameStore } from '@/entities/game';
import { useMoveHistoryStore, type MoveHistoryItem } from '@/entities/move-history';
import { CHESS_DB_DRAFT_KEY, serializeDraft } from '@/shared/lib/storage/draft-storage';
import { App } from './app';

const createMove = (
  from: Move['from'],
  to: Move['to'],
  kind: typeof MOVE_KIND.NORMAL | typeof MOVE_KIND.DOUBLE_PAWN_PUSH = MOVE_KIND.NORMAL,
): Move => ({
  from,
  to,
  kind,
});

const createDraftSnapshotFixture = () => {
  const beforeState = createInitialGameState();
  const move = createMove(SQUARE.E2, SQUARE.E4, MOVE_KIND.DOUBLE_PAWN_PUSH);
  const afterState = executeMove(beforeState, move);
  const historyItem = {
    halfMoveIndex: 0,
    moveNumber: 1,
    side: beforeState.turn,
    san: 'e4',
    move,
    beforeState,
    afterState,
  } satisfies MoveHistoryItem;

  return {
    gameState: afterState,
    historyItems: [historyItem],
    moveComments: [{ halfMoveIndex: 0, comment: '중앙을 잡는다' }],
    moveAnnotations: [{ halfMoveIndex: 0, annotation: MOVE_ANNOTATION.GOOD }],
    metadata: {
      result: GAME_RECORD_RESULT.WHITE_WIN,
      terminationReason: GAME_TERMINATION_REASON.CHECKMATE,
      playedAt: '2026-05-16',
      resultSource: DRAFT_GAME_METADATA_RESULT_SOURCE.MANUAL,
    },
    savedAt: '2026-05-16T00:00:00.000Z',
  };
};

const resetStores = () => {
  useGameStore.setState({
    gameState: createInitialGameState(),
    repetitionHistory: {},
  });
  useMoveHistoryStore.getState().clearMoveHistory();
  useDraftStore.getState().clearDraftComments();
  useDraftStore.getState().clearDraftAnnotations();
  useDraftStore.getState().clearGameMetadata();
};

describe('App', () => {
  beforeEach(() => {
    localStorage.clear();
    resetStores();
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    vi.useRealTimers();
    localStorage.clear();
    resetStores();
  });

  it('루트 라우트에서 저장소 목록 화면으로 이동해야 한다', async () => {
    window.history.pushState({}, '', '/');

    render(<App />);

    expect(await screen.findByRole('heading', { name: '저장소 선택' })).toBeInTheDocument();
    expect(window.location.pathname).toBe('/repositories');
  });

  it('새로고침 복원 시 저장 토스트를 먼저 표시하지 않아야 한다', async () => {
    window.history.pushState({}, '', '/repositories/11111111-1111-4111-8111-111111111111/new');
    const draftSnapshot = createDraftSnapshotFixture();
    localStorage.setItem(CHESS_DB_DRAFT_KEY, serializeDraft(draftSnapshot));

    render(
      <StrictMode>
        <App />
      </StrictMode>,
    );

    expect(await screen.findByText('초안 복원됨')).toBeInTheDocument();
    expect(screen.queryByText('초안 저장됨')).not.toBeInTheDocument();
    expect(useGameStore.getState().gameState).toEqual(draftSnapshot.gameState);
    expect(useMoveHistoryStore.getState().historyItems).toEqual(draftSnapshot.historyItems);
    expect(useDraftStore.getState().moveComments).toEqual(draftSnapshot.moveComments);
    expect(useDraftStore.getState().moveAnnotations).toEqual(draftSnapshot.moveAnnotations);
    expect(useDraftStore.getState().metadata).toEqual(draftSnapshot.metadata);
  });

  it('새로고침 복원 토스트는 StrictMode에서도 2초 뒤 사라져야 한다', async () => {
    window.history.pushState({}, '', '/repositories/11111111-1111-4111-8111-111111111111/new');
    localStorage.setItem(CHESS_DB_DRAFT_KEY, serializeDraft(createDraftSnapshotFixture()));

    render(
      <StrictMode>
        <App />
      </StrictMode>,
    );

    expect(await screen.findByText('초안 복원됨')).toBeInTheDocument();

    await waitFor(
      () => {
        expect(screen.queryByText('초안 복원됨')).not.toBeInTheDocument();
      },
      { timeout: 2500 },
    );
  });

  it('복원된 초안 초기화를 취소하면 기존 상태와 storage를 유지해야 한다', async () => {
    const user = userEvent.setup();
    window.history.pushState({}, '', '/repositories/11111111-1111-4111-8111-111111111111/new');
    const draftSnapshot = createDraftSnapshotFixture();
    localStorage.setItem(CHESS_DB_DRAFT_KEY, serializeDraft(draftSnapshot));

    render(<App />);

    await waitFor(() => {
      expect(useGameStore.getState().gameState).toEqual(draftSnapshot.gameState);
    });

    await user.click(screen.getByRole('button', { name: '초기화' }));
    await user.click(screen.getByRole('button', { name: '취소' }));

    expect(screen.queryByRole('alertdialog', { name: '초안 초기화' })).not.toBeInTheDocument();
    expect(useGameStore.getState().gameState).toEqual(draftSnapshot.gameState);
    expect(useMoveHistoryStore.getState().historyItems).toEqual(draftSnapshot.historyItems);
    expect(useDraftStore.getState().moveComments).toEqual(draftSnapshot.moveComments);
    expect(useDraftStore.getState().moveAnnotations).toEqual(draftSnapshot.moveAnnotations);
    expect(useDraftStore.getState().metadata).toEqual(draftSnapshot.metadata);
    expect(localStorage.getItem(CHESS_DB_DRAFT_KEY)).toBe(serializeDraft(draftSnapshot));
  });

  it('복원된 초안 초기화를 확인하면 메모리 상태와 storage를 초기화해야 한다', async () => {
    const user = userEvent.setup();
    window.history.pushState({}, '', '/repositories/11111111-1111-4111-8111-111111111111/new');
    const draftSnapshot = createDraftSnapshotFixture();
    localStorage.setItem(CHESS_DB_DRAFT_KEY, serializeDraft(draftSnapshot));

    render(<App />);

    await waitFor(() => {
      expect(useGameStore.getState().gameState).toEqual(draftSnapshot.gameState);
    });

    await user.click(screen.getByRole('button', { name: '초기화' }));
    await user.click(screen.getByRole('button', { name: '초기화' }));

    expect(useGameStore.getState().gameState).toEqual(createInitialGameState());
    expect(useMoveHistoryStore.getState().historyItems).toEqual([]);
    expect(useMoveHistoryStore.getState().selectedHalfMoveIndex).toBeNull();
    expect(useDraftStore.getState().moveComments).toEqual([]);
    expect(useDraftStore.getState().moveAnnotations).toEqual([]);
    expect(useDraftStore.getState().metadata).toEqual({
      result: null,
      terminationReason: null,
      playedAt: expect.any(String),
      resultSource: null,
    });
    expect(localStorage.getItem(CHESS_DB_DRAFT_KEY)).toBeNull();
    expect(screen.queryByText('초안 저장됨')).not.toBeInTheDocument();
  });

  it('복원된 초안을 기보 저장하면 성공 후 localStorage 초안을 삭제하고 상세 이동하지 않아야 한다', async () => {
    const user = userEvent.setup();
    window.history.pushState({}, '', '/repositories/11111111-1111-4111-8111-111111111111/new');
    const draftSnapshot = createDraftSnapshotFixture();
    localStorage.setItem(CHESS_DB_DRAFT_KEY, serializeDraft(draftSnapshot));
    const fetchMock = vi.fn<typeof fetch>();
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify({ id: 'game-1' }), { status: 201 }),
    );
    vi.stubGlobal('fetch', fetchMock);

    render(<App />);

    await waitFor(() => {
      expect(useGameStore.getState().gameState).toEqual(draftSnapshot.gameState);
    });

    await user.click(screen.getByRole('button', { name: '기보 저장' }));

    expect(await screen.findByText('기보가 저장되었습니다.')).toBeInTheDocument();
    expect(localStorage.getItem(CHESS_DB_DRAFT_KEY)).toBeNull();
    expect(window.location.pathname).toBe('/repositories/11111111-1111-4111-8111-111111111111/new');

    const moveHistoryRegion = screen.getByRole('region', { name: '수순 목록' });
    await user.click(within(moveHistoryRegion).getByRole('button', { name: /e4/ }));
    await user.clear(screen.getByRole('textbox', { name: '선택 수 코멘트' }));
    await user.type(screen.getByRole('textbox', { name: '선택 수 코멘트' }), '저장 후 새 수정');

    await waitFor(() => {
      expect(localStorage.getItem(CHESS_DB_DRAFT_KEY)).not.toBeNull();
    });
  });

  it('복원된 초안 기보 저장이 실패하면 localStorage와 메모리 상태를 유지해야 한다', async () => {
    const user = userEvent.setup();
    window.history.pushState({}, '', '/repositories/11111111-1111-4111-8111-111111111111/new');
    const draftSnapshot = createDraftSnapshotFixture();
    const serializedDraft = serializeDraft(draftSnapshot);
    localStorage.setItem(CHESS_DB_DRAFT_KEY, serializedDraft);
    const fetchMock = vi.fn<typeof fetch>();
    fetchMock.mockResolvedValueOnce(new Response('저장 실패', { status: 500 }));
    vi.stubGlobal('fetch', fetchMock);

    render(<App />);

    await waitFor(() => {
      expect(useGameStore.getState().gameState).toEqual(draftSnapshot.gameState);
    });

    await user.click(screen.getByRole('button', { name: '기보 저장' }));

    expect(await screen.findByText('기보 저장에 실패했습니다.')).toBeInTheDocument();
    expect(localStorage.getItem(CHESS_DB_DRAFT_KEY)).toBe(serializedDraft);
    expect(useGameStore.getState().gameState).toEqual(draftSnapshot.gameState);
    expect(useMoveHistoryStore.getState().historyItems).toEqual(draftSnapshot.historyItems);
    expect(useDraftStore.getState().moveComments).toEqual(draftSnapshot.moveComments);
    expect(useDraftStore.getState().moveAnnotations).toEqual(draftSnapshot.moveAnnotations);
    expect(useDraftStore.getState().metadata).toEqual(draftSnapshot.metadata);
  });
});
