import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;
  let appService: jest.Mocked<Pick<AppService, 'getHello'>>;

  beforeEach(async () => {
    appService = {
      getHello: jest.fn().mockReturnValue('Hello from service'),
    };
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [{ provide: AppService, useValue: appService }],
    }).compile();

    appController = moduleRef.get<AppController>(AppController);
  });

  describe('루트 핸들러를 실행할 때', () => {
    it('AppService의 루트 응답을 그대로 반환해야 한다', () => {
      const result = appController.getHello();

      expect(result).toBe('Hello from service');
      expect(appService.getHello).toHaveBeenCalledTimes(1);
    });
  });
});
