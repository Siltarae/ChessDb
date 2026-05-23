import { Plus } from 'lucide-react';

import { Button } from '@/shared/ui/button';

export type StartNotationInputButtonProps = {
  readonly onStart: () => void;
  readonly disabled?: boolean;
};

export const StartNotationInputButton = ({
  onStart,
  disabled = false,
}: StartNotationInputButtonProps) => {
  return (
    <Button type="button" size="sm" onClick={onStart} disabled={disabled}>
      <Plus aria-hidden="true" />새 기보 작성
    </Button>
  );
};
