import {
  COLOR,
  GAME_RECORD_RESULT,
  GAME_RESULT_STATUS,
  GAME_TERMINATION_REASON,
  REASON,
  type GameTerminationReason,
  type Reason,
} from '@chess-db/shared';
import { describe, expect, it } from 'vitest';
import { toEngineDerivedGameMetadata } from './engine-result-metadata';

type DrawReason = Exclude<Reason, typeof REASON.CHECKMATE>;

describe('toEngineDerivedGameMetadata', () => {
  describe('진행 중인 게임 결과를 변환할 때', () => {
    it('metadata 후보를 만들지 않아야 한다', () => {
      expect(toEngineDerivedGameMetadata({ status: GAME_RESULT_STATUS.ONGOING })).toBeNull();
    });
  });

  describe('체크메이트 종료 결과를 변환할 때', () => {
    it('백 승리 metadata 후보를 만들어야 한다', () => {
      const result = toEngineDerivedGameMetadata({
        status: GAME_RESULT_STATUS.FINISHED,
        reason: REASON.CHECKMATE,
        winner: COLOR.WHITE,
      });

      expect(result).toEqual({
        result: GAME_RECORD_RESULT.WHITE_WIN,
        terminationReason: GAME_TERMINATION_REASON.CHECKMATE,
      });
    });

    it('흑 승리 metadata 후보를 만들어야 한다', () => {
      const result = toEngineDerivedGameMetadata({
        status: GAME_RESULT_STATUS.FINISHED,
        reason: REASON.CHECKMATE,
        winner: COLOR.BLACK,
      });

      expect(result).toEqual({
        result: GAME_RECORD_RESULT.BLACK_WIN,
        terminationReason: GAME_TERMINATION_REASON.CHECKMATE,
      });
    });
  });

  describe('무승부 종료 결과를 변환할 때', () => {
    it.each([
      [REASON.STALEMATE, GAME_TERMINATION_REASON.STALEMATE],
      [REASON.FIFTY_MOVE, GAME_TERMINATION_REASON.FIFTY_MOVE],
      [REASON.THREEFOLD_REPETITION, GAME_TERMINATION_REASON.THREEFOLD_REPETITION],
      [REASON.INSUFFICIENT_MATERIAL, GAME_TERMINATION_REASON.INSUFFICIENT_MATERIAL],
    ] satisfies ReadonlyArray<[DrawReason, GameTerminationReason]>)(
      '%s reason을 DRAW metadata 후보로 만들어야 한다',
      (reason, terminationReason) => {
        const result = toEngineDerivedGameMetadata({
          status: GAME_RESULT_STATUS.FINISHED,
          reason,
        });

        expect(result).toEqual({
          result: GAME_RECORD_RESULT.DRAW,
          terminationReason,
        });
      },
    );
  });
});
