import { MODULE_METADATA } from '@nestjs/common/constants';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { AppModule } from './app.module';
import { ApiExceptionFilter } from './common/filters/api-exception.filter';
import { GamesModule } from './modules/games/games.module';
import { RepositoriesModule } from './modules/repositories/repositories.module';
import { ZodValidationPipe } from 'nestjs-zod';

describe('AppModule', () => {
  it('GamesModule을 연결해야 한다', () => {
    const imports = Reflect.getMetadata(
      MODULE_METADATA.IMPORTS,
      AppModule,
    ) as unknown;

    expect(imports).toEqual(expect.arrayContaining([GamesModule]));
  });

  it('RepositoriesModule을 연결해야 한다', () => {
    const imports = Reflect.getMetadata(
      MODULE_METADATA.IMPORTS,
      AppModule,
    ) as unknown;

    expect(imports).toEqual(expect.arrayContaining([RepositoriesModule]));
  });

  it('전역 요청 검증 파이프와 예외 필터를 연결해야 한다', () => {
    const providers = Reflect.getMetadata(
      MODULE_METADATA.PROVIDERS,
      AppModule,
    ) as unknown;

    expect(providers).toEqual(
      expect.arrayContaining([
        {
          provide: APP_PIPE,
          useClass: ZodValidationPipe,
        },
        {
          provide: APP_FILTER,
          useClass: ApiExceptionFilter,
        },
      ]),
    );
  });
});
