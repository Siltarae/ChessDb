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

export const CreateRepositoryDialog = ({ isOpen, onOpenChange }: CreateRepositoryDialogProps) => {
  const { repositoryName, setRepositoryName, nameError, canSubmit, resetCreateRepositoryForm } =
    useCreateRepository();

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      resetCreateRepositoryForm();
    }

    onOpenChange(open);
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
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              취소
            </Button>
          </DialogClose>
          <Button type="button" disabled={!canSubmit}>
            생성
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
