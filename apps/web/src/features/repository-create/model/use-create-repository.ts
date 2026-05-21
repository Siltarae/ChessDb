import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';

import { createRepository } from '../api/create-repository';

const REQUIRED_NAME_ERROR = '저장소 이름을 입력하세요.';
const CREATE_REPOSITORY_ERROR = '저장소 생성에 실패했습니다.';

type UseCreateRepositoryOptions = {
  readonly onCreated?: () => void;
};

export const useCreateRepository = ({ onCreated }: UseCreateRepositoryOptions = {}) => {
  const [repositoryName, setRepositoryName] = useState('');
  const trimmedRepositoryName = repositoryName.trim();
  const nameError =
    repositoryName.length > 0 && trimmedRepositoryName.length === 0 ? REQUIRED_NAME_ERROR : null;
  const canSubmit = trimmedRepositoryName.length > 0;
  const createRepositoryMutation = useMutation({
    mutationFn: createRepository,
    onSuccess: () => {
      onCreated?.();
      resetCreateRepositoryForm();
    },
  });

  const resetCreateRepositoryForm = () => {
    setRepositoryName('');
    createRepositoryMutation.reset();
  };

  const updateRepositoryName = (nextRepositoryName: string) => {
    setRepositoryName(nextRepositoryName);
    createRepositoryMutation.reset();
  };

  const submitCreateRepository = async (): Promise<boolean> => {
    if (!canSubmit) {
      return false;
    }

    try {
      await createRepositoryMutation.mutateAsync({ name: trimmedRepositoryName });
      return true;
    } catch {
      return false;
    }
  };

  return {
    repositoryName,
    setRepositoryName: updateRepositoryName,
    nameError,
    canSubmit,
    resetCreateRepositoryForm,
    submitCreateRepository,
    isCreating: createRepositoryMutation.isPending,
    createError: createRepositoryMutation.isError ? CREATE_REPOSITORY_ERROR : null,
  };
};
