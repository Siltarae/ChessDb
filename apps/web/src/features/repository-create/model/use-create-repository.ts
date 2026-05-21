import { useState } from 'react';

const REQUIRED_NAME_ERROR = '저장소 이름을 입력하세요.';

export const useCreateRepository = () => {
  const [repositoryName, setRepositoryName] = useState('');
  const trimmedRepositoryName = repositoryName.trim();
  const nameError =
    repositoryName.length > 0 && trimmedRepositoryName.length === 0 ? REQUIRED_NAME_ERROR : null;
  const canSubmit = trimmedRepositoryName.length > 0;

  const resetCreateRepositoryForm = () => {
    setRepositoryName('');
  };

  return {
    repositoryName,
    setRepositoryName,
    nameError,
    canSubmit,
    resetCreateRepositoryForm,
  };
};
