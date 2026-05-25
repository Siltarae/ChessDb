import { Body, Controller, INestApplication, Post } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ApiBody, DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { APP_PIPE } from '@nestjs/core';
import request from 'supertest';
import { App } from 'supertest/types';
import { cleanupOpenApiDoc, ZodValidationPipe } from 'nestjs-zod';
import {
  GAME_RECORD_RESULT,
  GAME_TERMINATION_REASON,
  MOVE_ANNOTATION,
  MOVE_KIND,
  SQUARE,
} from '@chess-db/shared';
import { CreateGameRecordDto } from '../src/modules/games/dto/create-game-record.dto';

const VALID_CREATE_GAME_RECORD_REQUEST = {
  repositoryId: '11111111-1111-4111-8111-111111111111',
  result: GAME_RECORD_RESULT.WHITE_WIN,
  terminationReason: GAME_TERMINATION_REASON.CHECKMATE,
  playedAt: '2026-05-12',
  moves: [
    {
      halfMoveIndex: 0,
      san: 'e4',
      move: {
        from: SQUARE.E2,
        to: SQUARE.E4,
        kind: MOVE_KIND.DOUBLE_PAWN_PUSH,
      },
      comment: null,
      annotation: MOVE_ANNOTATION.GOOD,
    },
  ],
};

type OpenApiSchemaWithProperties = {
  readonly type?: unknown;
  readonly properties?: Record<string, unknown>;
};

@Controller('zod-dto-test')
class ZodDtoTestController {
  @Post('game-records')
  @ApiBody({ type: CreateGameRecordDto })
  validateCreateGameRecord(@Body() body: CreateGameRecordDto) {
    return {
      moveCount: body.moves.length,
      result: body.result,
    };
  }
}

describe('Zod DTO 공유 구조 (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [ZodDtoTestController],
      providers: [
        {
          provide: APP_PIPE,
          useClass: ZodValidationPipe,
        },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('shared DTO 기반 요청을 검증할 때', () => {
    it('유효하지 않은 payload는 400으로 거절해야 한다', () => {
      return request(app.getHttpServer())
        .post('/zod-dto-test/game-records')
        .send({
          ...VALID_CREATE_GAME_RECORD_REQUEST,
          terminationReason: null,
        })
        .expect(400);
    });

    it('유효한 payload는 controller에 파싱된 body로 전달해야 한다', () => {
      return request(app.getHttpServer())
        .post('/zod-dto-test/game-records')
        .send(VALID_CREATE_GAME_RECORD_REQUEST)
        .expect(201)
        .expect({
          moveCount: 1,
          result: GAME_RECORD_RESULT.WHITE_WIN,
        });
    });
  });

  describe('Swagger 문서를 생성할 때', () => {
    it('shared DTO 기반 요청 schema를 문서에 노출해야 한다', () => {
      const config = new DocumentBuilder().setTitle('DTO test').build();
      const document = cleanupOpenApiDoc(
        SwaggerModule.createDocument(app, config),
      );

      const schemas = document.components?.schemas;
      const createGameRecordSchema = schemas?.CreateGameRecordDto as
        | OpenApiSchemaWithProperties
        | undefined;

      expect(createGameRecordSchema?.type).toBe('object');
      expect(Object.keys(createGameRecordSchema?.properties ?? {})).toEqual(
        expect.arrayContaining([
          'repositoryId',
          'result',
          'terminationReason',
          'playedAt',
          'moves',
        ]),
      );
    });
  });
});
