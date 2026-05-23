import { useParams } from 'react-router';

export const RepositoryHomePage = () => {
  const { repositoryId } = useParams();

  return (
    <main className="min-h-screen bg-background px-6 py-6">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-4xl flex-col gap-5">
        <header>
          <h1 className="text-xl font-semibold">저장소 내부</h1>
          <p className="mt-2 text-sm text-muted-foreground">{repositoryId}</p>
        </header>
      </div>
    </main>
  );
};
