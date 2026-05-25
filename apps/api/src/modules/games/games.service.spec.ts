import { GamesRepository } from './games.repository';
import { GamesService } from './games.service';
import { VALID_CREATE_GAME_RECORD_REQUEST } from './test-utils/create-game-record-request.fixture';

describe('GamesService.createGame', () => {
  let gamesService: GamesService;
  let gamesRepository: jest.Mocked<Pick<GamesRepository, 'createGame'>>;

  beforeEach(() => {
    gamesRepository = {
      createGame: jest.fn().mockResolvedValue({ id: 'game-1' }),
    };

    gamesService = new GamesService(
      gamesRepository as unknown as GamesRepository,
    );
  });

  it('저장소 ID가 포함된 검증 요청을 repository에 위임하고 ID를 반환한다', async () => {
    await expect(
      gamesService.createGame(VALID_CREATE_GAME_RECORD_REQUEST),
    ).resolves.toEqual({ id: 'game-1' });

    expect(gamesRepository.createGame).toHaveBeenCalledTimes(1);
    expect(gamesRepository.createGame).toHaveBeenCalledWith(
      VALID_CREATE_GAME_RECORD_REQUEST,
    );
  });
});
