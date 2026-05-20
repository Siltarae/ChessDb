import { PrismaService } from 'src/core/database/prisma.service';
import { RepositoriesRepository } from './repositories.repository';

describe('RepositoriesRepository.findMany', () => {
  let repositoriesRepository: RepositoriesRepository;
  let prisma: {
    readonly repository: {
      readonly findMany: jest.Mock;
    };
  };

  beforeEach(() => {
    prisma = {
      repository: {
        findMany: jest.fn().mockResolvedValue([
          {
            id: 'repository-1',
            name: '오프닝 저장소',
            createdAt: new Date('2026-05-20T00:00:00.000Z'),
          },
        ]),
      },
    };

    repositoriesRepository = new RepositoriesRepository(
      prisma as unknown as PrismaService,
    );
  });

  it('저장소 목록 표시 필드만 조회해야 한다', async () => {
    await expect(repositoriesRepository.findMany()).resolves.toEqual([
      {
        id: 'repository-1',
        name: '오프닝 저장소',
        createdAt: new Date('2026-05-20T00:00:00.000Z'),
      },
    ]);

    expect(prisma.repository.findMany).toHaveBeenCalledTimes(1);
    expect(prisma.repository.findMany).toHaveBeenCalledWith({
      select: {
        id: true,
        name: true,
        createdAt: true,
      },
    });
  });
});
