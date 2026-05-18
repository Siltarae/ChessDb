import {
  GAME_RECORD_RESULT,
  GAME_TERMINATION_REASON,
  MOVE_ANNOTATION,
  type GameRecordResult,
  type GameTerminationReason,
  type MoveAnnotation,
} from '@chess-db/shared';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  createDefaultPlayedAt,
  formatLocalDateOnly,
  isDateOnlyString,
  isGameRecordResult,
  isGameTerminationReason,
  isMoveAnnotation,
  normalizeMoveComment,
  selectGameMetadata,
  selectHydrateDraft,
  selectMoveAnnotationByHalfMoveIndex,
  selectMoveAnnotations,
  selectMoveCommentByHalfMoveIndex,
  selectMoveComments,
  selectResetDraft,
  selectUpdateGameMetadata,
  selectUpdateMoveAnnotation,
  selectUpdateMoveComment,
  useDraftStore,
} from './draft-store';

describe('draft-store', () => {
  beforeEach(() => {
    useDraftStore.getState().clearDraftComments();
    useDraftStore.getState().clearDraftAnnotations();
    useDraftStore.getState().clearGameMetadata();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('normalizeMoveComment로 코멘트 입력값을 저장 표현으로 바꿀 때', () => {
    it('앞뒤 공백을 제거한 문자열을 반환해야 한다', () => {
      expect(normalizeMoveComment('  좋은 중앙 장악  ')).toBe('좋은 중앙 장악');
    });

    it('공백만 있는 입력은 null로 정규화해야 한다', () => {
      expect(normalizeMoveComment('   \n\t  ')).toBeNull();
    });
  });

  describe('useDraftStore가 반수별 코멘트를 갱신할 때', () => {
    it('선택한 반수의 코멘트를 새 항목으로 저장해야 한다', () => {
      const updateMoveComment = selectUpdateMoveComment(useDraftStore.getState());

      updateMoveComment(0, '첫 수 코멘트');

      expect(selectMoveComments(useDraftStore.getState())).toEqual([
        { halfMoveIndex: 0, comment: '첫 수 코멘트' },
      ]);
      expect(selectMoveCommentByHalfMoveIndex(0)(useDraftStore.getState())).toEqual({
        halfMoveIndex: 0,
        comment: '첫 수 코멘트',
      });
    });

    it('같은 반수를 다시 수정하면 항목을 중복 추가하지 않고 기존 코멘트를 대체해야 한다', () => {
      const updateMoveComment = selectUpdateMoveComment(useDraftStore.getState());

      updateMoveComment(0, '초기 코멘트');
      updateMoveComment(0, '수정된 코멘트');

      expect(selectMoveComments(useDraftStore.getState())).toEqual([
        { halfMoveIndex: 0, comment: '수정된 코멘트' },
      ]);
    });

    it('다른 반수의 코멘트는 보존해야 한다', () => {
      const updateMoveComment = selectUpdateMoveComment(useDraftStore.getState());

      updateMoveComment(0, '첫 수');
      updateMoveComment(1, '응수');
      updateMoveComment(0, '첫 수 수정');

      expect(selectMoveComments(useDraftStore.getState())).toEqual([
        { halfMoveIndex: 0, comment: '첫 수 수정' },
        { halfMoveIndex: 1, comment: '응수' },
      ]);
    });

    it('공백만 입력된 코멘트는 null로 저장해야 한다', () => {
      const updateMoveComment = selectUpdateMoveComment(useDraftStore.getState());

      updateMoveComment(0, '초기 코멘트');
      updateMoveComment(0, '   ');

      expect(selectMoveCommentByHalfMoveIndex(0)(useDraftStore.getState())).toEqual({
        halfMoveIndex: 0,
        comment: null,
      });
    });

    it('음수나 정수가 아닌 반수 인덱스는 무시해야 한다', () => {
      const updateMoveComment = selectUpdateMoveComment(useDraftStore.getState());

      updateMoveComment(-1, '잘못된 반수');
      updateMoveComment(0.5, '잘못된 반수');

      expect(selectMoveComments(useDraftStore.getState())).toEqual([]);
    });
  });

  describe('useDraftStore가 반수별 평가 기호를 갱신할 때', () => {
    it('선택한 반수의 평가 기호를 새 항목으로 저장해야 한다', () => {
      const updateMoveAnnotation = selectUpdateMoveAnnotation(useDraftStore.getState());

      updateMoveAnnotation(0, MOVE_ANNOTATION.GOOD);

      expect(selectMoveAnnotations(useDraftStore.getState())).toEqual([
        { halfMoveIndex: 0, annotation: MOVE_ANNOTATION.GOOD },
      ]);
      expect(selectMoveAnnotationByHalfMoveIndex(0)(useDraftStore.getState())).toEqual({
        halfMoveIndex: 0,
        annotation: MOVE_ANNOTATION.GOOD,
      });
    });

    it('같은 반수를 다시 수정하면 항목을 중복 추가하지 않고 기존 평가 기호를 대체해야 한다', () => {
      const updateMoveAnnotation = selectUpdateMoveAnnotation(useDraftStore.getState());

      updateMoveAnnotation(0, MOVE_ANNOTATION.GOOD);
      updateMoveAnnotation(0, MOVE_ANNOTATION.BRILLIANT);

      expect(selectMoveAnnotations(useDraftStore.getState())).toEqual([
        { halfMoveIndex: 0, annotation: MOVE_ANNOTATION.BRILLIANT },
      ]);
    });

    it('다른 반수의 평가 기호와 기존 코멘트는 보존해야 한다', () => {
      const updateMoveComment = selectUpdateMoveComment(useDraftStore.getState());
      const updateMoveAnnotation = selectUpdateMoveAnnotation(useDraftStore.getState());

      updateMoveComment(0, '첫 수 코멘트');
      updateMoveAnnotation(0, MOVE_ANNOTATION.GOOD);
      updateMoveAnnotation(1, MOVE_ANNOTATION.MISTAKE);
      updateMoveAnnotation(0, MOVE_ANNOTATION.BRILLIANT);

      expect(selectMoveAnnotations(useDraftStore.getState())).toEqual([
        { halfMoveIndex: 0, annotation: MOVE_ANNOTATION.BRILLIANT },
        { halfMoveIndex: 1, annotation: MOVE_ANNOTATION.MISTAKE },
      ]);
      expect(selectMoveCommentByHalfMoveIndex(0)(useDraftStore.getState())).toEqual({
        halfMoveIndex: 0,
        comment: '첫 수 코멘트',
      });
    });

    it('null 입력은 현재 반수의 평가 기호를 비워야 한다', () => {
      const updateMoveAnnotation = selectUpdateMoveAnnotation(useDraftStore.getState());

      updateMoveAnnotation(0, MOVE_ANNOTATION.GOOD);
      updateMoveAnnotation(0, null);

      expect(selectMoveAnnotationByHalfMoveIndex(0)(useDraftStore.getState())).toEqual({
        halfMoveIndex: 0,
        annotation: null,
      });
    });

    it('허용되지 않은 문자열과 잘못된 반수 인덱스는 무시해야 한다', () => {
      const updateMoveAnnotation = selectUpdateMoveAnnotation(useDraftStore.getState());

      updateMoveAnnotation(0, 'EXCELLENT' as MoveAnnotation);
      updateMoveAnnotation(-1, MOVE_ANNOTATION.GOOD);

      expect(selectMoveAnnotations(useDraftStore.getState())).toEqual([]);
    });
  });

  describe('isMoveAnnotation으로 평가 기호 저장값을 확인할 때', () => {
    it('shared 평가 기호 값만 허용해야 한다', () => {
      expect(isMoveAnnotation(MOVE_ANNOTATION.INTERESTING)).toBe(true);
      expect(isMoveAnnotation('EXCELLENT')).toBe(false);
    });
  });

  describe('useDraftStore가 기보 메타데이터를 갱신할 때', () => {
    it('새 draft metadata의 playedAt 기본값은 오늘 로컬 날짜여야 한다', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date(2026, 4, 15, 9, 30, 0));

      useDraftStore.getState().clearGameMetadata();

      expect(selectGameMetadata(useDraftStore.getState())).toEqual({
        result: null,
        terminationReason: null,
        playedAt: '2026-05-15',
      });
    });

    it('결과와 종료 사유를 shared 허용 값으로 저장해야 한다', () => {
      const updateGameMetadata = selectUpdateGameMetadata(useDraftStore.getState());

      updateGameMetadata({
        result: GAME_RECORD_RESULT.WHITE_WIN,
        terminationReason: GAME_TERMINATION_REASON.CHECKMATE,
      });

      expect(selectGameMetadata(useDraftStore.getState())).toEqual({
        result: GAME_RECORD_RESULT.WHITE_WIN,
        terminationReason: GAME_TERMINATION_REASON.CHECKMATE,
        playedAt: createDefaultPlayedAt(),
      });
    });

    it('partial update는 기존 메타데이터 필드를 보존해야 한다', () => {
      const updateGameMetadata = selectUpdateGameMetadata(useDraftStore.getState());

      updateGameMetadata({
        result: GAME_RECORD_RESULT.WHITE_WIN,
        terminationReason: GAME_TERMINATION_REASON.CHECKMATE,
      });
      updateGameMetadata({ result: GAME_RECORD_RESULT.DRAW });

      expect(selectGameMetadata(useDraftStore.getState())).toEqual({
        result: GAME_RECORD_RESULT.DRAW,
        terminationReason: GAME_TERMINATION_REASON.CHECKMATE,
        playedAt: createDefaultPlayedAt(),
      });
    });

    it('playedAt은 date-only 문자열 또는 null로 갱신해야 한다', () => {
      const updateGameMetadata = selectUpdateGameMetadata(useDraftStore.getState());

      updateGameMetadata({ playedAt: '2026-04-21' });

      expect(selectGameMetadata(useDraftStore.getState()).playedAt).toBe('2026-04-21');

      updateGameMetadata({ playedAt: null });

      expect(selectGameMetadata(useDraftStore.getState()).playedAt).toBeNull();
    });

    it('playedAt 갱신은 결과와 종료 사유를 보존해야 한다', () => {
      const updateGameMetadata = selectUpdateGameMetadata(useDraftStore.getState());

      updateGameMetadata({
        result: GAME_RECORD_RESULT.WHITE_WIN,
        terminationReason: GAME_TERMINATION_REASON.CHECKMATE,
      });
      updateGameMetadata({ playedAt: '2026-04-21' });

      expect(selectGameMetadata(useDraftStore.getState())).toEqual({
        result: GAME_RECORD_RESULT.WHITE_WIN,
        terminationReason: GAME_TERMINATION_REASON.CHECKMATE,
        playedAt: '2026-04-21',
      });
    });

    it('metadata 갱신은 기존 코멘트와 평가 기호 상태를 보존해야 한다', () => {
      const updateMoveComment = selectUpdateMoveComment(useDraftStore.getState());
      const updateMoveAnnotation = selectUpdateMoveAnnotation(useDraftStore.getState());
      const updateGameMetadata = selectUpdateGameMetadata(useDraftStore.getState());

      updateMoveComment(0, '첫 수 코멘트');
      updateMoveAnnotation(0, MOVE_ANNOTATION.GOOD);
      updateGameMetadata({ result: GAME_RECORD_RESULT.BLACK_WIN });

      expect(selectMoveCommentByHalfMoveIndex(0)(useDraftStore.getState())).toEqual({
        halfMoveIndex: 0,
        comment: '첫 수 코멘트',
      });
      expect(selectMoveAnnotationByHalfMoveIndex(0)(useDraftStore.getState())).toEqual({
        halfMoveIndex: 0,
        annotation: MOVE_ANNOTATION.GOOD,
      });
      expect(selectGameMetadata(useDraftStore.getState())).toEqual({
        result: GAME_RECORD_RESULT.BLACK_WIN,
        terminationReason: null,
        playedAt: createDefaultPlayedAt(),
      });
    });

    it('허용되지 않은 결과와 종료 사유와 날짜는 기존 상태를 유지해야 한다', () => {
      const updateGameMetadata = selectUpdateGameMetadata(useDraftStore.getState());

      updateGameMetadata({
        result: GAME_RECORD_RESULT.WHITE_WIN,
        terminationReason: GAME_TERMINATION_REASON.RESIGNATION,
        playedAt: '2026-04-21',
      });
      updateGameMetadata({ result: '1-0' as GameRecordResult });
      updateGameMetadata({ terminationReason: 'UNSUPPORTED' as GameTerminationReason });
      updateGameMetadata({ playedAt: '' });
      updateGameMetadata({ playedAt: '2026-02-30' });
      updateGameMetadata({ playedAt: '2026-04-21T00:00:00.000Z' });
      updateGameMetadata({ playedAt: new Date(2026, 3, 21) as unknown as string });

      expect(selectGameMetadata(useDraftStore.getState())).toEqual({
        result: GAME_RECORD_RESULT.WHITE_WIN,
        terminationReason: GAME_TERMINATION_REASON.RESIGNATION,
        playedAt: '2026-04-21',
      });
    });

    it('clearGameMetadata는 메타데이터만 초기화해야 한다', () => {
      const updateMoveComment = selectUpdateMoveComment(useDraftStore.getState());
      const updateGameMetadata = selectUpdateGameMetadata(useDraftStore.getState());

      updateMoveComment(0, '첫 수 코멘트');
      updateGameMetadata({
        result: GAME_RECORD_RESULT.DRAW,
        terminationReason: GAME_TERMINATION_REASON.AGREEMENT,
        playedAt: '2026-04-21',
      });

      useDraftStore.getState().clearGameMetadata();

      expect(selectGameMetadata(useDraftStore.getState())).toEqual({
        result: null,
        terminationReason: null,
        playedAt: createDefaultPlayedAt(),
      });
      expect(selectMoveCommentByHalfMoveIndex(0)(useDraftStore.getState())).toEqual({
        halfMoveIndex: 0,
        comment: '첫 수 코멘트',
      });
    });

    it('resetDraft는 코멘트와 평가 기호와 메타데이터를 새 draft 기준으로 초기화해야 한다', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date(2026, 4, 18, 9, 30, 0));
      const updateMoveComment = selectUpdateMoveComment(useDraftStore.getState());
      const updateMoveAnnotation = selectUpdateMoveAnnotation(useDraftStore.getState());
      const updateGameMetadata = selectUpdateGameMetadata(useDraftStore.getState());
      const resetDraft = selectResetDraft(useDraftStore.getState());

      updateMoveComment(0, '첫 수 코멘트');
      updateMoveAnnotation(0, MOVE_ANNOTATION.GOOD);
      updateGameMetadata({
        result: GAME_RECORD_RESULT.DRAW,
        terminationReason: GAME_TERMINATION_REASON.AGREEMENT,
        playedAt: '2026-04-21',
      });

      resetDraft();

      expect(selectMoveComments(useDraftStore.getState())).toEqual([]);
      expect(selectMoveAnnotations(useDraftStore.getState())).toEqual([]);
      expect(selectGameMetadata(useDraftStore.getState())).toEqual({
        result: null,
        terminationReason: null,
        playedAt: '2026-05-18',
      });
    });
  });

  describe('저장된 draft 상태를 복원할 때', () => {
    it('코멘트와 평가 기호와 메타데이터를 저장된 스냅샷으로 한 번에 치환해야 한다', () => {
      const updateMoveComment = selectUpdateMoveComment(useDraftStore.getState());
      const updateMoveAnnotation = selectUpdateMoveAnnotation(useDraftStore.getState());
      const updateGameMetadata = selectUpdateGameMetadata(useDraftStore.getState());
      const hydrateDraft = selectHydrateDraft(useDraftStore.getState());

      updateMoveComment(0, '기존 코멘트');
      updateMoveAnnotation(0, MOVE_ANNOTATION.GOOD);
      updateGameMetadata({ result: GAME_RECORD_RESULT.WHITE_WIN });

      hydrateDraft({
        moveComments: [{ halfMoveIndex: 1, comment: '복원된 코멘트' }],
        moveAnnotations: [{ halfMoveIndex: 1, annotation: MOVE_ANNOTATION.MISTAKE }],
        metadata: {
          result: GAME_RECORD_RESULT.DRAW,
          terminationReason: GAME_TERMINATION_REASON.AGREEMENT,
          playedAt: '2026-05-16',
        },
      });

      expect(selectMoveComments(useDraftStore.getState())).toEqual([
        { halfMoveIndex: 1, comment: '복원된 코멘트' },
      ]);
      expect(selectMoveAnnotations(useDraftStore.getState())).toEqual([
        { halfMoveIndex: 1, annotation: MOVE_ANNOTATION.MISTAKE },
      ]);
      expect(selectGameMetadata(useDraftStore.getState())).toEqual({
        result: GAME_RECORD_RESULT.DRAW,
        terminationReason: GAME_TERMINATION_REASON.AGREEMENT,
        playedAt: '2026-05-16',
      });
    });

    it('복원 입력이 잘못된 값이면 기존 draft 상태를 보존해야 한다', () => {
      const updateMoveComment = selectUpdateMoveComment(useDraftStore.getState());
      const hydrateDraft = selectHydrateDraft(useDraftStore.getState());

      updateMoveComment(0, '기존 코멘트');

      hydrateDraft({
        moveComments: [{ halfMoveIndex: -1, comment: '잘못된 코멘트' }],
        moveAnnotations: [],
        metadata: {
          result: null,
          terminationReason: null,
          playedAt: '2026-05-16',
        },
      });

      expect(selectMoveComments(useDraftStore.getState())).toEqual([
        { halfMoveIndex: 0, comment: '기존 코멘트' },
      ]);
    });
  });

  describe('metadata guard로 저장값을 확인할 때', () => {
    it('shared 결과와 종료 사유 값만 허용해야 한다', () => {
      expect(isGameRecordResult(GAME_RECORD_RESULT.WHITE_WIN)).toBe(true);
      expect(isGameRecordResult('1-0')).toBe(false);
      expect(isGameTerminationReason(GAME_TERMINATION_REASON.TIMEOUT)).toBe(true);
      expect(isGameTerminationReason(GAME_TERMINATION_REASON.CHECKMATE)).toBe(true);
      expect(isGameTerminationReason('UNSUPPORTED')).toBe(false);
    });

    it('date-only 문자열만 playedAt 저장값으로 허용해야 한다', () => {
      expect(isDateOnlyString('2026-04-21')).toBe(true);
      expect(isDateOnlyString('2026-02-30')).toBe(false);
      expect(isDateOnlyString('2026-04-21T00:00:00.000Z')).toBe(false);
      expect(isDateOnlyString('')).toBe(false);
      expect(isDateOnlyString(new Date(2026, 3, 21))).toBe(false);
    });

    it('formatLocalDateOnly는 로컬 날짜 기준 YYYY-MM-DD를 반환해야 한다', () => {
      expect(formatLocalDateOnly(new Date(2026, 0, 5, 23, 30, 0))).toBe('2026-01-05');
    });
  });
});
