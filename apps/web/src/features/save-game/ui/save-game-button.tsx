import { Save } from 'lucide-react';

import { Button } from '@/shared/ui/button';

export type SaveGameButtonProps = {
  readonly onSave: () => void;
  readonly isSaving: boolean;
  readonly disabled?: boolean;
};

export const SaveGameButton = ({ onSave, isSaving, disabled = false }: SaveGameButtonProps) => {
  const isDisabled = disabled || isSaving;

  return (
    <Button
      type="button"
      size="sm"
      onClick={onSave}
      disabled={isDisabled}
      aria-busy={isSaving}
      className="gap-2"
    >
      <Save aria-hidden="true" className="size-4" />
      {isSaving ? '저장 중' : '기보 저장'}
    </Button>
  );
};
