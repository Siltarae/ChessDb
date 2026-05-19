import { StrictMode } from 'react';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import {
  GAME_RECORD_RESULT,
  GAME_TERMINATION_REASON,
  MOVE_ANNOTATION,
  MOVE_KIND,
  SQUARE,
  createInitialGameState,
  executeMove,
  positionFingerprint,
  type GameState,
  type Move,
} from '@chess-db/shared';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  DRAFT_GAME_METADATA_RESULT_SOURCE,
  useDraftStore,
  type DraftGameMetadata,
  type DraftMoveAnnotation,
  type DraftMoveComment,
} from '@/entities/draft';
import { useGameStore } from '@/entities/game';
import { useMoveHistoryStore, type MoveHistoryItem } from '@/entities/move-history';
import {
  CHESS_DB_DRAFT_KEY,
  serializeDraft,
  type SerializedDraftSnapshot,
} from '@/shared/lib/storage/draft-storage';

import { DraftRestoreProvider } from './draft-restore-provider';

const createMove = (
  from: Move['from'],
  to: Move['to'],
  kind: typeof MOVE_KIND.NORMAL | typeof MOVE_KIND.DOUBLE_PAWN_PUSH = MOVE_KIND.NORMAL,
): Move => ({
  from,
  to,
  kind,
});

const createDraftSnapshotFixture = (): SerializedDraftSnapshot<
  GameState,
  MoveHistoryItem,
  DraftMoveComment,
  DraftMoveAnnotation,
  DraftGameMetadata
> => {
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

describe('DraftRestoreProvider', () => {
  beforeEach(() => {
    localStorage.clear();
    resetStores();
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    vi.restoreAllMocks();
    localStorage.clear();
    resetStores();
  });

  it('children을 그대로 렌더링해야 한다', () => {
    render(
      <DraftRestoreProvider>
        <div>복원 provider child</div>
      </DraftRestoreProvider>,
    );

    expect(screen.getByText('복원 provider child')).toBeInTheDocument();
  });

  it('저장된 초안이 있으면 game, move-history, draft store를 같은 스냅샷으로 복원해야 한다', async () => {
    const draftSnapshot = createDraftSnapshotFixture();
    localStorage.setItem(CHESS_DB_DRAFT_KEY, serializeDraft(draftSnapshot));

    render(
      <DraftRestoreProvider>
        <div>ready</div>
      </DraftRestoreProvider>,
    );

    await waitFor(() => {
      expect(useGameStore.getState().gameState).toEqual(draftSnapshot.gameState);
    });
    expect(useMoveHistoryStore.getState().historyItems).toEqual(draftSnapshot.historyItems);
    expect(useMoveHistoryStore.getState().selectedHalfMoveIndex).toBeNull();
    expect(useDraftStore.getState().moveComments).toEqual(draftSnapshot.moveComments);
    expect(useDraftStore.getState().moveAnnotations).toEqual(draftSnapshot.moveAnnotations);
    expect(useDraftStore.getState().metadata).toEqual(draftSnapshot.metadata);
  });

  it('저장된 초안의 수순 이력으로 반복 이력을 재구성해야 한다', async () => {
    const draftSnapshot = createDraftSnapshotFixture();
    const repeatedBeforeState = draftSnapshot.historyItems[0]?.beforeState;

    if (repeatedBeforeState === undefined) {
      throw new Error('테스트 수순 이력이 없습니다.');
    }

    const draftWithRepeatedHistory = {
      ...draftSnapshot,
      historyItems: [
        draftSnapshot.historyItems[0],
        {
          ...draftSnapshot.historyItems[0],
          halfMoveIndex: 1,
          side: draftSnapshot.gameState.turn,
          beforeState: repeatedBeforeState,
        },
      ],
    };

    localStorage.setItem(CHESS_DB_DRAFT_KEY, serializeDraft(draftWithRepeatedHistory));

    render(
      <DraftRestoreProvider>
        <div>ready</div>
      </DraftRestoreProvider>,
    );

    await waitFor(() => {
      expect(useGameStore.getState().gameState).toEqual(draftSnapshot.gameState);
    });

    expect(
      useGameStore.getState().repetitionHistory[positionFingerprint(repeatedBeforeState)],
    ).toBe(2);
  });

  it('저장된 초안을 복원하면 복원 완료 토스트를 표시한 뒤 숨겨야 한다', async () => {
    localStorage.setItem(CHESS_DB_DRAFT_KEY, serializeDraft(createDraftSnapshotFixture()));

    render(
      <DraftRestoreProvider>
        <div>ready</div>
      </DraftRestoreProvider>,
    );

    expect(await screen.findByRole('status')).toHaveTextContent('초안 복원됨');

    await waitFor(
      () => {
        expect(screen.queryByRole('status')).not.toBeInTheDocument();
      },
      { timeout: 2500 },
    );
  });

  it('저장된 초안이 없으면 초기 store 상태를 유지해야 한다', async () => {
    const initialGameState = useGameStore.getState().gameState;
    const initialMetadata = useDraftStore.getState().metadata;

    render(
      <DraftRestoreProvider>
        <div>ready</div>
      </DraftRestoreProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText('ready')).toBeInTheDocument();
    });
    expect(useGameStore.getState().gameState).toEqual(initialGameState);
    expect(useMoveHistoryStore.getState().historyItems).toEqual([]);
    expect(useDraftStore.getState().metadata).toEqual(initialMetadata);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('저장된 초안이 손상되면 초기 store 상태를 유지해야 한다', async () => {
    const initialGameState = useGameStore.getState().gameState;
    const initialMetadata = useDraftStore.getState().metadata;
    localStorage.setItem(CHESS_DB_DRAFT_KEY, '{broken-json');

    render(
      <DraftRestoreProvider>
        <div>ready</div>
      </DraftRestoreProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText('ready')).toBeInTheDocument();
    });
    expect(useGameStore.getState().gameState).toEqual(initialGameState);
    expect(useMoveHistoryStore.getState().historyItems).toEqual([]);
    expect(useDraftStore.getState().metadata).toEqual(initialMetadata);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('StrictMode에서 effect가 다시 실행되어도 저장소 읽기는 한 번만 수행해야 한다', async () => {
    const getItemSpy = vi.spyOn(Storage.prototype, 'getItem');
    localStorage.setItem(CHESS_DB_DRAFT_KEY, serializeDraft(createDraftSnapshotFixture()));

    render(
      <StrictMode>
        <DraftRestoreProvider>
          <div>ready</div>
        </DraftRestoreProvider>
      </StrictMode>,
    );

    await waitFor(() => {
      expect(getItemSpy).toHaveBeenCalledTimes(1);
    });
  });
});
