import { useGameMetadataEdit } from '../model/use-game-metadata-edit';

export const GameResultField = () => {
  const { selectedResult, resultOptions, updateResult } = useGameMetadataEdit();

  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-semibold">결과</legend>
      <div role="group" aria-label="기보 결과 선택" className="grid grid-cols-3 gap-2">
        {resultOptions.map((option) => (
          <button
            key={option.result}
            type="button"
            aria-pressed={selectedResult === option.result}
            className={[
              'h-9 rounded-md border px-2 text-sm font-semibold',
              selectedResult === option.result
                ? 'border-emerald-700 bg-emerald-700 text-white'
                : 'bg-background text-foreground hover:bg-muted',
            ].join(' ')}
            onClick={() => updateResult(option.result)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
};
