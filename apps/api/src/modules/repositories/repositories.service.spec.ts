import { RepositoriesRepository } from './repositories.repository';
import { RepositoriesService } from './repositories.service';

describe('RepositoriesService.findMany', () => {
  let repositoriesService: RepositoriesService;
  let repositoriesRepository: jest.Mocked<
    Pick<RepositoriesRepository, 'findMany'>
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
});
