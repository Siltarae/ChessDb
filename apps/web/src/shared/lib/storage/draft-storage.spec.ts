import { describe, expect, it, vi } from 'vitest';

import { CHESS_DB_DRAFT_KEY, saveDraft, serializeDraft } from './draft-storage';
import type { SerializedDraftSnapshot } from './draft-storage';

const DRAFT_SNAPSHOT_FIXTURE = {
  gameState: {
    turn: 'white',
    board: ['white-king', null, 'black-king'],
  },
  historyItems: [
    {
      halfMoveIndex: 0,
      san: 'e4',
      beforeState: { turn: 'white' },
      afterState: { turn: 'black' },
    },
  ],
  moveComments: [{ halfMoveIndex: 0, comment: '중앙을 잡는다' }],
  moveAnnotations: [{ halfMoveIndex: 0, annotation: '!' }],
  metadata: {
    result: '1-0',
    terminationReason: 'checkmate',
    playedAt: '2026-05-16',
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

      saveDraft(serializedDraft, fakeStorage);

      expect(fakeStorage.setItem).toHaveBeenCalledWith(CHESS_DB_DRAFT_KEY, serializedDraft);
      expect(fakeStorage.getItem(CHESS_DB_DRAFT_KEY)).toBe(serializedDraft);
    });
  });
});
