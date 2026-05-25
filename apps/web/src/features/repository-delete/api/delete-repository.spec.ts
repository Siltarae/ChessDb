import { afterEach, describe, expect, it, vi } from 'vitest';

import { HttpError } from '@/shared/api';
import { deleteRepository } from './delete-repository';

describe('deleteRepository', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('DELETE /api/repositories/:repositoryId 요청을 보내야 한다', async () => {
    const fetchMock = vi.fn<typeof fetch>();
    fetchMock.mockResolvedValueOnce(new Response(null, { status: 204 }));
    vi.stubGlobal('fetch', fetchMock);

    await expect(deleteRepository({ repositoryId: 'repository-1' })).resolves.toBeUndefined();

    expect(fetchMock).toHaveBeenCalledWith('/api/repositories/repository-1', {
      method: 'DELETE',
    });
  });

  it('2xx 응답이 아니면 실패해야 한다', async () => {
    const fetchMock = vi.fn<typeof fetch>();
    fetchMock.mockResolvedValueOnce(new Response('삭제 실패', { status: 500 }));
    vi.stubGlobal('fetch', fetchMock);

    await expect(deleteRepository({ repositoryId: 'repository-1' })).rejects.toBeInstanceOf(
      HttpError,
    );
  });
});
