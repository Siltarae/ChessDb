import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog';
import { Button } from '@/shared/ui/button';
import { useCreateRepository } from '../model/use-create-repository';
import { RepositoryNameField } from './repository-name-field';

export type CreateRepositoryDialogProps = {
  readonly isOpen: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly onCreated: () => void;
};

export const CreateRepositoryDialog = ({
  isOpen,
  onOpenChange,
  onCreated,
}: CreateRepositoryDialogProps) => {
  const {
    repositoryName,
    setRepositoryName,
    nameError,
    canSubmit,
    resetCreateRepositoryForm,
    submitCreateRepository,
    isCreating,
    createError,
  } = useCreateRepository({ onCreated });

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      resetCreateRepositoryForm();
    }

    onOpenChange(open);
  };

  const handleSubmitCreateRepository = async () => {
    const isCreated = await submitCreateRepository();

    if (isCreated) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>새 저장소</DialogTitle>
          <DialogDescription>저장소 이름을 입력합니다.</DialogDescription>
        </DialogHeader>
        <RepositoryNameField
          repositoryName={repositoryName}
          nameError={nameError}
          onRepositoryNameChange={setRepositoryName}
        />
        {createError === null ? null : (
          <p className="text-sm text-destructive" role="alert">
            {createError}
          </p>
        )}
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              취소
            </Button>
          </DialogClose>
          <Button
            type="button"
            disabled={!canSubmit || isCreating}
            onClick={handleSubmitCreateRepository}
          >
            {isCreating ? '생성 중' : '생성'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
