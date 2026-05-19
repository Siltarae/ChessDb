import { parseEnv } from './env.config';

describe('환경 변수 검증', () => {
  const validDatabaseUrl =
    'postgresql://user:password@localhost:5432/chess_db?schema=public';

  it('DATABASE_URL이 없으면 실패해야 한다', () => {
    expect(() => parseEnv({})).toThrow();
  });

  it('DATABASE_URL이 URL 형식이 아니면 실패해야 한다', () => {
    expect(() => parseEnv({ DATABASE_URL: 'not-a-url' })).toThrow();
  });

  it('유효한 DATABASE_URL만 있으면 기본값을 적용해야 한다', () => {
    expect(parseEnv({ DATABASE_URL: validDatabaseUrl })).toEqual({
      ALLOWED_ORIGINS: '',
      DATABASE_URL: validDatabaseUrl,
      NODE_ENV: 'development',
      PORT: 3000,
    });
  });

  it('PORT 문자열을 숫자로 변환해야 한다', () => {
    expect(
      parseEnv({
        DATABASE_URL: validDatabaseUrl,
        PORT: '4000',
      }),
    ).toMatchObject({
      PORT: 4000,
    });
  });

  it('유효한 NODE_ENV 값을 그대로 사용해야 한다', () => {
    expect(
      parseEnv({
        DATABASE_URL: validDatabaseUrl,
        NODE_ENV: 'test',
      }),
    ).toMatchObject({
      NODE_ENV: 'test',
    });
  });

  it('ALLOWED_ORIGINS 값을 그대로 사용해야 한다', () => {
    expect(
      parseEnv({
        ALLOWED_ORIGINS: 'http://localhost:5173,http://127.0.0.1:5173',
        DATABASE_URL: validDatabaseUrl,
      }),
    ).toMatchObject({
      ALLOWED_ORIGINS: 'http://localhost:5173,http://127.0.0.1:5173',
    });
  });
});
