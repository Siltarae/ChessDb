import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';
import { CreateGameRecordDto } from './dto/create-game-record.dto';
import { GamesService } from './games.service';

@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Post()
  @ApiOperation({ summary: '기보 저장' })
  @ApiBody({
    type: CreateGameRecordDto,
    examples: {
      ongoingGame: {
        summary: '진행 중인 기보 예시',
        value: {
          result: 'ONGOING',
          playedAt: '2026-05-14',
          moves: [
            {
              halfMoveIndex: 0,
              san: 'e4',
              move: {
                from: 12,
                to: 28,
                kind: 0,
              },
              comment: null,
              annotation: null,
            },
          ],
        },
      },
      finishedGame: {
        summary: '체크메이트로 종료된 기보 예시',
        value: {
          result: 'WHITE_WIN',
          terminationReason: 'CHECKMATE',
          playedAt: '2026-05-14',
          moves: [
            {
              halfMoveIndex: 0,
              san: 'e4',
              move: {
                from: 12,
                to: 28,
                kind: 0,
              },
              comment: null,
              annotation: null,
            },
          ],
        },
      },
    },
  })
  @ApiCreatedResponse({
    description: '기보 저장 성공',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
      },
      required: ['id'],
    },
  })
  create(@Body() createGameRecordDto: CreateGameRecordDto) {
    return this.gamesService.createGame(createGameRecordDto);
  }
}
