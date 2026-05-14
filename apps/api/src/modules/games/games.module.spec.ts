import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/core/database/prisma.service';
import { GamesController } from './games.controller';
import { GamesModule } from './games.module';
import { GamesRepository } from './games.repository';
import { GamesService } from './games.service';

describe('GamesModule', () => {
  it('controller, service, repository 의존성을 조립해야 한다', async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [GamesModule],
    })
      .overrideProvider(PrismaService)
      .useValue({})
      .compile();

    expect(moduleRef.get(GamesController)).toBeInstanceOf(GamesController);
    expect(moduleRef.get(GamesService)).toBeInstanceOf(GamesService);
    expect(moduleRef.get(GamesRepository)).toBeInstanceOf(GamesRepository);
  });
});
