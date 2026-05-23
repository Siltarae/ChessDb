import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { repositoryListQueryKey, useRepositoryListQuery } from '@/entities/repository';
import { CreateRepositoryDialog } from '@/features/repository-create';
import { useOpenRepository } from '@/features/repository-select';
import { Button } from '@/shared/ui/button';
import { RepositoryList } from '@/widgets/repository-list';

export const RepositoryListPage = () => {
  const queryClient = useQueryClient();
  const openRepository = useOpenRepository();
  const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);
  const { data: repositories = [], isLoading } = useRepositoryListQuery();

  const handleRepositoryCreated = () => {
    void queryClient.invalidateQueries({ queryKey: repositoryListQueryKey });
  };

  return (
    <main className="min-h-screen bg-background px-6 py-6">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-4xl flex-col gap-5">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold">저장소 선택</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              최근 작업한 저장소에서 계속하거나 새 저장소를 만듭니다.
            </p>
          </div>
          <Button type="button" onClick={() => setCreateDialogOpen(true)}>
            새 저장소
          </Button>
        </header>

        <RepositoryList
          repositories={repositories}
          isLoading={isLoading}
          onRepositoryOpen={openRepository}
        />
        <CreateRepositoryDialog
          isOpen={isCreateDialogOpen}
          onOpenChange={setCreateDialogOpen}
          onCreated={handleRepositoryCreated}
        />
      </div>
    </main>
  );
};
