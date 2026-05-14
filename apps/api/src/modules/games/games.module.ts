import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/core/database/prisma.module';
import { GamesController } from './games.controller';
import { GamesRepository } from './games.repository';
import { GamesService } from './games.service';

@Module({
  imports: [PrismaModule],
  controllers: [GamesController],
  providers: [GamesService, GamesRepository],
})
export class GamesModule {}
