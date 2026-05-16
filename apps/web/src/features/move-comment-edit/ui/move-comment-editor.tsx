import { useMoveCommentEdit } from '../model/use-move-comment-edit';

export const MoveCommentEditor = () => {
  const { currentComment, isDisabled, updateComment } = useMoveCommentEdit();

  return (
    <div className="space-y-3">
      <label htmlFor="move-comment" className="text-sm font-semibold">
        선택 수 코멘트
      </label>
      <textarea
        id="move-comment"
        value={currentComment}
        disabled={isDisabled}
        placeholder={isDisabled ? '코멘트를 입력할 수를 먼저 선택하세요.' : '선택한 수의 코멘트'}
        className="min-h-24 w-full resize-none rounded-md border bg-background px-3 py-2 text-sm outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground"
        onChange={(event) => updateComment(event.target.value)}
      />
      <p className="text-xs text-muted-foreground">
        코멘트는 선택 수에 연결되고 초안에 즉시 반영됩니다.
      </p>
    </div>
  );
};
