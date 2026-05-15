import { describe, expect, expectTypeOf, it } from 'vitest';
import {
  GAME_RECORD_RESULT,
  GAME_TERMINATION_REASON,
  MOVE_ANNOTATION,
  type GameRecord,
} from '../models/game-record.js';
import { MOVE_KIND, PIECE_TYPE, SQUARE } from '../models/game-state.js';
import {
  CreateGameRecordRequestSchema,
  type CreateGameRecordRequest,
} from './create-game-record-request.js';

const VALID_CREATE_GAME_RECORD_REQUEST: CreateGameRecordRequest = {
  result: GAME_RECORD_RESULT.WHITE_WIN,
  terminationReason: GAME_TERMINATION_REASON.CHECKMATE,
  playedAt: '2026-05-12',
  moves: [
    {
      halfMoveIndex: 0,
      san: 'e4',
      move: {
        from: SQUARE.E2,
        to: SQUARE.E4,
        kind: MOVE_KIND.DOUBLE_PAWN_PUSH,
      },
      comment: null,
      annotation: MOVE_ANNOTATION.GOOD,
    },
  ],
};

describe('CreateGameRecordRequestSchema', () => {
  describe('클라이언트가 기보 저장 요청을 보낼 때', () => {
    it('서버 생성 필드가 없는 유효한 요청을 통과시켜야 한다', () => {
      const result = CreateGameRecordRequestSchema.safeParse(VALID_CREATE_GAME_RECORD_REQUEST);

      expect(result.success).toBe(true);
    });

    it('id와 createdAt 같은 서버 생성 필드가 포함되면 실패해야 한다', () => {
      const requestWithServerFields = {
        ...VALID_CREATE_GAME_RECORD_REQUEST,
        id: '11111111-1111-4111-8111-111111111111',
        createdAt: '2026-05-12T12:01:00.000Z',
        moves: [
          {
            ...VALID_CREATE_GAME_RECORD_REQUEST.moves[0],
            gameId: '11111111-1111-4111-8111-111111111111',
            updatedAt: '2026-05-12T12:02:00.000Z',
          },
        ],
      };

      const result = CreateGameRecordRequestSchema.safeParse(requestWithServerFields);

      expect(result.success).toBe(false);
    });

    it('게임 결과와 종료 사유의 관계를 검증해야 한다', () => {
      const ongoingRequest = {
        ...VALID_CREATE_GAME_RECORD_REQUEST,
        result: GAME_RECORD_RESULT.ONGOING,
        terminationReason: null,
      };
      const ongoingRequestWithReason = {
        ...VALID_CREATE_GAME_RECORD_REQUEST,
        result: GAME_RECORD_RESULT.ONGOING,
        terminationReason: GAME_TERMINATION_REASON.OTHER,
      };
      const finishedRequestWithoutReason = {
        ...VALID_CREATE_GAME_RECORD_REQUEST,
        result: GAME_RECORD_RESULT.DRAW,
        terminationReason: null,
      };

      expect(CreateGameRecordRequestSchema.safeParse(ongoingRequest).success).toBe(true);
      expect(CreateGameRecordRequestSchema.safeParse(ongoingRequestWithReason).success).toBe(false);
      expect(CreateGameRecordRequestSchema.safeParse(finishedRequestWithoutReason).success).toBe(
        false,
      );
    });

    it('시간패 종료 사유를 저장 요청 값으로 허용해야 한다', () => {
      const timeoutRequest = {
        ...VALID_CREATE_GAME_RECORD_REQUEST,
        terminationReason: GAME_TERMINATION_REASON.TIMEOUT,
      };

      expect(CreateGameRecordRequestSchema.safeParse(timeoutRequest).success).toBe(true);
    });

    it('비어 있는 수순 목록은 실패해야 한다', () => {
      const requestWithoutMoves = {
        ...VALID_CREATE_GAME_RECORD_REQUEST,
        moves: [],
      };

      const result = CreateGameRecordRequestSchema.safeParse(requestWithoutMoves);

      expect(result.success).toBe(false);
    });

    it('기존 Move 분기 규칙을 보존해야 한다', () => {
      const enPassantWithoutCapturedSquare = {
        ...VALID_CREATE_GAME_RECORD_REQUEST,
        moves: [
          {
            ...VALID_CREATE_GAME_RECORD_REQUEST.moves[0],
            move: {
              from: SQUARE.E5,
              to: SQUARE.D6,
              kind: MOVE_KIND.EN_PASSANT,
            },
          },
        ],
      };
      const promotionRequest = {
        ...VALID_CREATE_GAME_RECORD_REQUEST,
        moves: [
          {
            ...VALID_CREATE_GAME_RECORD_REQUEST.moves[0],
            move: {
              from: SQUARE.E7,
              to: SQUARE.E8,
              kind: MOVE_KIND.NORMAL,
              promotion: PIECE_TYPE.QUEEN,
            },
          },
        ],
      };

      expect(CreateGameRecordRequestSchema.safeParse(enPassantWithoutCapturedSquare).success).toBe(
        false,
      );
      expect(CreateGameRecordRequestSchema.safeParse(promotionRequest).success).toBe(true);
    });

    it('저장된 기보 레코드 타입과 요청 타입을 섞지 않아야 한다', () => {
      expectTypeOf<CreateGameRecordRequest>().not.toEqualTypeOf<GameRecord>();
    });
  });
});
