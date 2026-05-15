import { useGameMetadataEdit } from '../model/use-game-metadata-edit';

export const PlayedAtField = () => {
  const { playedAtValue, updatePlayedAt } = useGameMetadataEdit();

  return (
    <label className="block space-y-2">
      <span className="text-sm font-semibold">대국 날짜</span>
      <input
        type="date"
        value={playedAtValue}
        className="h-9 w-full rounded-md border bg-background px-3 text-sm text-foreground"
        onChange={(event) => updatePlayedAt(event.target.value)}
      />
    </label>
  );
};
