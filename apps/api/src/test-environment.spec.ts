import { GAME_RECORD_RESULT } from '@chess-db/shared';

describe('API Jest 테스트 환경', () => {
  describe('모노레포 공유 패키지를 사용할 때', () => {
    it('@chess-db/shared export를 인식해야 한다', () => {
      expect(GAME_RECORD_RESULT.ONGOING).toBe('ONGOING');
    });
  });
});
