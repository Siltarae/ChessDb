import { RequestMethod } from '@nestjs/common';
import { METHOD_METADATA, PATH_METADATA } from '@nestjs/common/constants';
import { RepositoriesController } from './repositories.controller';
import { RepositoriesService } from './repositories.service';

describe('RepositoriesController', () => {
  let repositoriesController: RepositoriesController;
  let repositoriesService: jest.Mocked<
    Pick<RepositoriesService, 'findMany' | 'create' | 'delete'>
  >;

  beforeEach(() => {
    repositoriesService = {
      findMany: jest.fn().mockResolvedValue([
        {
          id: 'repository-1',
          name: '오프닝 저장소',
          createdAt: new Date('2026-05-20T00:00:00.000Z'),
        },
      ]),
      create: jest.fn().mockResolvedValue({
        id: 'repository-2',
        name: '엔드게임 저장소',
        createdAt: new Date('2026-05-21T00:00:00.000Z'),
      }),
      delete: jest.fn().mockResolvedValue(undefined),
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

  it('POST /api/repositories 진입점을 제공해야 한다', () => {
    const createDescriptor = Object.getOwnPropertyDescriptor(
      RepositoriesController.prototype,
      'create',
    ) as TypedPropertyDescriptor<RepositoriesController['create']> | undefined;
    const createHandler = createDescriptor?.value;

    expect(createHandler).toBeDefined();
    if (!createHandler) {
      throw new Error('create handler를 찾을 수 없습니다.');
    }
    expect(Reflect.getMetadata(PATH_METADATA, createHandler)).toBe('/');
    expect(Reflect.getMetadata(METHOD_METADATA, createHandler)).toBe(
      RequestMethod.POST,
    );
  });

  it('DELETE /api/repositories/:repositoryId 진입점을 제공해야 한다', () => {
    const deleteDescriptor = Object.getOwnPropertyDescriptor(
      RepositoriesController.prototype,
      'delete',
    ) as TypedPropertyDescriptor<RepositoriesController['delete']> | undefined;
    const deleteHandler = deleteDescriptor?.value;

    expect(deleteHandler).toBeDefined();
    if (!deleteHandler) {
      throw new Error('delete handler를 찾을 수 없습니다.');
    }
    expect(Reflect.getMetadata(PATH_METADATA, deleteHandler)).toBe(
      ':repositoryId',
    );
    expect(Reflect.getMetadata(METHOD_METADATA, deleteHandler)).toBe(
      RequestMethod.DELETE,
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

  it('저장소 생성을 service에 위임하고 결과를 반환한다', async () => {
    await expect(
      repositoriesController.create({ name: '엔드게임 저장소' }),
    ).resolves.toEqual({
      id: 'repository-2',
      name: '엔드게임 저장소',
      createdAt: new Date('2026-05-21T00:00:00.000Z'),
    });

    expect(repositoriesService.create).toHaveBeenCalledTimes(1);
    expect(repositoriesService.create).toHaveBeenCalledWith({
      name: '엔드게임 저장소',
    });
  });

  it('저장소 삭제를 service에 위임한다', async () => {
    await expect(
      repositoriesController.delete('repository-1'),
    ).resolves.toBeUndefined();

    expect(repositoriesService.delete).toHaveBeenCalledTimes(1);
    expect(repositoriesService.delete).toHaveBeenCalledWith('repository-1');
  });
});
