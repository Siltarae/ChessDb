import { describe, expect, expectTypeOf, it } from 'vitest';
import type { z } from 'zod';
import {
  GAME_RECORD_RESULT,
  GAME_TERMINATION_REASON,
  MOVE_ANNOTATION,
  type GameMoveRecord,
  type GameRecord,
} from '../models/game-record.js';
import { MOVE_KIND, PIECE_TYPE, SQUARE } from '../models/game-state.js';
import { GameRecordSchema } from './game-record-schema.js';

type Mutable<T> = {
  -readonly [K in keyof T]: T[K];
};

const GAME_ID = '11111111-1111-4111-8111-111111111111';
const MOVE_ID = '22222222-2222-4222-8222-222222222222';

const VALID_MOVE_RECORD: GameMoveRecord = {
  id: MOVE_ID,
  gameId: GAME_ID,
  halfMoveIndex: 0,
  san: 'e4',
  move: {
    from: SQUARE.E2,
    to: SQUARE.E4,
    kind: MOVE_KIND.DOUBLE_PAWN_PUSH,
  },
  comment: null,
  annotation: MOVE_ANNOTATION.GOOD,
  createdAt: '2026-05-12T12:01:00.000Z',
  updatedAt: '2026-05-12T12:02:00.000Z',
};

const VALID_GAME_RECORD: GameRecord = {
  id: GAME_ID,
  result: GAME_RECORD_RESULT.WHITE_WIN,
  terminationReason: GAME_TERMINATION_REASON.CHECKMATE,
  playedAt: '2026-05-12',
  createdAt: '2026-05-12T12:01:00.000Z',
  updatedAt: '2026-05-12T12:02:00.000Z',
  moves: [VALID_MOVE_RECORD],
};

describe('GameRecordSchema', () => {
  it('유효한 기보 기록을 통과시킨다', () => {
    const result = GameRecordSchema.safeParse(VALID_GAME_RECORD);

    expect(result.success).toBe(true);
  });

  it('반수 항목에서 SAN 문자열이 빠지면 실패한다', () => {
    const moveRecordWithoutSan: Partial<Mutable<GameMoveRecord>> = { ...VALID_MOVE_RECORD };
    delete moveRecordWithoutSan.san;
    const invalidRecord = {
      ...VALID_GAME_RECORD,
      moves: [moveRecordWithoutSan],
    };

    const result = GameRecordSchema.safeParse(invalidRecord);

    expect(result.success).toBe(false);
  });

  it('반수 항목에서 halfMoveIndex 또는 move가 빠지면 실패한다', () => {
    const moveRecordWithoutHalfMoveIndex: Partial<Mutable<GameMoveRecord>> & {
      halfmoveClock: number;
    } = {
      ...VALID_MOVE_RECORD,
      halfmoveClock: 0,
    };
    delete moveRecordWithoutHalfMoveIndex.halfMoveIndex;
    const moveRecordWithoutMove: Partial<Mutable<GameMoveRecord>> = { ...VALID_MOVE_RECORD };
    delete moveRecordWithoutMove.move;
    const missingHalfMoveIndexRecord = {
      ...VALID_GAME_RECORD,
      moves: [moveRecordWithoutHalfMoveIndex],
    };
    const missingMoveRecord = {
      ...VALID_GAME_RECORD,
      moves: [moveRecordWithoutMove],
    };

    expect(GameRecordSchema.safeParse(missingHalfMoveIndexRecord).success).toBe(false);
    expect(GameRecordSchema.safeParse(missingMoveRecord).success).toBe(false);
  });

  it('전체 기보 필수 필드가 누락되면 실패한다', () => {
    const missingCreatedAtRecord: Partial<Mutable<GameRecord>> = { ...VALID_GAME_RECORD };
    delete missingCreatedAtRecord.createdAt;
    const missingResultRecord: Partial<Mutable<GameRecord>> = { ...VALID_GAME_RECORD };
    delete missingResultRecord.result;

    expect(GameRecordSchema.safeParse(missingCreatedAtRecord).success).toBe(false);
    expect(GameRecordSchema.safeParse(missingResultRecord).success).toBe(false);
  });

  it('id와 gameId는 UUID 문자열만 허용한다', () => {
    const recordWithInvalidId = {
      ...VALID_GAME_RECORD,
      id: 'game-1',
    };
    const recordWithInvalidMoveGameId = {
      ...VALID_GAME_RECORD,
      moves: [
        {
          ...VALID_MOVE_RECORD,
          gameId: 'game-1',
        },
      ],
    };

    expect(GameRecordSchema.safeParse(recordWithInvalidId).success).toBe(false);
    expect(GameRecordSchema.safeParse(recordWithInvalidMoveGameId).success).toBe(false);
  });

  it('playedAt은 날짜 문자열이나 null만 허용한다', () => {
    const recordWithoutPlayedAt = {
      ...VALID_GAME_RECORD,
      playedAt: null,
    };
    const recordWithDatetimePlayedAt = {
      ...VALID_GAME_RECORD,
      playedAt: '2026-05-12T12:00:00.000Z',
    };

    expect(GameRecordSchema.safeParse(recordWithoutPlayedAt).success).toBe(true);
    expect(GameRecordSchema.safeParse(recordWithDatetimePlayedAt).success).toBe(false);
  });

  it('게임 결과와 종료 사유의 관계를 검증한다', () => {
    const ongoingRecord = {
      ...VALID_GAME_RECORD,
      result: GAME_RECORD_RESULT.ONGOING,
      terminationReason: null,
    };
    const ongoingRecordWithReason = {
      ...VALID_GAME_RECORD,
      result: GAME_RECORD_RESULT.ONGOING,
      terminationReason: GAME_TERMINATION_REASON.OTHER,
    };
    const finishedRecordWithoutReason = {
      ...VALID_GAME_RECORD,
      result: GAME_RECORD_RESULT.DRAW,
      terminationReason: null,
    };

    expect(GameRecordSchema.safeParse(ongoingRecord).success).toBe(true);
    expect(GameRecordSchema.safeParse(ongoingRecordWithReason).success).toBe(false);
    expect(GameRecordSchema.safeParse(finishedRecordWithoutReason).success).toBe(false);
  });

  it('기존 엔진 Move 분기 규칙을 보존한다', () => {
    const enPassantWithoutCapturedSquare = {
      ...VALID_GAME_RECORD,
      moves: [
        {
          ...VALID_GAME_RECORD.moves[0],
          move: {
            from: SQUARE.E5,
            to: SQUARE.D6,
            kind: MOVE_KIND.EN_PASSANT,
          },
        },
      ],
    };
    const standardMoveWithCapturedSquare = {
      ...VALID_GAME_RECORD,
      moves: [
        {
          ...VALID_GAME_RECORD.moves[0],
          move: {
            from: SQUARE.E2,
            to: SQUARE.E4,
            kind: MOVE_KIND.NORMAL,
            capturedSquare: SQUARE.E3,
          },
        },
      ],
    };
    const promotionMove = {
      ...VALID_GAME_RECORD,
      moves: [
        {
          ...VALID_GAME_RECORD.moves[0],
          move: {
            from: SQUARE.E7,
            to: SQUARE.E8,
            kind: MOVE_KIND.NORMAL,
            promotion: PIECE_TYPE.QUEEN,
          },
        },
      ],
    };

    expect(GameRecordSchema.safeParse(enPassantWithoutCapturedSquare).success).toBe(false);
    expect(GameRecordSchema.safeParse(standardMoveWithCapturedSquare).success).toBe(false);
    expect(GameRecordSchema.safeParse(promotionMove).success).toBe(true);
  });

  it('move 좌표는 기존 Square 인덱스 범위만 허용한다', () => {
    const moveWithInvalidFrom = {
      ...VALID_GAME_RECORD,
      moves: [
        {
          ...VALID_MOVE_RECORD,
          move: {
            ...VALID_MOVE_RECORD.move,
            from: 64,
          },
        },
      ],
    };
    const moveWithInvalidTo = {
      ...VALID_GAME_RECORD,
      moves: [
        {
          ...VALID_MOVE_RECORD,
          move: {
            ...VALID_MOVE_RECORD.move,
            to: -1,
          },
        },
      ],
    };
    const enPassantWithValidCapturedSquare = {
      ...VALID_GAME_RECORD,
      moves: [
        {
          ...VALID_MOVE_RECORD,
          move: {
            from: SQUARE.E5,
            to: SQUARE.D6,
            kind: MOVE_KIND.EN_PASSANT,
            capturedSquare: SQUARE.D5,
          },
        },
      ],
    };

    expect(GameRecordSchema.safeParse(moveWithInvalidFrom).success).toBe(false);
    expect(GameRecordSchema.safeParse(moveWithInvalidTo).success).toBe(false);
    expect(GameRecordSchema.safeParse(enPassantWithValidCapturedSquare).success).toBe(true);
  });

  it('annotation은 정의된 착수 평가 enum 또는 null만 허용한다', () => {
    const recordWithoutAnnotation = {
      ...VALID_GAME_RECORD,
      moves: [
        {
          ...VALID_MOVE_RECORD,
          annotation: null,
        },
      ],
    };
    const recordWithInvalidAnnotation = {
      ...VALID_GAME_RECORD,
      moves: [
        {
          ...VALID_MOVE_RECORD,
          annotation: 'EXCELLENT',
        },
      ],
    };

    expect(GameRecordSchema.safeParse(recordWithoutAnnotation).success).toBe(true);
    expect(GameRecordSchema.safeParse(recordWithInvalidAnnotation).success).toBe(false);
  });

  it('타입과 Zod 스키마 구조가 서로 다르면 드러난다', () => {
    expectTypeOf<z.infer<typeof GameRecordSchema>>().toEqualTypeOf<GameRecord>();
  });
});
