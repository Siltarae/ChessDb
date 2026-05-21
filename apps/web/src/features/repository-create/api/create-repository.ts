import { requestJson } from '@/shared/api';

export type CreateRepositoryRequest = {
  readonly name: string;
};

export type CreateRepositoryResponse = {
  readonly id: string;
  readonly name: string;
  readonly createdAt: string;
};

type CreateRepositoryResponseCandidate = {
  readonly id?: unknown;
  readonly name?: unknown;
  readonly createdAt?: unknown;
} | null;

export class CreateRepositoryResponseError extends Error {
  constructor() {
    super('Create repository response must include id, name, createdAt');
    this.name = 'CreateRepositoryResponseError';
  }
}

export const createRepository = async (
  request: CreateRepositoryRequest,
): Promise<CreateRepositoryResponse> => {
  const response = await requestJson<CreateRepositoryResponseCandidate, CreateRepositoryRequest>(
    '/api/repositories',
    {
      body: request,
      method: 'POST',
    },
  );

  if (!isCreateRepositoryResponse(response)) {
    throw new CreateRepositoryResponseError();
  }

  return response;
};

const isCreateRepositoryResponse = (
  response: CreateRepositoryResponseCandidate,
): response is CreateRepositoryResponse => {
  return (
    response !== null &&
    typeof response.id === 'string' &&
    typeof response.name === 'string' &&
    typeof response.createdAt === 'string'
  );
};
