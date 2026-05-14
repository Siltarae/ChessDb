import { MODULE_METADATA } from '@nestjs/common/constants';
import { AppModule } from './app.module';
import { GamesModule } from './modules/games/games.module';

describe('AppModule', () => {
  it('GamesModule을 연결해야 한다', () => {
    const imports = Reflect.getMetadata(
      MODULE_METADATA.IMPORTS,
      AppModule,
    ) as unknown;

    expect(imports).toEqual(expect.arrayContaining([GamesModule]));
  });
});
