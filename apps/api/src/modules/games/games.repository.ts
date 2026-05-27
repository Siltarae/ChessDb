import type { CreateGameRecordRequest } from '@chess-db/shared';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';

@Injectable()
export class GamesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createGame(
    payload: CreateGameRecordRequest,
  ): Promise<{ id: string } | null> {
    const repository = await this.prisma.repository.findFirst({
      where: {
        id: payload.repositoryId,
        deletedAt: null,
      },
      select: {
        id: true,
      },
    });

    if (repository === null) {
      return null;
    }

    return await this.prisma.game.create({
      data: {
        repositoryId: payload.repositoryId,
        result: payload.result,
        terminationReason: payload.terminationReason,
        playedAt: payload.playedAt ? new Date(payload.playedAt) : null,
        gameMoves: {
          create: payload.moves.map((move) => ({
            halfMoveIndex: move.halfMoveIndex,
            san: move.san,
            move: move.move,
            comment: move.comment,
            annotation: move.annotation,
          })),
        },
      },
      select: { id: true },
    });
  }
}
