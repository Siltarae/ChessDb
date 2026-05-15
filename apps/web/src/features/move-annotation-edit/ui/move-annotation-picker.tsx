import { moveAnnotationOptions } from '../model/move-annotation-options';
import { useMoveAnnotationEdit } from '../model/use-move-annotation-edit';

export const MoveAnnotationPicker = () => {
  const { selectedAnnotation, isDisabled, updateAnnotation, clearAnnotation } =
    useMoveAnnotationEdit();

  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-sm font-semibold">평가 기호</h3>
        <p className="mt-1 text-xs text-muted-foreground">선택 즉시 초안에 반영됩니다.</p>
      </div>

      <div role="group" aria-label="평가 기호 선택" className="grid grid-cols-4 gap-2">
        {moveAnnotationOptions.map((option) => (
          <button
            key={option.annotation}
            type="button"
            aria-label={option.ariaLabel}
            aria-pressed={selectedAnnotation === option.annotation}
            disabled={isDisabled}
            className={[
              'h-9 rounded-md border px-3 text-sm font-semibold',
              selectedAnnotation === option.annotation
                ? 'border-emerald-500 bg-emerald-50 text-foreground'
                : 'bg-background text-foreground hover:bg-muted',
              'disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground disabled:hover:bg-muted',
            ].join(' ')}
            onClick={() => updateAnnotation(option.annotation)}
          >
            {option.label}
          </button>
        ))}
        <button
          type="button"
          disabled={isDisabled}
          className="h-9 rounded-md border bg-background px-3 text-sm font-semibold text-muted-foreground hover:bg-muted disabled:cursor-not-allowed disabled:bg-muted disabled:hover:bg-muted"
          onClick={() => clearAnnotation()}
        >
          제거
        </button>
      </div>

      <p className="text-xs text-muted-foreground">평가 기호는 선택 수에 연결됩니다.</p>
    </div>
  );
};
