import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from 'generated/prisma';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';

type RepositoryListItemResponse = {
  readonly id: string;
  readonly name: string;
  readonly createdAt: string;
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

    await db.repository.deleteMany();
  });

  afterAll(async () => {
    if (prisma) {
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
});
