import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from 'generated/prisma';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { API_ERROR_CODE } from '../src/common/errors/api-error-response';

type RepositoryListItemResponse = {
  readonly id: string;
  readonly name: string;
  readonly createdAt: string;
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

function isRepositoryListResponse(
  value: unknown,
): value is RepositoryListItemResponse[] {
  return Array.isArray(value) && value.every(isRepositoryListItemResponse);
}

function isRepositoryListItemResponse(
  value: unknown,
): value is RepositoryListItemResponse {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'name' in value &&
    'createdAt' in value &&
    typeof value.id === 'string' &&
    typeof value.name === 'string' &&
    typeof value.createdAt === 'string'
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

describe('Repositories API (e2e)', () => {
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

  it('GET /api/repositories 요청으로 저장소 목록을 조회해야 한다', async () => {
    const db = requirePrisma(prisma);
    const server = requireApp(app).getHttpServer();
    const repository = await db.repository.create({
      data: {
        name: '오프닝 저장소',
      },
    });

    const response = await request(server).get('/api/repositories').expect(200);
    const responseBody = response.body as unknown;

    expect(isRepositoryListResponse(responseBody)).toBe(true);
    if (!isRepositoryListResponse(responseBody)) {
      throw new Error('저장소 목록 응답 형식이 올바르지 않습니다.');
    }
    expect(responseBody).toEqual([
      {
        id: repository.id,
        name: '오프닝 저장소',
        createdAt: repository.createdAt.toISOString(),
      },
    ]);
  });

  it('GET /api/repositories 응답은 저장소 생성 순으로 정렬해야 한다', async () => {
    const db = requirePrisma(prisma);
    const server = requireApp(app).getHttpServer();
    const laterRepository = await db.repository.create({
      data: {
        name: '세 번째 저장소',
        createdAt: new Date('2026-05-22T00:00:00.000Z'),
      },
    });
    const earlierRepository = await db.repository.create({
      data: {
        name: '첫 번째 저장소',
        createdAt: new Date('2026-05-20T00:00:00.000Z'),
      },
    });
    const middleRepository = await db.repository.create({
      data: {
        name: '두 번째 저장소',
        createdAt: new Date('2026-05-21T00:00:00.000Z'),
      },
    });

    const response = await request(server).get('/api/repositories').expect(200);
    const responseBody = response.body as unknown;

    expect(isRepositoryListResponse(responseBody)).toBe(true);
    if (!isRepositoryListResponse(responseBody)) {
      throw new Error('저장소 목록 응답 형식이 올바르지 않습니다.');
    }
    expect(responseBody).toEqual([
      {
        id: earlierRepository.id,
        name: '첫 번째 저장소',
        createdAt: earlierRepository.createdAt.toISOString(),
      },
      {
        id: middleRepository.id,
        name: '두 번째 저장소',
        createdAt: middleRepository.createdAt.toISOString(),
      },
      {
        id: laterRepository.id,
        name: '세 번째 저장소',
        createdAt: laterRepository.createdAt.toISOString(),
      },
    ]);
  });

  it('GET /api/repositories 응답은 삭제된 저장소를 제외해야 한다', async () => {
    const db = requirePrisma(prisma);
    const server = requireApp(app).getHttpServer();
    const visibleRepository = await db.repository.create({
      data: {
        name: '표시 저장소',
      },
    });
    await db.repository.create({
      data: {
        name: '삭제된 저장소',
        deletedAt: new Date('2026-05-25T00:00:00.000Z'),
      },
    });

    const response = await request(server).get('/api/repositories').expect(200);
    const responseBody = response.body as unknown;

    expect(isRepositoryListResponse(responseBody)).toBe(true);
    if (!isRepositoryListResponse(responseBody)) {
      throw new Error('저장소 목록 응답 형식이 올바르지 않습니다.');
    }
    expect(responseBody).toEqual([
      {
        id: visibleRepository.id,
        name: '표시 저장소',
        createdAt: visibleRepository.createdAt.toISOString(),
      },
    ]);
  });

  it('POST /api/repositories 요청으로 저장소를 생성해야 한다', async () => {
    const db = requirePrisma(prisma);
    const server = requireApp(app).getHttpServer();

    const response = await request(server)
      .post('/api/repositories')
      .send({ name: '  엔드게임 저장소  ' })
      .expect(201);
    const responseBody = response.body as unknown;

    expect(isRepositoryListItemResponse(responseBody)).toBe(true);
    if (!isRepositoryListItemResponse(responseBody)) {
      throw new Error('저장소 생성 응답 형식이 올바르지 않습니다.');
    }
    expect(responseBody.name).toBe('엔드게임 저장소');
    expect(typeof responseBody.id).toBe('string');
    expect(typeof responseBody.createdAt).toBe('string');

    await expect(db.repository.findMany()).resolves.toMatchObject([
      {
        id: responseBody.id,
        name: '엔드게임 저장소',
      },
    ]);
  });

  it('공백 이름으로 저장소 생성을 요청하면 400으로 거절해야 한다', async () => {
    const db = requirePrisma(prisma);
    const server = requireApp(app).getHttpServer();

    const response = await request(server)
      .post('/api/repositories')
      .send({ name: '   ' })
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

    await expect(db.repository.count()).resolves.toBe(0);
  });

  it.each([
    { label: 'name 누락', requestBody: {} },
    { label: 'name 숫자 타입', requestBody: { name: 123 } },
  ])(
    '$label 요청은 DTO 검증에서 400으로 거절해야 한다',
    async ({ requestBody }) => {
      const db = requirePrisma(prisma);
      const server = requireApp(app).getHttpServer();

      const response = await request(server)
        .post('/api/repositories')
        .send(requestBody)
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

      await expect(db.repository.count()).resolves.toBe(0);
    },
  );

  it('DELETE /api/repositories/:repositoryId 요청으로 저장소와 하위 기보를 soft delete 해야 한다', async () => {
    const db = requirePrisma(prisma);
    const server = requireApp(app).getHttpServer();
    const repository = await db.repository.create({
      data: {
        name: '삭제 대상 저장소',
      },
    });
    const game = await db.game.create({
      data: {
        repositoryId: repository.id,
        result: 'WHITE_WIN',
        terminationReason: 'CHECKMATE',
        playedAt: new Date('2026-05-20T00:00:00.000Z'),
        gameMoves: {
          create: [
            {
              halfMoveIndex: 0,
              san: 'e4',
              move: {
                from: 12,
                to: 28,
                kind: 1,
              },
              comment: null,
              annotation: 'GOOD',
            },
          ],
        },
      },
    });

    await request(server)
      .delete(`/api/repositories/${repository.id}`)
      .expect(204);

    const deletedRepository = await db.repository.findUnique({
      where: { id: repository.id },
    });
    const deletedGame = await db.game.findUnique({ where: { id: game.id } });

    expect(deletedRepository?.deletedAt).toBeInstanceOf(Date);
    expect(deletedGame?.deletedAt).toBeInstanceOf(Date);
    await expect(db.gameMove.count()).resolves.toBe(1);
    await expect(
      request(server).get('/api/repositories').expect(200),
    ).resolves.toMatchObject({ body: [] });
  });

  it('이미 삭제된 저장소 삭제 요청은 404로 거절해야 한다', async () => {
    const db = requirePrisma(prisma);
    const server = requireApp(app).getHttpServer();
    const repository = await db.repository.create({
      data: {
        name: '이미 삭제된 저장소',
        deletedAt: new Date('2026-05-25T00:00:00.000Z'),
      },
    });

    await request(server)
      .delete(`/api/repositories/${repository.id}`)
      .expect(404);
  });

  it('존재하지 않는 저장소 삭제 요청은 404로 거절해야 한다', async () => {
    const db = requirePrisma(prisma);
    const server = requireApp(app).getHttpServer();

    const response = await request(server)
      .delete('/api/repositories/11111111-1111-4111-8111-111111111111')
      .expect(404);
    const responseBody = response.body as unknown;

    expect(isApiErrorResponse(responseBody)).toBe(true);
    if (!isApiErrorResponse(responseBody)) {
      throw new Error('API 에러 응답 형식이 올바르지 않습니다.');
    }
    expect(responseBody).toMatchObject({
      statusCode: 404,
      errorCode: API_ERROR_CODE.NOT_FOUND,
      message: '요청한 리소스를 찾을 수 없습니다.',
    });
    await expect(db.repository.count()).resolves.toBe(0);
  });
});
