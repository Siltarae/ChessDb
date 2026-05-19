import {
  GAME_RECORD_RESULT,
  GAME_TERMINATION_REASON,
  MOVE_KIND,
  SQUARE,
  type CreateGameRecordRequest,
} from '@chess-db/shared';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { HttpError } from '@/shared/api';
import { saveGame, SaveGameResponseError } from './save-game';

const CREATE_GAME_RECORD_REQUEST_FIXTURE: CreateGameRecordRequest = {
  result: GAME_RECORD_RESULT.WHITE_WIN,
  terminationReason: GAME_TERMINATION_REASON.CHECKMATE,
  playedAt: '2026-05-16',
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
      annotation: null,
    },
  ],
};

describe('saveGame', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('POST /api/games에 저장 요청 body를 보내야 한다', async () => {
    const fetchMock = vi.fn<typeof fetch>();
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify({ id: 'game-1' }), { status: 201 }),
    );
    vi.stubGlobal('fetch', fetchMock);

    await expect(saveGame(CREATE_GAME_RECORD_REQUEST_FIXTURE)).resolves.toEqual({
      id: 'game-1',
    });

    const [, init] = fetchMock.mock.calls[0] ?? [];
    const headers = new Headers(init?.headers);

    expect(fetchMock).toHaveBeenCalledWith('/api/games', expect.any(Object));
    expect(init?.method).toBe('POST');
    expect(init?.body).toBe(JSON.stringify(CREATE_GAME_RECORD_REQUEST_FIXTURE));
    expect(headers.get('Content-Type')).toBe('application/json');
  });

  it('2xx 응답이 아니면 실패해야 한다', async () => {
    const fetchMock = vi.fn<typeof fetch>();
    fetchMock.mockResolvedValueOnce(new Response('저장 실패', { status: 500 }));
    vi.stubGlobal('fetch', fetchMock);

    await expect(saveGame(CREATE_GAME_RECORD_REQUEST_FIXTURE)).rejects.toBeInstanceOf(HttpError);
  });

  it('응답에 id가 없으면 실패해야 한다', async () => {
    const fetchMock = vi.fn<typeof fetch>();
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify({}), { status: 201 }));
    vi.stubGlobal('fetch', fetchMock);

    await expect(saveGame(CREATE_GAME_RECORD_REQUEST_FIXTURE)).rejects.toBeInstanceOf(
      SaveGameResponseError,
    );
  });

  it('응답 id가 문자열이 아니면 실패해야 한다', async () => {
    const fetchMock = vi.fn<typeof fetch>();
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify({ id: 123 }), { status: 201 }));
    vi.stubGlobal('fetch', fetchMock);

    await expect(saveGame(CREATE_GAME_RECORD_REQUEST_FIXTURE)).rejects.toBeInstanceOf(
      SaveGameResponseError,
    );
  });
});
