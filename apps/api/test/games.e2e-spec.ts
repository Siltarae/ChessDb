import {
  GAME_RECORD_RESULT,
  GAME_TERMINATION_REASON,
  MOVE_ANNOTATION,
  MOVE_KIND,
  SQUARE,
} from '@chess-db/shared';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from 'generated/prisma';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { API_ERROR_CODE } from '../src/common/errors/api-error-response';

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

type CreateGameResponse = {
  readonly id: string;
};

type ApiErrorResponse = {
  readonly statusCode: number;
  readonly errorCode: string;
  readonly message: string;
  readonly details: readonly unknown[];
};

function assertTestDatabaseUrl(databaseUrl: string | undefined) {
  if (!databaseUrl) {
    throw new Error('e2e 테스트용 DATABASE_URL이 필요합니다.');
  }

  const databaseName = new URL(databaseUrl).pathname.replace('/', '');
  if (!databaseName.includes('test')) {
    throw new Error(
      `e2e 테스트는 test DB만 사용할 수 있습니다. 현재 DB: ${databaseName}`,
    );
  }
}

function isCreateGameResponse(value: unknown): value is CreateGameResponse {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    typeof value.id === 'string'
  );
}

function isApiErrorResponse(value: unknown): value is ApiErrorResponse {
  return (
    typeof value === 'object' &&
    value !== null &&
    'statusCode' in value &&
    'errorCode' in value &&
    'message' in value &&
    'details' in value &&
    typeof value.statusCode === 'number' &&
    typeof value.errorCode === 'string' &&
    typeof value.message === 'string' &&
    Array.isArray(value.details)
  );
}

function requireApp(app: INestApplication<App> | undefined) {
  if (!app) {
    throw new Error('Nest 애플리케이션이 초기화되지 않았습니다.');
  }

  return app;
}

function requirePrisma(prisma: PrismaClient | undefined) {
  if (!prisma) {
    throw new Error('PrismaClient가 초기화되지 않았습니다.');
  }

  return prisma;
}

describe('Games API (e2e)', () => {
  let app: INestApplication<App> | undefined;
  let prisma: PrismaClient | undefined;

  beforeAll(async () => {
    assertTestDatabaseUrl(process.env.DATABASE_URL);

    prisma = new PrismaClient({
      adapter: new PrismaPg({
        connectionString: process.env.DATABASE_URL,
      }),
    });
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();
  });

  beforeEach(async () => {
    const db = requirePrisma(prisma);

    await db.gameMove.deleteMany();
    await db.game.deleteMany();
    await db.repository.deleteMany();
  });

  afterAll(async () => {
    if (prisma) {
      await prisma.gameMove.deleteMany();
      await prisma.game.deleteMany();
      await prisma.repository.deleteMany();
      await prisma.$disconnect();
    }

    await app?.close();
  });

  it('POST /api/games 요청으로 Game과 GameMove를 실제 DB에 저장해야 한다', async () => {
    const firstMove = VALID_CREATE_GAME_RECORD_REQUEST.moves[0]!;
    const db = requirePrisma(prisma);
    const server = requireApp(app).getHttpServer();
    const repository = await db.repository.create({
      data: {
        name: '기보 저장소',
      },
    });

    const response = await request(server)
      .post('/api/games')
      .send({
        ...VALID_CREATE_GAME_RECORD_REQUEST,
        repositoryId: repository.id,
      })
      .expect(201);
    const responseBody = response.body as unknown;

    expect(isCreateGameResponse(responseBody)).toBe(true);
    if (!isCreateGameResponse(responseBody)) {
      throw new Error('기보 저장 응답에 id가 없습니다.');
    }

    const savedGame = await db.game.findUnique({
      where: { id: responseBody.id },
      include: { gameMoves: true },
    });
    const savedMove = savedGame?.gameMoves[0];

    expect(savedGame).not.toBeNull();
    expect(savedGame?.repositoryId).toBe(repository.id);
    expect(savedGame?.result).toBe(GAME_RECORD_RESULT.WHITE_WIN);
    expect(savedGame?.terminationReason).toBe(
      GAME_TERMINATION_REASON.CHECKMATE,
    );
    expect(savedGame?.playedAt?.toISOString()).toBe('2026-05-12T00:00:00.000Z');
    expect(savedGame?.gameMoves).toHaveLength(1);
    expect(savedMove?.halfMoveIndex).toBe(0);
    expect(savedMove?.san).toBe('e4');
    expect(savedMove?.move).toEqual(firstMove.move);
    expect(savedMove?.comment).toBeNull();
    expect(savedMove?.annotation).toBe(MOVE_ANNOTATION.GOOD);
  });

  it('playedAt이 null이면 실제 DB에도 null로 저장해야 한다', async () => {
    const db = requirePrisma(prisma);
    const server = requireApp(app).getHttpServer();
    const repository = await db.repository.create({
      data: {
        name: '기보 저장소',
      },
    });

    const response = await request(server)
      .post('/api/games')
      .send({
        ...VALID_CREATE_GAME_RECORD_REQUEST,
        repositoryId: repository.id,
        playedAt: null,
      })
      .expect(201);
    const responseBody = response.body as unknown;

    expect(isCreateGameResponse(responseBody)).toBe(true);
    if (!isCreateGameResponse(responseBody)) {
      throw new Error('기보 저장 응답에 id가 없습니다.');
    }

    const savedGame = await db.game.findUnique({
      where: { id: responseBody.id },
    });

    expect(savedGame?.playedAt).toBeNull();
  });

  it('유효하지 않은 요청은 DB에 저장하지 않고 400으로 거절해야 한다', async () => {
    const db = requirePrisma(prisma);
    const server = requireApp(app).getHttpServer();
    const repository = await db.repository.create({
      data: {
        name: '기보 저장소',
      },
    });

    const response = await request(server)
      .post('/api/games')
      .send({
        ...VALID_CREATE_GAME_RECORD_REQUEST,
        repositoryId: repository.id,
        moves: [],
      })
      .expect(400);
    const responseBody = response.body as unknown;

    expect(isApiErrorResponse(responseBody)).toBe(true);
    if (!isApiErrorResponse(responseBody)) {
      throw new Error('API 에러 응답 형식이 올바르지 않습니다.');
    }
    expect(responseBody).toMatchObject({
      statusCode: 400,
      errorCode: API_ERROR_CODE.VALIDATION_ERROR,
      message: '요청 값이 올바르지 않습니다.',
    });
    expect(responseBody.details.length).toBeGreaterThan(0);

    await expect(db.game.count()).resolves.toBe(0);
    await expect(db.gameMove.count()).resolves.toBe(0);
  });
});
