import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/core/database/prisma.module';
import { RepositoriesController } from './repositories.controller';
import { RepositoriesRepository } from './repositories.repository';
import { RepositoriesService } from './repositories.service';

@Module({
  imports: [PrismaModule],
  controllers: [RepositoriesController],
  providers: [RepositoriesService, RepositoriesRepository],
})
export class RepositoriesModule {}
