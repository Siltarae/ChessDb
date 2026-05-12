import {
  GAME_RECORD_RESULT,
  GAME_TERMINATION_REASON,
  MOVE_ANNOTATION,
  MOVE_KIND,
  SQUARE,
} from '@chess-db/shared';
import { CreateGameRecordDto } from './create-game-record.dto';

const VALID_CREATE_GAME_RECORD_REQUEST = {
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

describe('CreateGameRecordDto', () => {
  describe('shared 저장 요청 schema로 DTO를 만들 때', () => {
    it('유효한 요청 payload를 생성해야 한다', () => {
      const result = CreateGameRecordDto.create(
        VALID_CREATE_GAME_RECORD_REQUEST,
      );

      expect(result).toMatchObject({
        result: GAME_RECORD_RESULT.WHITE_WIN,
        moves: [{ san: 'e4' }],
      });
    });

    it('서버 생성 필드가 포함된 요청 payload는 거절해야 한다', () => {
      const requestWithServerField = {
        ...VALID_CREATE_GAME_RECORD_REQUEST,
        id: '11111111-1111-4111-8111-111111111111',
      };

      expect(() =>
        CreateGameRecordDto.create(requestWithServerField),
      ).toThrow();
    });
  });
});
