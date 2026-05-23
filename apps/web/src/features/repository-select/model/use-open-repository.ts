import { useNavigate } from 'react-router';

export const useOpenRepository = () => {
  const navigate = useNavigate();

  return (repositoryId: string) => {
    navigate(`/repositories/${repositoryId}`);
  };
};
