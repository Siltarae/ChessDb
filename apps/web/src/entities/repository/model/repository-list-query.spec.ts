import { afterEach, describe, expect, it, vi } from 'vitest';

import { HttpError } from '@/shared/api';
import { fetchRepositories, RepositoryListResponseError } from './repository-list-query';

describe('fetchRepositories', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('GET /api/repositories로 저장소 목록을 조회해야 한다', async () => {
    const fetchMock = vi.fn<typeof fetch>();
    fetchMock.mockResolvedValueOnce(
      new Response(
        JSON.stringify([
          {
            id: 'repository-1',
            name: '오프닝 저장소',
            createdAt: '2026-05-20T00:00:00.000Z',
          },
        ]),
      ),
    );
    vi.stubGlobal('fetch', fetchMock);

    await expect(fetchRepositories()).resolves.toEqual([
      {
        id: 'repository-1',
        name: '오프닝 저장소',
        createdAt: '2026-05-20T00:00:00.000Z',
      },
    ]);

    expect(fetchMock).toHaveBeenCalledWith('/api/repositories', {
      method: 'GET',
      headers: expect.any(Headers),
    });
  });

  it('2xx 응답이 아니면 실패해야 한다', async () => {
    const fetchMock = vi.fn<typeof fetch>();
    fetchMock.mockResolvedValueOnce(new Response('조회 실패', { status: 500 }));
    vi.stubGlobal('fetch', fetchMock);

    await expect(fetchRepositories()).rejects.toBeInstanceOf(HttpError);
  });

  it('목록 응답 형식이 아니면 실패해야 한다', async () => {
    const fetchMock = vi.fn<typeof fetch>();
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify({ id: 'repository-1' })));
    vi.stubGlobal('fetch', fetchMock);

    await expect(fetchRepositories()).rejects.toBeInstanceOf(RepositoryListResponseError);
  });

  it('목록 항목에 필수 필드가 없으면 실패해야 한다', async () => {
    const fetchMock = vi.fn<typeof fetch>();
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify([{ id: 'repository-1' }])));
    vi.stubGlobal('fetch', fetchMock);

    await expect(fetchRepositories()).rejects.toBeInstanceOf(RepositoryListResponseError);
  });
});
