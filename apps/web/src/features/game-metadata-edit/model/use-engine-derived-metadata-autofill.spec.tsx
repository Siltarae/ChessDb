import {
  COLOR,
  GAME_RECORD_RESULT,
  GAME_TERMINATION_REASON,
  GAME_RESULT_STATUS,
  REASON,
  createInitialGameState,
  getGameResult,
} from '@chess-db/shared';
import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  DRAFT_GAME_METADATA_RESULT_SOURCE,
  selectGameMetadata,
  useDraftStore,
} from '@/entities/draft';
import { useGameStore } from '@/entities/game';
import { useEngineDerivedMetadataAutofill } from './use-engine-derived-metadata-autofill';

vi.mock('@chess-db/shared', async (importOriginal) => {
  const actual = await importOriginal();

  return {
    ...(actual as object),
    getGameResult: vi.fn(),
  };
});

const getGameResultMock = vi.mocked(getGameResult as typeof getGameResult);

describe('useEngineDerivedMetadataAutofill', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useGameStore.setState({
      gameState: createInitialGameState(),
      repetitionHistory: {},
    });
    useDraftStore.getState().clearDraftComments();
    useDraftStore.getState().clearDraftAnnotations();
    useDraftStore.getState().clearGameMetadata();
  });

  it('진행 중이면 metadata를 자동 반영하지 않아야 한다', () => {
    getGameResultMock.mockReturnValue({ status: GAME_RESULT_STATUS.ONGOING });

    renderHook(() => useEngineDerivedMetadataAutofill());

    expect(selectGameMetadata(useDraftStore.getState())).toEqual({
      result: null,
      terminationReason: null,
      playedAt: expect.any(String),
      resultSource: null,
    });
  });

  it('체크메이트 종료 상태이면 metadata를 자동 반영해야 한다', () => {
    getGameResultMock.mockReturnValue({
      status: GAME_RESULT_STATUS.FINISHED,
      reason: REASON.CHECKMATE,
      winner: COLOR.WHITE,
    });

    renderHook(() => useEngineDerivedMetadataAutofill());

    expect(selectGameMetadata(useDraftStore.getState())).toEqual({
      result: GAME_RECORD_RESULT.WHITE_WIN,
      terminationReason: GAME_TERMINATION_REASON.CHECKMATE,
      playedAt: expect.any(String),
      resultSource: DRAFT_GAME_METADATA_RESULT_SOURCE.AUTO,
    });
  });

  it('수동 입력 metadata가 있으면 자동 반영이 덮어쓰지 않아야 한다', () => {
    useDraftStore.getState().updateGameMetadata({
      result: GAME_RECORD_RESULT.BLACK_WIN,
      terminationReason: GAME_TERMINATION_REASON.RESIGNATION,
    });
    getGameResultMock.mockReturnValue({
      status: GAME_RESULT_STATUS.FINISHED,
      reason: REASON.CHECKMATE,
      winner: COLOR.WHITE,
    });

    renderHook(() => useEngineDerivedMetadataAutofill());

    expect(selectGameMetadata(useDraftStore.getState())).toEqual({
      result: GAME_RECORD_RESULT.BLACK_WIN,
      terminationReason: GAME_TERMINATION_REASON.RESIGNATION,
      playedAt: expect.any(String),
      resultSource: DRAFT_GAME_METADATA_RESULT_SOURCE.MANUAL,
    });
  });

  it('이미 같은 자동 반영 metadata이면 다시 갱신하지 않아야 한다', () => {
    const updateGameMetadataSpy = vi.spyOn(useDraftStore.getState(), 'updateGameMetadata');
    useDraftStore.getState().updateGameMetadata(
      {
        result: GAME_RECORD_RESULT.WHITE_WIN,
        terminationReason: GAME_TERMINATION_REASON.CHECKMATE,
      },
      DRAFT_GAME_METADATA_RESULT_SOURCE.AUTO,
    );
    updateGameMetadataSpy.mockClear();
    getGameResultMock.mockReturnValue({
      status: GAME_RESULT_STATUS.FINISHED,
      reason: REASON.CHECKMATE,
      winner: COLOR.WHITE,
    });

    renderHook(() => useEngineDerivedMetadataAutofill());

    expect(updateGameMetadataSpy).not.toHaveBeenCalled();
  });
});
