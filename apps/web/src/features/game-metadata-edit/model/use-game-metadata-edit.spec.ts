import { GAME_RECORD_RESULT, GAME_TERMINATION_REASON } from '@chess-db/shared';
import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

import { createDefaultPlayedAt, selectGameMetadata, useDraftStore } from '@/entities/draft';
import {
  decisiveTerminationReasonOptions,
  drawTerminationReasonOptions,
  gameResultOptions,
} from './game-metadata-options';
import { useGameMetadataEdit } from './use-game-metadata-edit';

describe('useGameMetadataEdit', () => {
  beforeEach(() => {
    useDraftStore.getState().clearDraftComments();
    useDraftStore.getState().clearDraftAnnotations();
    useDraftStore.getState().clearGameMetadata();
  });

  it('초기 상태에서는 선택된 결과와 종료 사유가 없어야 한다', () => {
    const { result } = renderHook(() => useGameMetadataEdit());

    expect(result.current.selectedResult).toBeNull();
    expect(result.current.selectedTerminationReason).toBeNull();
    expect(result.current.playedAtValue).toBe(createDefaultPlayedAt());
  });

  it('결과 옵션을 shared 저장값과 UI label로 제공해야 한다', () => {
    const { result } = renderHook(() => useGameMetadataEdit());

    expect(result.current.resultOptions).toBe(gameResultOptions);
    expect(result.current.resultOptions.map((option) => option.label)).toEqual([
      '1-0',
      '0-1',
      '1/2-1/2',
    ]);
  });

  it('승부 결과에서는 승부 종료 사유 옵션만 제공해야 한다', () => {
    useDraftStore.getState().updateGameMetadata({ result: GAME_RECORD_RESULT.WHITE_WIN });
    const { result } = renderHook(() => useGameMetadataEdit());

    expect(result.current.terminationReasonOptions).toBe(decisiveTerminationReasonOptions);
    expect(result.current.terminationReasonOptions.map((option) => option.label)).toEqual([
      '체크메이트',
      '기권',
      '시간패',
      '기타',
    ]);
  });

  it('무승부 결과에서는 무승부 종료 사유 옵션만 제공해야 한다', () => {
    useDraftStore.getState().updateGameMetadata({ result: GAME_RECORD_RESULT.DRAW });
    const { result } = renderHook(() => useGameMetadataEdit());

    expect(result.current.terminationReasonOptions).toBe(drawTerminationReasonOptions);
    expect(result.current.terminationReasonOptions.map((option) => option.label)).toEqual([
      '스테일메이트',
      '50수 규칙',
      '3회 반복',
      '기물 부족',
      '무승부 합의',
      '기타',
    ]);
  });

  it('updateResult는 결과만 갱신하고 기존 종료 사유를 보존해야 한다', () => {
    useDraftStore.getState().updateGameMetadata({
      terminationReason: GAME_TERMINATION_REASON.CHECKMATE,
    });
    const { result } = renderHook(() => useGameMetadataEdit());

    act(() => {
      result.current.updateResult(GAME_RECORD_RESULT.WHITE_WIN);
    });

    expect(selectGameMetadata(useDraftStore.getState())).toEqual({
      result: GAME_RECORD_RESULT.WHITE_WIN,
      terminationReason: GAME_TERMINATION_REASON.CHECKMATE,
      playedAt: createDefaultPlayedAt(),
    });
    expect(result.current.selectedResult).toBe(GAME_RECORD_RESULT.WHITE_WIN);
  });

  it('updateResult는 새 결과와 맞지 않는 기존 종료 사유를 null로 초기화해야 한다', () => {
    useDraftStore.getState().updateGameMetadata({
      result: GAME_RECORD_RESULT.DRAW,
      terminationReason: GAME_TERMINATION_REASON.FIFTY_MOVE,
    });
    const { result } = renderHook(() => useGameMetadataEdit());

    act(() => {
      result.current.updateResult(GAME_RECORD_RESULT.WHITE_WIN);
    });

    expect(selectGameMetadata(useDraftStore.getState())).toEqual({
      result: GAME_RECORD_RESULT.WHITE_WIN,
      terminationReason: null,
      playedAt: createDefaultPlayedAt(),
    });
    expect(result.current.selectedTerminationReason).toBeNull();
  });

  it('updateTerminationReason은 종료 사유만 갱신하고 기존 결과를 보존해야 한다', () => {
    useDraftStore.getState().updateGameMetadata({
      result: GAME_RECORD_RESULT.DRAW,
    });
    const { result } = renderHook(() => useGameMetadataEdit());

    act(() => {
      result.current.updateTerminationReason(GAME_TERMINATION_REASON.AGREEMENT);
    });

    expect(selectGameMetadata(useDraftStore.getState())).toEqual({
      result: GAME_RECORD_RESULT.DRAW,
      terminationReason: GAME_TERMINATION_REASON.AGREEMENT,
      playedAt: createDefaultPlayedAt(),
    });
    expect(result.current.selectedTerminationReason).toBe(GAME_TERMINATION_REASON.AGREEMENT);
  });

  it('updatePlayedAt은 날짜만 갱신하고 기존 결과와 종료 사유를 보존해야 한다', () => {
    useDraftStore.getState().updateGameMetadata({
      result: GAME_RECORD_RESULT.WHITE_WIN,
      terminationReason: GAME_TERMINATION_REASON.CHECKMATE,
    });
    const { result } = renderHook(() => useGameMetadataEdit());

    act(() => {
      result.current.updatePlayedAt('2026-04-21');
    });

    expect(selectGameMetadata(useDraftStore.getState())).toEqual({
      result: GAME_RECORD_RESULT.WHITE_WIN,
      terminationReason: GAME_TERMINATION_REASON.CHECKMATE,
      playedAt: '2026-04-21',
    });
    expect(result.current.playedAtValue).toBe('2026-04-21');
  });

  it('updatePlayedAt은 빈 문자열 입력을 null로 저장해야 한다', () => {
    useDraftStore.getState().updateGameMetadata({ playedAt: '2026-04-21' });
    const { result } = renderHook(() => useGameMetadataEdit());

    act(() => {
      result.current.updatePlayedAt('');
    });

    expect(selectGameMetadata(useDraftStore.getState()).playedAt).toBeNull();
    expect(result.current.playedAtValue).toBe('');
  });
});
