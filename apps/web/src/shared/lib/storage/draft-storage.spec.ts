import {
  COLOR,
  GAME_RECORD_RESULT,
  GAME_TERMINATION_REASON,
  MOVE_ANNOTATION,
  MOVE_KIND,
  SQUARE,
  createInitialGameState,
} from '@chess-db/shared';
import { describe, expect, it, vi } from 'vitest';

import type { SerializedDraftSnapshot } from './draft-storage';
import {
  CHESS_DB_DRAFT_KEY,
  loadDraft,
  removeDraft,
  saveDraft,
  serializeDraft,
} from './draft-storage';

const INITIAL_GAME_STATE = createInitialGameState();
const AFTER_E4_GAME_STATE = {
  ...INITIAL_GAME_STATE,
  turn: COLOR.BLACK,
};

const DRAFT_SNAPSHOT_FIXTURE = {
  gameState: AFTER_E4_GAME_STATE,
  historyItems: [
    {
      halfMoveIndex: 0,
      moveNumber: 1,
      side: COLOR.WHITE,
      san: 'e4',
      move: {
        from: SQUARE.E2,
        to: SQUARE.E4,
        kind: MOVE_KIND.DOUBLE_PAWN_PUSH,
      },
      beforeState: INITIAL_GAME_STATE,
      afterState: AFTER_E4_GAME_STATE,
    },
  ],
  moveComments: [{ halfMoveIndex: 0, comment: '중앙을 잡는다' }],
  moveAnnotations: [{ halfMoveIndex: 0, annotation: MOVE_ANNOTATION.GOOD }],
  metadata: {
    result: GAME_RECORD_RESULT.WHITE_WIN,
    terminationReason: GAME_TERMINATION_REASON.CHECKMATE,
    playedAt: '2026-05-16',
    resultSource: 'MANUAL',
  },
  savedAt: '2026-05-16T00:00:00.000Z',
} satisfies SerializedDraftSnapshot;

const createFakeStorage = (): Storage => {
  const storageItems = new Map<string, string>();

  return {
    get length() {
      return storageItems.size;
    },
    clear: vi.fn(() => storageItems.clear()),
    getItem: vi.fn((key: string) => storageItems.get(key) ?? null),
    key: vi.fn((index: number) => Array.from(storageItems.keys())[index] ?? null),
    removeItem: vi.fn((key: string) => storageItems.delete(key)),
    setItem: vi.fn((key: string, value: string) => {
      storageItems.set(key, value);
    }),
  };
};

describe('draft-storage', () => {
  describe('초안 스냅샷을 직렬화할 때', () => {
    it('저장 대상 필드를 JSON 문자열로 고정해야 한다', () => {
      const serializedDraft = serializeDraft(DRAFT_SNAPSHOT_FIXTURE);

      expect(JSON.parse(serializedDraft)).toEqual(DRAFT_SNAPSHOT_FIXTURE);
      expect(Object.keys(JSON.parse(serializedDraft) as Record<string, unknown>)).toEqual([
        'gameState',
        'historyItems',
        'moveComments',
        'moveAnnotations',
        'metadata',
        'savedAt',
      ]);
    });

    it('UI 전용 상태가 fixture에 포함되지 않아야 한다', () => {
      const serializedDraft = serializeDraft(DRAFT_SNAPSHOT_FIXTURE);

      expect(serializedDraft).not.toContain('selectedHalfMoveIndex');
      expect(serializedDraft).not.toContain('boardOrientation');
      expect(serializedDraft).not.toContain('activeTab');
    });
  });

  describe('직렬화된 초안을 저장할 때', () => {
    it('고정된 localStorage 키로 저장해야 한다', () => {
      const fakeStorage = createFakeStorage();
      const serializedDraft = serializeDraft(DRAFT_SNAPSHOT_FIXTURE);

      const result = saveDraft(serializedDraft, fakeStorage);

      expect(result).toBe(true);
      expect(fakeStorage.setItem).toHaveBeenCalledWith(CHESS_DB_DRAFT_KEY, serializedDraft);
      expect(fakeStorage.getItem(CHESS_DB_DRAFT_KEY)).toBe(serializedDraft);
    });

    it('localStorage 쓰기에 실패하면 false를 반환해야 한다', () => {
      const fakeStorage = createFakeStorage();
      const serializedDraft = serializeDraft(DRAFT_SNAPSHOT_FIXTURE);
      vi.mocked(fakeStorage.setItem).mockImplementation(() => {
        throw new Error('storage unavailable');
      });

      const result = saveDraft(serializedDraft, fakeStorage);

      expect(result).toBe(false);
      expect(fakeStorage.getItem(CHESS_DB_DRAFT_KEY)).toBeNull();
    });
  });

  describe('저장된 초안을 삭제할 때', () => {
    it('고정된 localStorage 키의 값만 삭제해야 한다', () => {
      const fakeStorage = createFakeStorage();
      const serializedDraft = serializeDraft(DRAFT_SNAPSHOT_FIXTURE);

      saveDraft(serializedDraft, fakeStorage);
      fakeStorage.setItem('other-key', 'keep');

      removeDraft(fakeStorage);

      expect(fakeStorage.removeItem).toHaveBeenCalledWith(CHESS_DB_DRAFT_KEY);
      expect(fakeStorage.getItem(CHESS_DB_DRAFT_KEY)).toBeNull();
      expect(fakeStorage.getItem('other-key')).toBe('keep');
    });
  });

  describe('저장된 초안을 불러올 때', () => {
    it('저장된 값이 없으면 null을 반환해야 한다', () => {
      const fakeStorage = createFakeStorage();

      const loadedDraft = loadDraft(fakeStorage);

      expect(loadedDraft).toBeNull();
    });

    it('저장된 초안이 있으면 파싱된 스냅샷을 반환해야 한다', () => {
      const fakeStorage = createFakeStorage();
      const serializedDraft = serializeDraft(DRAFT_SNAPSHOT_FIXTURE);

      saveDraft(serializedDraft, fakeStorage);

      expect(loadDraft(fakeStorage)).toEqual(DRAFT_SNAPSHOT_FIXTURE);
    });

    it('저장된 값이 JSON으로 파싱되지 않으면 null을 반환해야 한다', () => {
      const fakeStorage = createFakeStorage();

      fakeStorage.setItem(CHESS_DB_DRAFT_KEY, '{broken-json');

      expect(loadDraft(fakeStorage)).toBeNull();
    });

    it('파싱된 값에 필수 필드가 누락되면 null을 반환해야 한다', () => {
      const fakeStorage = createFakeStorage();
      const draftWithoutSavedAt = {
        gameState: DRAFT_SNAPSHOT_FIXTURE.gameState,
        historyItems: DRAFT_SNAPSHOT_FIXTURE.historyItems,
        moveComments: DRAFT_SNAPSHOT_FIXTURE.moveComments,
        moveAnnotations: DRAFT_SNAPSHOT_FIXTURE.moveAnnotations,
        metadata: DRAFT_SNAPSHOT_FIXTURE.metadata,
      };

      fakeStorage.setItem(CHESS_DB_DRAFT_KEY, JSON.stringify(draftWithoutSavedAt));

      expect(loadDraft(fakeStorage)).toBeNull();
    });

    it('중첩된 gameState 구조가 유효하지 않으면 null을 반환해야 한다', () => {
      const fakeStorage = createFakeStorage();
      const draftWithInvalidGameState = {
        ...DRAFT_SNAPSHOT_FIXTURE,
        gameState: null,
      };

      fakeStorage.setItem(CHESS_DB_DRAFT_KEY, JSON.stringify(draftWithInvalidGameState));

      expect(loadDraft(fakeStorage)).toBeNull();
    });

    it('중첩된 historyItems 구조가 유효하지 않으면 null을 반환해야 한다', () => {
      const fakeStorage = createFakeStorage();
      const draftWithInvalidHistoryItems = {
        ...DRAFT_SNAPSHOT_FIXTURE,
        historyItems: [
          {
            ...DRAFT_SNAPSHOT_FIXTURE.historyItems[0],
            afterState: null,
          },
        ],
      };

      fakeStorage.setItem(CHESS_DB_DRAFT_KEY, JSON.stringify(draftWithInvalidHistoryItems));

      expect(loadDraft(fakeStorage)).toBeNull();
    });

    it('중첩된 moveComments 구조가 유효하지 않으면 null을 반환해야 한다', () => {
      const fakeStorage = createFakeStorage();
      const draftWithInvalidMoveComments = {
        ...DRAFT_SNAPSHOT_FIXTURE,
        moveComments: [{ halfMoveIndex: -1, comment: '잘못된 코멘트' }],
      };

      fakeStorage.setItem(CHESS_DB_DRAFT_KEY, JSON.stringify(draftWithInvalidMoveComments));

      expect(loadDraft(fakeStorage)).toBeNull();
    });

    it('중첩된 moveAnnotations 구조가 유효하지 않으면 null을 반환해야 한다', () => {
      const fakeStorage = createFakeStorage();
      const draftWithInvalidMoveAnnotations = {
        ...DRAFT_SNAPSHOT_FIXTURE,
        moveAnnotations: [{ halfMoveIndex: 0, annotation: '!' }],
      };

      fakeStorage.setItem(CHESS_DB_DRAFT_KEY, JSON.stringify(draftWithInvalidMoveAnnotations));

      expect(loadDraft(fakeStorage)).toBeNull();
    });

    it('중첩된 metadata 구조가 유효하지 않으면 null을 반환해야 한다', () => {
      const fakeStorage = createFakeStorage();
      const draftWithInvalidMetadata = {
        ...DRAFT_SNAPSHOT_FIXTURE,
        metadata: {
          ...DRAFT_SNAPSHOT_FIXTURE.metadata,
          result: '1-0',
        },
      };

      fakeStorage.setItem(CHESS_DB_DRAFT_KEY, JSON.stringify(draftWithInvalidMetadata));

      expect(loadDraft(fakeStorage)).toBeNull();
    });
  });
});
