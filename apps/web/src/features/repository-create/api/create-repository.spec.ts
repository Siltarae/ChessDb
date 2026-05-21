import { afterEach, describe, expect, it, vi } from 'vitest';

import { HttpError } from '@/shared/api';
import { createRepository, CreateRepositoryResponseError } from './create-repository';

describe('createRepository', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('POST /api/repositories에 저장소 생성 요청 body를 보내야 한다', async () => {
    const fetchMock = vi.fn<typeof fetch>();
    fetchMock.mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          id: 'repository-1',
          name: '오프닝 저장소',
          createdAt: '2026-05-21T00:00:00.000Z',
        }),
        { status: 201 },
      ),
    );
    vi.stubGlobal('fetch', fetchMock);

    await expect(createRepository({ name: '오프닝 저장소' })).resolves.toEqual({
      id: 'repository-1',
      name: '오프닝 저장소',
      createdAt: '2026-05-21T00:00:00.000Z',
    });

    const [, init] = fetchMock.mock.calls[0] ?? [];
    const headers = new Headers(init?.headers);

    expect(fetchMock).toHaveBeenCalledWith('/api/repositories', expect.any(Object));
    expect(init?.method).toBe('POST');
    expect(init?.body).toBe(JSON.stringify({ name: '오프닝 저장소' }));
    expect(headers.get('Content-Type')).toBe('application/json');
  });

  it('2xx 응답이 아니면 실패해야 한다', async () => {
    const fetchMock = vi.fn<typeof fetch>();
    fetchMock.mockResolvedValueOnce(new Response('생성 실패', { status: 400 }));
    vi.stubGlobal('fetch', fetchMock);

    await expect(createRepository({ name: '오프닝 저장소' })).rejects.toBeInstanceOf(HttpError);
  });

  it('응답에 필수 필드가 없으면 실패해야 한다', async () => {
    const fetchMock = vi.fn<typeof fetch>();
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify({ id: 'repository-1' }), { status: 201 }),
    );
    vi.stubGlobal('fetch', fetchMock);

    await expect(createRepository({ name: '오프닝 저장소' })).rejects.toBeInstanceOf(
      CreateRepositoryResponseError,
    );
  });

  it('응답 필드 타입이 다르면 실패해야 한다', async () => {
    const fetchMock = vi.fn<typeof fetch>();
    fetchMock.mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          id: 'repository-1',
          name: 123,
          createdAt: '2026-05-21T00:00:00.000Z',
        }),
        { status: 201 },
      ),
    );
    vi.stubGlobal('fetch', fetchMock);

    await expect(createRepository({ name: '오프닝 저장소' })).rejects.toBeInstanceOf(
      CreateRepositoryResponseError,
    );
  });
});
