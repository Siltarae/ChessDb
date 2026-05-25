import { useMutation, useQueryClient } from '@tanstack/react-query';

import { repositoryListQueryKey } from '@/entities/repository';
import { deleteRepository } from '../api/delete-repository';

const DELETE_REPOSITORY_ERROR = '저장소 삭제에 실패했습니다.';

export type UseDeleteRepositoryOptions = {
  readonly onDeleted?: () => void;
};

export const useDeleteRepository = ({ onDeleted }: UseDeleteRepositoryOptions = {}) => {
  const queryClient = useQueryClient();
  const deleteRepositoryMutation = useMutation({
    mutationFn: deleteRepository,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: repositoryListQueryKey });
      onDeleted?.();
    },
  });

  const requestDeleteRepository = async (repositoryId: string): Promise<boolean> => {
    try {
      await deleteRepositoryMutation.mutateAsync({ repositoryId });
      return true;
    } catch {
      return false;
    }
  };

  return {
    requestDeleteRepository,
    isDeleting: deleteRepositoryMutation.isPending,
    deleteError: deleteRepositoryMutation.isError ? DELETE_REPOSITORY_ERROR : null,
  };
};
