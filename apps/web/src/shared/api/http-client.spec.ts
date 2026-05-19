import { describe, expect, it, vi } from 'vitest';

import { HttpJsonParseError, requestJson } from './http-client';
import type { HttpError } from './http-client';

const createFetchMock = () =>
  vi.fn<(input: RequestInfo | URL, init?: RequestInit) => Promise<Response>>();

describe('requestJson', () => {
  it('JSON 응답을 파싱해 반환해야 한다', async () => {
    const fetcher = createFetchMock();
    fetcher.mockResolvedValueOnce(
      new Response(JSON.stringify({ id: 'game-1' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      }),
    );

    await expect(requestJson<{ id: string }>('/api/games/game-1', { fetcher })).resolves.toEqual({
      id: 'game-1',
    });

    expect(fetcher).toHaveBeenCalledWith('/api/games/game-1', {
      headers: expect.any(Headers),
      method: 'GET',
    });
  });

  it('JSON body와 요청 method/header를 고정해야 한다', async () => {
    const fetcher = createFetchMock();
    const requestBody = { title: '테스트 기보' };
    fetcher.mockResolvedValueOnce(new Response(JSON.stringify({ id: 'game-1' }), { status: 201 }));

    await requestJson<{ id: string }, typeof requestBody>('/api/games', {
      body: requestBody,
      fetcher,
      method: 'POST',
    });

    const [, init] = fetcher.mock.calls[0] ?? [];
    const headers = new Headers(init?.headers);

    expect(init?.method).toBe('POST');
    expect(init?.body).toBe(JSON.stringify(requestBody));
    expect(headers.get('Content-Type')).toBe('application/json');
  });

  it('2xx 응답이 아니면 HttpError를 던져야 한다', async () => {
    const fetcher = createFetchMock();
    fetcher.mockResolvedValueOnce(new Response('저장 실패', { status: 500, statusText: 'Error' }));

    await expect(requestJson('/api/games', { fetcher })).rejects.toMatchObject({
      name: 'HttpError',
      responseBody: '저장 실패',
      status: 500,
      statusText: 'Error',
    } satisfies Partial<HttpError>);
  });

  it('2xx 응답 body가 JSON이 아니면 HttpJsonParseError를 던져야 한다', async () => {
    const fetcher = createFetchMock();
    fetcher.mockResolvedValueOnce(new Response('{broken-json', { status: 200 }));

    await expect(requestJson('/api/games', { fetcher })).rejects.toBeInstanceOf(HttpJsonParseError);
  });
});
