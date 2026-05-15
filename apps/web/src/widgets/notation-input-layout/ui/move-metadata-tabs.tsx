import { MoveCommentEditor } from '@/features/move-comment-edit';

const metadataTabs = ['SAN', '코멘트', '평가', '기보 정보'] as const;
const activeMetadataTab = '코멘트';

export const MoveMetadataTabs = () => {
  return (
    <section aria-label="수순 메타데이터" className="rounded-md border bg-muted/30">
      <div
        role="tablist"
        aria-label="메타데이터 탭"
        className="flex gap-1 border-b px-3 py-3"
      >
        {metadataTabs.map((tab) => {
          const isActive = tab === activeMetadataTab;

          return (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={[
                'h-8 rounded-md border px-3 text-xs font-semibold',
                isActive
                  ? 'border-emerald-700 bg-emerald-700 text-white'
                  : 'border-border bg-background text-muted-foreground',
              ].join(' ')}
            >
              {tab}
            </button>
          );
        })}
      </div>

      <div role="tabpanel" aria-label="코멘트" className="px-4 py-4">
        <MoveCommentEditor />
      </div>
    </section>
  );
};
