import { Injectable } from '@nestjs/common';
import {
  RepositoriesRepository,
  type RepositorySummary,
} from './repositories.repository';

@Injectable()
export class RepositoriesService {
  constructor(
    private readonly repositoriesRepository: RepositoriesRepository,
  ) {}

  async findMany(): Promise<RepositorySummary[]> {
    return await this.repositoriesRepository.findMany();
  }
}
