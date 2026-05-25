import { PrismaService } from 'src/core/database/prisma.service';
import { RepositoriesRepository } from './repositories.repository';

describe('RepositoriesRepository', () => {
  let repositoriesRepository: RepositoriesRepository;
  let prisma: {
    readonly $transaction: jest.Mock;
    readonly game: {
      readonly updateMany: jest.Mock;
    };
    readonly repository: {
      readonly findMany: jest.Mock;
      readonly create: jest.Mock;
      readonly findUnique: jest.Mock;
      readonly update: jest.Mock;
    };
  };

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-05-25T00:00:00.000Z'));
    prisma = {
      $transaction: jest.fn().mockResolvedValue(undefined),
      game: {
        updateMany: jest.fn().mockReturnValue('soft-delete-games'),
      },
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
        findUnique: jest.fn().mockResolvedValue({ id: 'repository-1' }),
        update: jest.fn().mockReturnValue('soft-delete-repository'),
      },
    };

    repositoriesRepository = new RepositoriesRepository(
      prisma as unknown as PrismaService,
    );
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('삭제되지 않은 저장소 목록 표시 필드만 조회해야 한다', async () => {
    await expect(repositoriesRepository.findMany()).resolves.toEqual([
      {
        id: 'repository-1',
        name: '오프닝 저장소',
        createdAt: new Date('2026-05-20T00:00:00.000Z'),
      },
    ]);

    expect(prisma.repository.findMany).toHaveBeenCalledTimes(1);
    expect(prisma.repository.findMany).toHaveBeenCalledWith({
      orderBy: {
        createdAt: 'asc',
      },
      where: {
        deletedAt: null,
      },
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

  it('저장소와 하위 기보를 transaction으로 soft delete 해야 한다', async () => {
    await expect(
      repositoriesRepository.delete({ repositoryId: 'repository-1' }),
    ).resolves.toBe(true);

    expect(prisma.repository.findUnique).toHaveBeenCalledWith({
      where: {
        id: 'repository-1',
        deletedAt: null,
      },
      select: {
        id: true,
      },
    });
    expect(prisma.game.updateMany).toHaveBeenCalledWith({
      where: {
        repositoryId: 'repository-1',
        deletedAt: null,
      },
      data: {
        deletedAt: new Date('2026-05-25T00:00:00.000Z'),
      },
    });
    expect(prisma.repository.update).toHaveBeenCalledWith({
      where: {
        id: 'repository-1',
      },
      data: {
        deletedAt: new Date('2026-05-25T00:00:00.000Z'),
      },
    });
    expect(prisma.$transaction).toHaveBeenCalledWith([
      'soft-delete-games',
      'soft-delete-repository',
    ]);
  });

  it('삭제할 저장소가 없으면 false를 반환하고 삭제 transaction을 실행하지 않아야 한다', async () => {
    prisma.repository.findUnique.mockResolvedValueOnce(null);

    await expect(
      repositoriesRepository.delete({ repositoryId: 'missing-repository' }),
    ).resolves.toBe(false);

    expect(prisma.game.updateMany).not.toHaveBeenCalled();
    expect(prisma.repository.update).not.toHaveBeenCalled();
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });
});
