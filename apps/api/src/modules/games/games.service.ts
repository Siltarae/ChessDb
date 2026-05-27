import type { CreateGameRecordRequest } from '@chess-db/shared';
import { Injectable, NotFoundException } from '@nestjs/common';
import { GamesRepository } from './games.repository';

@Injectable()
export class GamesService {
  constructor(private readonly gamesRepository: GamesRepository) {}

  async createGame(createGameRecordRequest: CreateGameRecordRequest) {
    const createdGame = await this.gamesRepository.createGame(
      createGameRecordRequest,
    );

    if (createdGame === null) {
      throw new NotFoundException({
        message: 'repository not found',
      });
    }

    return createdGame;
  }
}
