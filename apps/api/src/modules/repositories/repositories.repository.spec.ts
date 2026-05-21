import { PrismaService } from 'src/core/database/prisma.service';
import { RepositoriesRepository } from './repositories.repository';

describe('RepositoriesRepository', () => {
  let repositoriesRepository: RepositoriesRepository;
  let prisma: {
    readonly repository: {
      readonly findMany: jest.Mock;
      readonly create: jest.Mock;
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
        create: jest.fn().mockResolvedValue({
          id: 'repository-2',
          name: '엔드게임 저장소',
          createdAt: new Date('2026-05-21T00:00:00.000Z'),
        }),
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

  it('저장소를 생성하고 표시 필드만 반환해야 한다', async () => {
    await expect(
      repositoriesRepository.create({ name: '엔드게임 저장소' }),
    ).resolves.toEqual({
      id: 'repository-2',
      name: '엔드게임 저장소',
      createdAt: new Date('2026-05-21T00:00:00.000Z'),
    });

    expect(prisma.repository.create).toHaveBeenCalledTimes(1);
    expect(prisma.repository.create).toHaveBeenCalledWith({
      data: {
        name: '엔드게임 저장소',
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
      },
    });
  });
});
