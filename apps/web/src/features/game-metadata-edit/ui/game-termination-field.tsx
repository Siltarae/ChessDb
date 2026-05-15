import { useGameMetadataEdit } from '../model/use-game-metadata-edit';

export const GameTerminationField = () => {
  const { selectedTerminationReason, terminationReasonOptions, updateTerminationReason } =
    useGameMetadataEdit();
  const isDisabled = terminationReasonOptions.length === 0;

  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-semibold">종료 사유</legend>
      {isDisabled ? (
        <p className="rounded-md border border-dashed bg-background px-3 py-4 text-sm text-muted-foreground">
          결과를 먼저 선택하세요.
        </p>
      ) : null}
      <div role="group" aria-label="종료 사유 선택" className="grid grid-cols-2 gap-2">
        {terminationReasonOptions.map((option) => (
          <button
            key={option.terminationReason}
            type="button"
            aria-pressed={selectedTerminationReason === option.terminationReason}
            className={[
              'h-9 rounded-md border px-2 text-sm font-semibold',
              selectedTerminationReason === option.terminationReason
                ? 'border-emerald-700 bg-emerald-700 text-white'
                : 'bg-background text-foreground hover:bg-muted',
            ].join(' ')}
            onClick={() => updateTerminationReason(option.terminationReason)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
};
