import { MOVE_ANNOTATION, type MoveAnnotation } from '@chess-db/shared';
import { beforeEach, describe, expect, it } from 'vitest';

import {
  isMoveAnnotation,
  normalizeMoveComment,
  selectMoveAnnotationByHalfMoveIndex,
  selectMoveAnnotations,
  selectMoveCommentByHalfMoveIndex,
  selectMoveComments,
  selectUpdateMoveAnnotation,
  selectUpdateMoveComment,
  useDraftStore,
} from './draft-store';

describe('draft-store', () => {
  beforeEach(() => {
    useDraftStore.getState().clearDraftComments();
    useDraftStore.getState().clearDraftAnnotations();
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
});
