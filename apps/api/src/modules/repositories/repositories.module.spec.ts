import { MODULE_METADATA } from '@nestjs/common/constants';
import { PrismaModule } from 'src/core/database/prisma.module';
import { RepositoriesController } from './repositories.controller';
import { RepositoriesModule } from './repositories.module';
import { RepositoriesRepository } from './repositories.repository';
import { RepositoriesService } from './repositories.service';

describe('RepositoriesModule', () => {
  it('PrismaModule을 연결해야 한다', () => {
    const imports = Reflect.getMetadata(
      MODULE_METADATA.IMPORTS,
      RepositoriesModule,
    ) as unknown;

    expect(imports).toEqual(expect.arrayContaining([PrismaModule]));
  });

  it('저장소 controller와 provider를 등록해야 한다', () => {
    const controllers = Reflect.getMetadata(
      MODULE_METADATA.CONTROLLERS,
      RepositoriesModule,
    ) as unknown;
    const providers = Reflect.getMetadata(
      MODULE_METADATA.PROVIDERS,
      RepositoriesModule,
    ) as unknown;

    expect(controllers).toEqual(
      expect.arrayContaining([RepositoriesController]),
    );
    expect(providers).toEqual(
      expect.arrayContaining([RepositoriesService, RepositoriesRepository]),
    );
  });
});
