import {
  COLOR,
  GAME_RECORD_RESULT,
  GAME_TERMINATION_REASON,
  MOVE_ANNOTATION,
  MOVE_KIND,
  SQUARE,
  createInitialGameState,
  executeMove,
  type Move,
} from '@chess-db/shared';
import { describe, expect, it } from 'vitest';

import { DRAFT_GAME_METADATA_RESULT_SOURCE, type DraftGameMetadata } from '@/entities/draft';
import type { MoveHistoryItem } from '@/entities/move-history';
import { buildCreateGameRecordRequest } from './build-create-game-record-request';

const createMove = (
  from: Move['from'],
  to: Move['to'],
  kind: typeof MOVE_KIND.NORMAL | typeof MOVE_KIND.DOUBLE_PAWN_PUSH = MOVE_KIND.NORMAL,
): Move => ({
  from,
  to,
  kind,
});

const createMoveHistoryItem = (halfMoveIndex: number, san: string, move: Move): MoveHistoryItem => {
  const beforeState = createInitialGameState();
  const afterState = executeMove(beforeState, move);

  return {
    halfMoveIndex,
    moveNumber: 1,
    side: COLOR.WHITE,
    san,
    move,
    beforeState,
    afterState,
  };
};

const DEFAULT_METADATA: DraftGameMetadata = {
  result: GAME_RECORD_RESULT.WHITE_WIN,
  terminationReason: GAME_TERMINATION_REASON.CHECKMATE,
  playedAt: '2026-05-16',
  resultSource: DRAFT_GAME_METADATA_RESULT_SOURCE.MANUAL,
};

const DEFAULT_HISTORY_ITEM = createMoveHistoryItem(
  0,
  'e4',
  createMove(SQUARE.E2, SQUARE.E4, MOVE_KIND.DOUBLE_PAWN_PUSH),
);

describe('buildCreateGameRecordRequest', () => {
  it('수순과 draft 메타데이터를 저장 요청 payload로 변환해야 한다', () => {
    const request = buildCreateGameRecordRequest({
      historyItems: [DEFAULT_HISTORY_ITEM],
      metadata: DEFAULT_METADATA,
      moveAnnotations: [{ halfMoveIndex: 0, annotation: MOVE_ANNOTATION.GOOD }],
      moveComments: [{ halfMoveIndex: 0, comment: '중앙 장악' }],
    });

    expect(request).toEqual({
      result: GAME_RECORD_RESULT.WHITE_WIN,
      terminationReason: GAME_TERMINATION_REASON.CHECKMATE,
      playedAt: '2026-05-16',
      moves: [
        {
          halfMoveIndex: 0,
          san: 'e4',
          move: {
            from: SQUARE.E2,
            to: SQUARE.E4,
            kind: MOVE_KIND.DOUBLE_PAWN_PUSH,
          },
          comment: '중앙 장악',
          annotation: MOVE_ANNOTATION.GOOD,
        },
      ],
    });
  });

  it('수순이 없으면 null을 반환해야 한다', () => {
    const request = buildCreateGameRecordRequest({
      historyItems: [],
      metadata: DEFAULT_METADATA,
      moveAnnotations: [],
      moveComments: [],
    });

    expect(request).toBeNull();
  });

  it('결과가 없으면 진행 중 기보로 변환해야 한다', () => {
    const request = buildCreateGameRecordRequest({
      historyItems: [DEFAULT_HISTORY_ITEM],
      metadata: { ...DEFAULT_METADATA, result: null },
      moveAnnotations: [],
      moveComments: [],
    });

    expect(request?.result).toBe(GAME_RECORD_RESULT.ONGOING);
    expect(request?.terminationReason).toBeNull();
  });

  it('종료된 결과에 종료 사유가 없으면 null을 반환해야 한다', () => {
    const request = buildCreateGameRecordRequest({
      historyItems: [DEFAULT_HISTORY_ITEM],
      metadata: { ...DEFAULT_METADATA, terminationReason: null },
      moveAnnotations: [],
      moveComments: [],
    });

    expect(request).toBeNull();
  });

  it('진행 중 결과에 종료 사유가 있으면 null을 반환해야 한다', () => {
    const request = buildCreateGameRecordRequest({
      historyItems: [DEFAULT_HISTORY_ITEM],
      metadata: {
        ...DEFAULT_METADATA,
        result: GAME_RECORD_RESULT.ONGOING,
        terminationReason: GAME_TERMINATION_REASON.OTHER,
      },
      moveAnnotations: [],
      moveComments: [],
    });

    expect(request).toBeNull();
  });

  it('진행 중 결과와 null 종료 사유는 허용해야 한다', () => {
    const request = buildCreateGameRecordRequest({
      historyItems: [DEFAULT_HISTORY_ITEM],
      metadata: {
        ...DEFAULT_METADATA,
        result: GAME_RECORD_RESULT.ONGOING,
        terminationReason: null,
      },
      moveAnnotations: [],
      moveComments: [],
    });

    expect(request?.terminationReason).toBeNull();
    expect(request?.result).toBe(GAME_RECORD_RESULT.ONGOING);
  });

  it('comment와 annotation이 없으면 null로 병합해야 한다', () => {
    const request = buildCreateGameRecordRequest({
      historyItems: [DEFAULT_HISTORY_ITEM],
      metadata: DEFAULT_METADATA,
      moveAnnotations: [{ halfMoveIndex: 1, annotation: MOVE_ANNOTATION.MISTAKE }],
      moveComments: [{ halfMoveIndex: 1, comment: '다른 수 코멘트' }],
    });

    expect(request?.moves[0]?.comment).toBeNull();
    expect(request?.moves[0]?.annotation).toBeNull();
  });

  it('UI 전용 상태와 서버 생성 필드를 payload에 포함하지 않아야 한다', () => {
    const request = buildCreateGameRecordRequest({
      historyItems: [DEFAULT_HISTORY_ITEM],
      metadata: {
        ...DEFAULT_METADATA,
        resultSource: DRAFT_GAME_METADATA_RESULT_SOURCE.AUTO,
      },
      moveAnnotations: [],
      moveComments: [],
    });
    const serializedRequest = JSON.stringify(request);

    expect(serializedRequest).not.toContain('beforeState');
    expect(serializedRequest).not.toContain('afterState');
    expect(serializedRequest).not.toContain('gameState');
    expect(serializedRequest).not.toContain('selectedHalfMoveIndex');
    expect(serializedRequest).not.toContain('boardOrientation');
    expect(serializedRequest).not.toContain('activeTab');
    expect(serializedRequest).not.toContain('resultSource');
    expect(serializedRequest).not.toContain('repositoryId');
    expect(serializedRequest).not.toContain('createdAt');
    expect(serializedRequest).not.toContain('updatedAt');
  });
});
