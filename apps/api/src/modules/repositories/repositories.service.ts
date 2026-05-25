import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  RepositoriesRepository,
  type RepositorySummary,
} from './repositories.repository';

type CreateRepositoryInput = {
  readonly name: string;
};

@Injectable()
export class RepositoriesService {
  constructor(
    private readonly repositoriesRepository: RepositoriesRepository,
  ) {}

  async findMany(): Promise<RepositorySummary[]> {
    return await this.repositoriesRepository.findMany();
  }

  async create(
    createRepositoryInput: CreateRepositoryInput,
  ): Promise<RepositorySummary> {
    const repositoryName = createRepositoryInput.name.trim();

    if (repositoryName.length === 0) {
      throw new BadRequestException({
        message: ['name must not be blank'],
      });
    }

    return await this.repositoriesRepository.create({ name: repositoryName });
  }

  async delete(repositoryId: string): Promise<void> {
    const isDeleted = await this.repositoriesRepository.delete({
      repositoryId,
    });

    if (!isDeleted) {
      throw new NotFoundException({
        message: 'repository not found',
      });
    }
  }
}
