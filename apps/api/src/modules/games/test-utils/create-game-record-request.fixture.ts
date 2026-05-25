import {
  GAME_RECORD_RESULT,
  GAME_TERMINATION_REASON,
  MOVE_ANNOTATION,
  MOVE_KIND,
  SQUARE,
  type CreateGameRecordRequest,
} from '@chess-db/shared';

export const VALID_CREATE_GAME_RECORD_REQUEST: CreateGameRecordRequest = {
  repositoryId: '11111111-1111-4111-8111-111111111111',
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
