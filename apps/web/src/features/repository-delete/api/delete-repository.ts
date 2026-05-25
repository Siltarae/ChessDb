import { env } from '@/shared/config/env';
import { HttpError } from '@/shared/api';

export type DeleteRepositoryRequest = {
  readonly repositoryId: string;
};

export const deleteRepository = async ({
  repositoryId,
}: DeleteRepositoryRequest): Promise<void> => {
  const response = await fetch(`${env.API_BASE_URL}/api/repositories/${repositoryId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const responseBody = await response.text().catch(() => null);

    throw new HttpError(response, responseBody);
  }
};
