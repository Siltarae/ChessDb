import type { MouseEvent } from 'react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/ui/alert-dialog';

export type DeleteRepositoryDialogProps = {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly onConfirmDelete: () => void | Promise<void>;
  readonly isDeleting?: boolean;
};

export const DeleteRepositoryDialog = ({
  open,
  onOpenChange,
  onConfirmDelete,
  isDeleting = false,
}: DeleteRepositoryDialogProps) => {
  const handleConfirmDelete = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    void onConfirmDelete();
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>저장소 삭제</AlertDialogTitle>
          <AlertDialogDescription>
            정말로 삭제하시겠습니까? 목록에서 제거되며 포함된 기보도 더 이상 표시되지 않습니다.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>취소</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirmDelete} disabled={isDeleting}>
            {isDeleting ? '삭제 중' : '삭제'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
