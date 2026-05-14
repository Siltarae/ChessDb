import type { CreateGameRecordRequest } from '@chess-db/shared';
import { Injectable } from '@nestjs/common';
import { GamesRepository } from './games.repository';

@Injectable()
export class GamesService {
  constructor(private readonly gamesRepository: GamesRepository) {}

  async createGame(createGameRecordRequest: CreateGameRecordRequest) {
    return await this.gamesRepository.createGame(createGameRecordRequest);
  }
}
