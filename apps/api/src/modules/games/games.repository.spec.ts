import { PrismaService } from 'src/core/database/prisma.service';
import { GamesRepository } from './games.repository';
import { VALID_CREATE_GAME_RECORD_REQUEST } from './test-utils/create-game-record-request.fixture';

describe('GamesRepository.createGame', () => {
  let gamesRepository: GamesRepository;
  let prisma: {
    readonly repository: {
      readonly findFirst: jest.Mock;
    };
    readonly game: {
      readonly create: jest.Mock;
    };
  };

  beforeEach(() => {
    prisma = {
      repository: {
        findFirst: jest.fn().mockResolvedValue({ id: 'repository-1' }),
      },
      game: {
        create: jest.fn().mockResolvedValue({ id: 'game-1' }),
      },
    };

    gamesRepository = new GamesRepository(prisma as unknown as PrismaService);
  });

  it('Game과 GameMove를 한 번의 Prisma create 입력으로 저장하고 ID를 반환한다', async () => {
    const firstMove = VALID_CREATE_GAME_RECORD_REQUEST.moves[0]!;

    await expect(
      gamesRepository.createGame(VALID_CREATE_GAME_RECORD_REQUEST),
    ).resolves.toEqual({ id: 'game-1' });

    expect(prisma.repository.findFirst).toHaveBeenCalledWith({
      where: {
        id: VALID_CREATE_GAME_RECORD_REQUEST.repositoryId,
        deletedAt: null,
      },
      select: {
        id: true,
      },
    });
    expect(prisma.game.create).toHaveBeenCalledTimes(1);
    expect(prisma.game.create).toHaveBeenCalledWith({
      data: {
        repositoryId: VALID_CREATE_GAME_RECORD_REQUEST.repositoryId,
        result: VALID_CREATE_GAME_RECORD_REQUEST.result,
        terminationReason: VALID_CREATE_GAME_RECORD_REQUEST.terminationReason,
        playedAt: new Date(VALID_CREATE_GAME_RECORD_REQUEST.playedAt!),
        gameMoves: {
          create: [
            {
              halfMoveIndex: 0,
              san: 'e4',
              move: firstMove.move,
              comment: null,
              annotation: firstMove.annotation,
            },
          ],
        },
      },
      select: {
        id: true,
      },
    });
  });

  it('playedAt이 null이면 DB에도 null로 저장한다', async () => {
    const firstMove = VALID_CREATE_GAME_RECORD_REQUEST.moves[0]!;

    await gamesRepository.createGame({
      ...VALID_CREATE_GAME_RECORD_REQUEST,
      playedAt: null,
    });

    expect(prisma.game.create).toHaveBeenCalledWith({
      data: {
        repositoryId: VALID_CREATE_GAME_RECORD_REQUEST.repositoryId,
        result: VALID_CREATE_GAME_RECORD_REQUEST.result,
        terminationReason: VALID_CREATE_GAME_RECORD_REQUEST.terminationReason,
        playedAt: null,
        gameMoves: {
          create: [
            {
              halfMoveIndex: 0,
              san: 'e4',
              move: firstMove.move,
              comment: null,
              annotation: firstMove.annotation,
            },
          ],
        },
      },
      select: {
        id: true,
      },
    });
  });

  it('저장소가 없거나 soft delete 되었으면 Game을 저장하지 않고 null을 반환한다', async () => {
    prisma.repository.findFirst.mockResolvedValueOnce(null);

    await expect(
      gamesRepository.createGame(VALID_CREATE_GAME_RECORD_REQUEST),
    ).resolves.toBeNull();

    expect(prisma.repository.findFirst).toHaveBeenCalledWith({
      where: {
        id: VALID_CREATE_GAME_RECORD_REQUEST.repositoryId,
        deletedAt: null,
      },
      select: {
        id: true,
      },
    });
    expect(prisma.game.create).not.toHaveBeenCalled();
  });
});
