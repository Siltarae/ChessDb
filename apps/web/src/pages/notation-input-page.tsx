import { useDraftAutosave } from '@/features/draft-autosave';
import { ResetDraftDialog, useResetDraft } from '@/features/draft-management';
import { useEngineDerivedMetadataAutofill } from '@/features/game-metadata-edit';
import { SaveGameButton, useSaveGame } from '@/features/save-game';
import { Button } from '@/shared/ui/button';
import type { BoardOrientation } from '@/widgets/chess-board';
import { BoardShell, NotationInputLayout, SidebarShell } from '@/widgets/notation-input-layout';
import { RotateCcw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';

export const NotationInputPage = () => {
  const { repositoryId } = useParams();
  useEngineDerivedMetadataAutofill();
  const { lastSavedAt, isSaveFailureNoticeVisible, isSaveNoticeVisible } = useDraftAutosave();
  const { isResetDialogOpen, requestDraftReset, cancelDraftReset, confirmDraftReset } =
    useResetDraft();
  const { requestSaveGame, isSaving, canSaveGame, saveStatus } = useSaveGame({
    repositoryId: repositoryId ?? null,
  });

  const [boardOrientation, setBoardOrientation] = useState<BoardOrientation>('white');

  const toggleBoardOrientation = () => {
    setBoardOrientation((currentOrientation) =>
      currentOrientation === 'white' ? 'black' : 'white',
    );
  };

  return (
    <>
      <DraftSavedToast
        key={lastSavedAt ?? 'draft-save'}
        isVisible={isSaveNoticeVisible}
        saveEventId={lastSavedAt}
      />
      <DraftSaveFailedToast isVisible={isSaveFailureNoticeVisible} />
      {saveStatus !== 'idle' ? <SaveGameStatusToast saveStatus={saveStatus} /> : null}
      <ResetDraftDialog
        open={isResetDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            cancelDraftReset();
          }
        }}
        onConfirm={confirmDraftReset}
      />
      <NotationInputLayout
        boardSlot={<BoardShell orientation={boardOrientation} />}
        sidebarSlot={
          <SidebarShell
            boardOrientation={boardOrientation}
            onToggleBoardOrientation={toggleBoardOrientation}
            toolbarSlot={
              <div className="flex items-center gap-2">
                <SaveGameButton
                  onSave={requestSaveGame}
                  isSaving={isSaving}
                  disabled={!canSaveGame}
                />
                <Button type="button" variant="outline" size="sm" onClick={requestDraftReset}>
                  <RotateCcw aria-hidden="true" />
                  초기화
                </Button>
              </div>
            }
          />
        }
      />
    </>
  );
};

const SaveGameStatusToast = ({ saveStatus }: { readonly saveStatus: 'success' | 'error' }) => {
  const [dismissedStatus, setDismissedStatus] = useState<typeof saveStatus | null>(null);
  const isVisible = dismissedStatus !== saveStatus;

  useEffect(() => {
    const saveStatusTimeoutId = setTimeout(() => {
      setDismissedStatus(saveStatus);
    }, 3000);

    return () => {
      clearTimeout(saveStatusTimeoutId);
    };
  }, [saveStatus]);

  if (!isVisible) {
    return null;
  }

  const isSuccess = saveStatus === 'success';

  return (
    <div
      role="status"
      aria-live="polite"
      className={
        isSuccess
          ? 'fixed right-4 top-16 z-50 rounded-md border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 shadow-sm'
          : 'fixed right-4 top-16 z-50 rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 shadow-sm'
      }
    >
      {isSuccess ? '기보가 저장되었습니다.' : '기보 저장에 실패했습니다.'}
    </div>
  );
};

const DraftSavedToast = ({
  isVisible,
  saveEventId,
}: {
  readonly isVisible: boolean;
  readonly saveEventId: string | null;
}) => {
  if (!isVisible) {
    return null;
  }

  return (
    <div
      role="status"
      aria-live="polite"
      data-save-event-id={saveEventId ?? undefined}
      className="fixed right-4 top-4 z-50 animate-[draft-save-toast-highlight_420ms_ease-out] rounded-md border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 shadow-sm"
    >
      초안 저장됨
    </div>
  );
};

const DraftSaveFailedToast = ({ isVisible }: { readonly isVisible: boolean }) => {
  if (!isVisible) {
    return null;
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed right-4 top-4 z-50 rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 shadow-sm"
    >
      초안 저장 실패
    </div>
  );
};
