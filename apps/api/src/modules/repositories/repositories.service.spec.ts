import { BadRequestException, NotFoundException } from '@nestjs/common';
import { RepositoriesRepository } from './repositories.repository';
import { RepositoriesService } from './repositories.service';

describe('RepositoriesService', () => {
  let repositoriesService: RepositoriesService;
  let repositoriesRepository: jest.Mocked<
    Pick<RepositoriesRepository, 'findMany' | 'create' | 'delete'>
  >;

  beforeEach(() => {
    repositoriesRepository = {
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
      delete: jest.fn().mockResolvedValue(true),
    };

    repositoriesService = new RepositoriesService(
      repositoriesRepository as unknown as RepositoriesRepository,
    );
  });

  it('저장소 목록 조회를 repository에 위임한다', async () => {
    await expect(repositoriesService.findMany()).resolves.toEqual([
      {
        id: 'repository-1',
        name: '오프닝 저장소',
        createdAt: new Date('2026-05-20T00:00:00.000Z'),
      },
    ]);

    expect(repositoriesRepository.findMany).toHaveBeenCalledTimes(1);
  });

  it('저장소 이름을 trim한 뒤 repository에 생성을 위임한다', async () => {
    await expect(
      repositoriesService.create({ name: '  엔드게임 저장소  ' }),
    ).resolves.toEqual({
      id: 'repository-2',
      name: '엔드게임 저장소',
      createdAt: new Date('2026-05-21T00:00:00.000Z'),
    });

    expect(repositoriesRepository.create).toHaveBeenCalledTimes(1);
    expect(repositoriesRepository.create).toHaveBeenCalledWith({
      name: '엔드게임 저장소',
    });
  });

  it('공백 이름이면 BadRequestException으로 거절한다', async () => {
    await expect(
      repositoriesService.create({ name: '   ' }),
    ).rejects.toBeInstanceOf(BadRequestException);

    expect(repositoriesRepository.create).not.toHaveBeenCalled();
  });

  it('저장소 삭제를 repository에 위임한다', async () => {
    await expect(
      repositoriesService.delete('repository-1'),
    ).resolves.toBeUndefined();

    expect(repositoriesRepository.delete).toHaveBeenCalledTimes(1);
    expect(repositoriesRepository.delete).toHaveBeenCalledWith({
      repositoryId: 'repository-1',
    });
  });

  it('삭제 대상 저장소가 없으면 NotFoundException으로 거절한다', async () => {
    repositoriesRepository.delete.mockResolvedValueOnce(false);

    await expect(
      repositoriesService.delete('missing-repository'),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
