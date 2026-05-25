import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';

export type RepositorySummary = {
  readonly id: string;
  readonly name: string;
  readonly createdAt: Date;
};

export type CreateRepositoryInput = {
  readonly name: string;
};

export type DeleteRepositoryInput = {
  readonly repositoryId: string;
};

@Injectable()
export class RepositoriesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(): Promise<RepositorySummary[]> {
    return await this.prisma.repository.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: {
        createdAt: 'asc',
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
      },
    });
  }

  async create(
    createRepositoryInput: CreateRepositoryInput,
  ): Promise<RepositorySummary> {
    return await this.prisma.repository.create({
      data: {
        name: createRepositoryInput.name,
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
      },
    });
  }

  async delete({ repositoryId }: DeleteRepositoryInput): Promise<boolean> {
    const repository = await this.prisma.repository.findUnique({
      where: {
        id: repositoryId,
        deletedAt: null,
      },
      select: {
        id: true,
      },
    });

    if (repository === null) {
      return false;
    }

    const deletedAt = new Date();

    await this.prisma.$transaction([
      this.prisma.game.updateMany({
        where: {
          repositoryId,
          deletedAt: null,
        },
        data: {
          deletedAt,
        },
      }),
      this.prisma.repository.update({
        where: {
          id: repositoryId,
        },
        data: {
          deletedAt,
        },
      }),
    ]);

    return true;
  }
}
