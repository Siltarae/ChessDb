import { RequestMethod } from '@nestjs/common';
import { METHOD_METADATA, PATH_METADATA } from '@nestjs/common/constants';
import { RepositoriesController } from './repositories.controller';
import { RepositoriesService } from './repositories.service';

describe('RepositoriesController.findMany', () => {
  let repositoriesController: RepositoriesController;
  let repositoriesService: jest.Mocked<Pick<RepositoriesService, 'findMany'>>;

  beforeEach(() => {
    repositoriesService = {
      findMany: jest.fn().mockResolvedValue([
        {
          id: 'repository-1',
          name: '오프닝 저장소',
          createdAt: new Date('2026-05-20T00:00:00.000Z'),
        },
      ]),
    };

    repositoriesController = new RepositoriesController(
      repositoriesService as unknown as RepositoriesService,
    );
  });

  it('repositories resource controller로 등록되어야 한다', () => {
    expect(Reflect.getMetadata(PATH_METADATA, RepositoriesController)).toBe(
      'repositories',
    );
  });

  it('GET /api/repositories 진입점을 제공해야 한다', () => {
    const findManyDescriptor = Object.getOwnPropertyDescriptor(
      RepositoriesController.prototype,
      'findMany',
    ) as
      | TypedPropertyDescriptor<RepositoriesController['findMany']>
      | undefined;
    const findManyHandler = findManyDescriptor?.value;

    expect(findManyHandler).toBeDefined();
    if (!findManyHandler) {
      throw new Error('findMany handler를 찾을 수 없습니다.');
    }
    expect(Reflect.getMetadata(PATH_METADATA, findManyHandler)).toBe('/');
    expect(Reflect.getMetadata(METHOD_METADATA, findManyHandler)).toBe(
      RequestMethod.GET,
    );
  });

  it('저장소 목록 조회를 service에 위임하고 결과를 반환한다', async () => {
    await expect(repositoriesController.findMany()).resolves.toEqual([
      {
        id: 'repository-1',
        name: '오프닝 저장소',
        createdAt: new Date('2026-05-20T00:00:00.000Z'),
      },
    ]);

    expect(repositoriesService.findMany).toHaveBeenCalledTimes(1);
  });
});
