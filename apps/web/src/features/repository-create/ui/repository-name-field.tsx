export type RepositoryNameFieldProps = {
  readonly repositoryName: string;
  readonly nameError: string | null;
  readonly onRepositoryNameChange: (nextRepositoryName: string) => void;
};

export const RepositoryNameField = ({
  repositoryName,
  nameError,
  onRepositoryNameChange,
}: RepositoryNameFieldProps) => {
  const inputId = 'repository-name';

  return (
    <div className="space-y-2">
      <label htmlFor={inputId} className="text-sm font-semibold">
        저장소 이름
      </label>
      <input
        id={inputId}
        type="text"
        value={repositoryName}
        aria-invalid={nameError === null ? 'false' : 'true'}
        className="h-9 w-full rounded-md border bg-background px-3 text-sm text-foreground outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20"
        onChange={(event) => onRepositoryNameChange(event.target.value)}
      />
      {nameError === null ? null : (
        <p className="text-sm text-destructive" role="alert">
          {nameError}
        </p>
      )}
    </div>
  );
};
