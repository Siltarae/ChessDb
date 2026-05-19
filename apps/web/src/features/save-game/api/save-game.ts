import type { CreateGameRecordRequest } from '@chess-db/shared';

import { requestJson } from '@/shared/api';

export type SaveGameResponse = {
  readonly id: string;
};

type SaveGameResponseCandidate = {
  readonly id?: unknown;
} | null;

export class SaveGameResponseError extends Error {
  constructor() {
    super('Save game response must include string id');
    this.name = 'SaveGameResponseError';
  }
}

export const saveGame = async (request: CreateGameRecordRequest): Promise<SaveGameResponse> => {
  const response = await requestJson<SaveGameResponseCandidate, CreateGameRecordRequest>(
    '/api/games',
    {
      body: request,
      method: 'POST',
    },
  );

  if (!isSaveGameResponse(response)) {
    throw new SaveGameResponseError();
  }

  return response;
};

const isSaveGameResponse = (response: SaveGameResponseCandidate): response is SaveGameResponse => {
  return response !== null && typeof response.id === 'string';
};
