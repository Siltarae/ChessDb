import { AppService } from './app.service';

describe('AppService', () => {
  describe('루트 응답 메시지를 만들 때', () => {
    it('기본 환영 메시지를 반환해야 한다', () => {
      const appService = new AppService();

      expect(appService.getHello()).toBe('Hello World!');
    });
  });
});
