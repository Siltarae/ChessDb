import type { RepositorySummary } from '@/entities/repository';

type RepositoryListProps = {
  readonly repositories: readonly RepositorySummary[];
  readonly isLoading: boolean;
  readonly onRepositoryOpen?: (repositoryId: string) => void;
};

export const RepositoryList = ({
  repositories,
  isLoading,
  onRepositoryOpen,
}: RepositoryListProps) => {
  const isEmptyState = !isLoading && repositories.length === 0;

  return (
    <section
      aria-label="저장소 목록"
      className="flex min-h-0 flex-col rounded-md border bg-muted/30"
    >
      <header className="border-b px-5 py-4">
        <h2 className="text-base font-semibold">내 저장소</h2>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto p-5">
        {isLoading ? <RepositoryListSkeleton /> : null}

        {isEmptyState ? (
          <div className="rounded-md border border-dashed bg-background px-5 py-10 text-center">
            <p className="text-sm font-medium">아직 생성된 저장소가 없습니다.</p>
            <p className="mt-2 text-sm text-muted-foreground">
              저장소를 만들면 기보와 분석 기록을 한곳에서 관리할 수 있습니다.
            </p>
          </div>
        ) : null}

        {!isLoading && repositories.length > 0 ? (
          <ul className="space-y-3">
            {repositories.map((repository) => (
              <li key={repository.id}>
                <button
                  type="button"
                  aria-label={`${repository.name} 열기`}
                  className="w-full rounded-md border bg-background px-4 py-3 text-left transition-colors hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  onClick={() => onRepositoryOpen?.(repository.id)}
                >
                  <span className="block text-sm font-semibold">{repository.name}</span>
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
};

const RepositoryListSkeleton = () => {
  return (
    <div aria-label="저장소 목록 로딩 중" className="space-y-3">
      {[0, 1, 2].map((index) => (
        <div key={index} className="h-14 animate-pulse rounded-md border bg-background" />
      ))}
    </div>
  );
};
