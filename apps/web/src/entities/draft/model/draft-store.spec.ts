import { beforeEach, describe, expect, it } from 'vitest';

import {
  normalizeMoveComment,
  selectMoveCommentByHalfMoveIndex,
  selectMoveComments,
  selectUpdateMoveComment,
  useDraftStore,
} from './draft-store';

describe('draft-store', () => {
  beforeEach(() => {
    useDraftStore.getState().clearDraftComments();
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
});
