import { useQuery } from '@tanstack/react-query';

import { requestJson } from '@/shared/api';

export type RepositorySummary = {
  readonly id: string;
  readonly name: string;
  readonly createdAt: string;
};

type RepositorySummaryCandidate = {
  readonly id?: unknown;
  readonly name?: unknown;
  readonly createdAt?: unknown;
} | null;

type RepositoryListCandidate = readonly RepositorySummaryCandidate[] | null;

export class RepositoryListResponseError extends Error {
  constructor() {
    super('Repository list response must include id, name, createdAt');
    this.name = 'RepositoryListResponseError';
  }
}

export const repositoryListQueryKey = ['repositories'] as const;

export const fetchRepositories = async (): Promise<RepositorySummary[]> => {
  const response = await requestJson<RepositoryListCandidate>('/api/repositories');

  if (!isRepositoryListResponse(response)) {
    throw new RepositoryListResponseError();
  }

  return response;
};

export const useRepositoryListQuery = () => {
  return useQuery({
    queryKey: repositoryListQueryKey,
    queryFn: fetchRepositories,
  });
};

const isRepositoryListResponse = (
  response: RepositoryListCandidate,
): response is RepositorySummary[] => {
  return Array.isArray(response) && response.every(isRepositorySummary);
};

const isRepositorySummary = (
  repository: RepositorySummaryCandidate,
): repository is RepositorySummary => {
  return (
    repository !== null &&
    typeof repository.id === 'string' &&
    typeof repository.name === 'string' &&
    typeof repository.createdAt === 'string'
  );
};
