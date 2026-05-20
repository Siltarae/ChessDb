import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';

export type RepositorySummary = {
  readonly id: string;
  readonly name: string;
  readonly createdAt: Date;
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
}
