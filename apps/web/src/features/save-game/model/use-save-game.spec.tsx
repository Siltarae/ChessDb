import {
  GAME_RECORD_RESULT,
  GAME_TERMINATION_REASON,
  MOVE_ANNOTATION,
  MOVE_KIND,
  SQUARE,
  createInitialGameState,
  executeMove,
  type GameState,
  type Move,
} from '@chess-db/shared';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, cleanup, renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useDraftStore } from '@/entities/draft';
import { useGameStore } from '@/entities/game';
import { useMoveHistoryStore } from '@/entities/move-history';
import { CHESS_DB_DRAFT_KEY, saveDraft, serializeDraft } from '@/shared/lib/storage/draft-storage';
import { useSaveGame } from './use-save-game';

const SAVED_AT_FIXTURE = '2026-05-18T00:00:00.000Z';
const REPOSITORY_ID_FIXTURE = '11111111-1111-4111-8111-111111111111';

const createMove = (
  from: Move['from'],
  to: Move['to'],
  kind: typeof MOVE_KIND.NORMAL | typeof MOVE_KIND.DOUBLE_PAWN_PUSH = MOVE_KIND.NORMAL,
): Move => ({
  from,
  to,
  kind,
});

const appendMove = (beforeState: GameState, move: Move, san: string) => {
  const afterState = executeMove(beforeState, move);

  useMoveHistoryStore.getState().appendMoveHistory({
    beforeState,
    move,
    afterState,
    san,
  });
  useGameStore.getState().applyGameState(afterState);

  return afterState;
};

const resetStores = () => {
  useGameStore.getState().resetGameState();
  useMoveHistoryStore.getState().clearMoveHistory();
  useDraftStore.getState().resetDraft();
};

const seedValidDraft = () => {
  const beforeState = createInitialGameState();
  const move = createMove(SQUARE.E2, SQUARE.E4, MOVE_KIND.DOUBLE_PAWN_PUSH);
  const afterState = appendMove(beforeState, move, 'e4');

  useDraftStore.getState().updateMoveComment(0, '중앙 장악');
  useDraftStore.getState().updateMoveAnnotation(0, MOVE_ANNOTATION.GOOD);
  useDraftStore.getState().updateGameMetadata({
    result: GAME_RECORD_RESULT.WHITE_WIN,
    terminationReason: GAME_TERMINATION_REASON.CHECKMATE,
    playedAt: '2026-05-17',
  });
  saveDraft(
    serializeDraft({
      gameState: afterState,
      historyItems: useMoveHistoryStore.getState().historyItems,
      moveComments: useDraftStore.getState().moveComments,
      moveAnnotations: useDraftStore.getState().moveAnnotations,
      metadata: useDraftStore.getState().metadata,
      savedAt: SAVED_AT_FIXTURE,
    }),
  );
};

const renderUseSaveGame = (repositoryId: string | null = REPOSITORY_ID_FIXTURE) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      mutations: {
        retry: false,
      },
    },
  });
  const wrapper = ({ children }: { readonly children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  return renderHook(() => useSaveGame({ repositoryId }), { wrapper });
};

const createPendingResponse = () => {
  let resolveResponse: (response: Response) => void = () => undefined;
  const responsePromise = new Promise<Response>((resolve) => {
    resolveResponse = resolve;
  });

  return { responsePromise, resolveResponse };
};

describe('useSaveGame', () => {
  beforeEach(() => {
    localStorage.clear();
    resetStores();
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    localStorage.clear();
    resetStores();
  });

  it('정상 draft 저장 성공 시 API를 호출하고 초안을 삭제하며 저장 id를 노출해야 한다', async () => {
    seedValidDraft();
    const fetchMock = vi.fn<typeof fetch>();
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify({ id: 'game-1' }), { status: 201 }),
    );
    vi.stubGlobal('fetch', fetchMock);
    const { result } = renderUseSaveGame();

    await act(async () => {
      await result.current.requestSaveGame();
    });

    expect(fetchMock).toHaveBeenCalledOnce();
    expect(localStorage.getItem(CHESS_DB_DRAFT_KEY)).toBeNull();
    expect(result.current.savedGameId).toBe('game-1');
    expect(result.current.saveStatus).toBe('success');
  });

  it('API 실패 시 localStorage 초안을 유지해야 한다', async () => {
    seedValidDraft();
    const storedDraft = localStorage.getItem(CHESS_DB_DRAFT_KEY);
    const fetchMock = vi.fn<typeof fetch>();
    fetchMock.mockResolvedValueOnce(new Response('저장 실패', { status: 500 }));
    vi.stubGlobal('fetch', fetchMock);
    const { result } = renderUseSaveGame();

    await act(async () => {
      await result.current.requestSaveGame();
    });

    expect(localStorage.getItem(CHESS_DB_DRAFT_KEY)).toBe(storedDraft);
    expect(result.current.savedGameId).toBeNull();
    expect(result.current.saveStatus).toBe('error');
  });

  it('수순이 없으면 API를 호출하지 않고 실패 상태를 노출해야 한다', async () => {
    const fetchMock = vi.fn<typeof fetch>();
    vi.stubGlobal('fetch', fetchMock);
    const { result } = renderUseSaveGame();

    expect(result.current.canSaveGame).toBe(false);

    await act(async () => {
      await result.current.requestSaveGame();
    });

    expect(fetchMock).not.toHaveBeenCalled();
    expect(result.current.saveStatus).toBe('error');
  });

  it('저장소 ID가 없으면 API를 호출하지 않고 실패 상태를 노출해야 한다', async () => {
    seedValidDraft();
    const fetchMock = vi.fn<typeof fetch>();
    vi.stubGlobal('fetch', fetchMock);
    const { result } = renderUseSaveGame(null);

    expect(result.current.canSaveGame).toBe(false);

    await act(async () => {
      await result.current.requestSaveGame();
    });

    expect(fetchMock).not.toHaveBeenCalled();
    expect(result.current.saveStatus).toBe('error');
  });

  it('결과가 없어도 수순이 있으면 진행 중 기보로 저장 가능해야 한다', () => {
    const beforeState = createInitialGameState();
    appendMove(beforeState, createMove(SQUARE.E2, SQUARE.E4, MOVE_KIND.DOUBLE_PAWN_PUSH), 'e4');

    const { result } = renderUseSaveGame();

    expect(result.current.canSaveGame).toBe(true);
  });

  it('저장 중에는 중복 요청을 막아야 한다', async () => {
    seedValidDraft();
    const { responsePromise, resolveResponse } = createPendingResponse();
    const fetchMock = vi.fn<typeof fetch>();
    fetchMock.mockReturnValueOnce(responsePromise);
    vi.stubGlobal('fetch', fetchMock);
    const { result } = renderUseSaveGame();

    await act(async () => {
      const firstRequest = result.current.requestSaveGame();
      await Promise.resolve();
      await result.current.requestSaveGame();
      resolveResponse(new Response(JSON.stringify({ id: 'game-1' }), { status: 201 }));
      await firstRequest;
    });

    expect(fetchMock).toHaveBeenCalledOnce();
    expect(result.current.savedGameId).toBe('game-1');
  });
});
