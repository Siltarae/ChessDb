import { useRepositoryListQuery } from '@/entities/repository';
import { RepositoryList } from '@/widgets/repository-list';

export const RepositoryListPage = () => {
  const { data: repositories = [], isLoading } = useRepositoryListQuery();

  return (
    <main className="min-h-screen bg-background px-6 py-6">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-4xl flex-col gap-5">
        <header>
          <h1 className="text-xl font-semibold">저장소 선택</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            최근 작업한 저장소에서 계속하거나 새 저장소를 만듭니다.
          </p>
        </header>

        <RepositoryList repositories={repositories} isLoading={isLoading} />
      </div>
    </main>
  );
};
