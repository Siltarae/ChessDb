import { Body, Controller, Get, Post } from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { CreateRepositoryDto } from './dto/create-repository.dto';
import { RepositoriesService } from './repositories.service';

@Controller('repositories')
export class RepositoriesController {
  constructor(private readonly repositoriesService: RepositoriesService) {}

  @Get()
  @ApiOperation({ summary: '저장소 목록 조회' })
  @ApiOkResponse({
    description: '저장소 목록 조회 성공',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
        },
        required: ['id', 'name', 'createdAt'],
      },
    },
  })
  findMany() {
    return this.repositoriesService.findMany();
  }

  @Post()
  @ApiOperation({ summary: '저장소 생성' })
  @ApiBody({ type: CreateRepositoryDto })
  @ApiCreatedResponse({
    description: '저장소 생성 성공',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
        name: { type: 'string' },
        createdAt: { type: 'string', format: 'date-time' },
      },
      required: ['id', 'name', 'createdAt'],
    },
  })
  create(@Body() createRepositoryDto: CreateRepositoryDto) {
    return this.repositoriesService.create(createRepositoryDto);
  }
}
