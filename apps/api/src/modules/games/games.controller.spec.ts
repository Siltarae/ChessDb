import { RequestMethod } from '@nestjs/common';
import { METHOD_METADATA, PATH_METADATA } from '@nestjs/common/constants';
import { GamesController } from './games.controller';
import { GamesService } from './games.service';
import { VALID_CREATE_GAME_RECORD_REQUEST } from './test-utils/create-game-record-request.fixture';

describe('GamesController.create', () => {
  let gamesController: GamesController;
  let gamesService: jest.Mocked<Pick<GamesService, 'createGame'>>;

  beforeEach(() => {
    gamesService = {
      createGame: jest.fn().mockResolvedValue({ id: 'game-1' }),
    };

    gamesController = new GamesController(
      gamesService as unknown as GamesService,
    );
  });

  it('games resource controller로 등록되어야 한다', () => {
    expect(Reflect.getMetadata(PATH_METADATA, GamesController)).toBe('games');
  });

  it('POST /api/games 진입점을 제공해야 한다', () => {
    const createDescriptor = Object.getOwnPropertyDescriptor(
      GamesController.prototype,
      'create',
    ) as TypedPropertyDescriptor<GamesController['create']> | undefined;
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

  it('유효한 기보 저장 요청을 service에 위임하고 ID를 반환한다', async () => {
    await expect(
      (
        gamesController as unknown as {
          create: typeof gamesService.createGame;
        }
      ).create(VALID_CREATE_GAME_RECORD_REQUEST),
    ).resolves.toEqual({ id: 'game-1' });

    expect(gamesService.createGame).toHaveBeenCalledTimes(1);
    expect(gamesService.createGame).toHaveBeenCalledWith(
      VALID_CREATE_GAME_RECORD_REQUEST,
    );
  });
});
