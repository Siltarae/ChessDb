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

@Injectable()
export class RepositoriesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(): Promise<RepositorySummary[]> {
    return await this.prisma.repository.findMany({
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
}
