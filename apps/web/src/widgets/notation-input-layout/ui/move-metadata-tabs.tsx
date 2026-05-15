import { GameMetadataEditor } from '@/features/game-metadata-edit';
import { MoveAnnotationPicker } from '@/features/move-annotation-edit';
import { MoveCommentEditor } from '@/features/move-comment-edit';
import { useState } from 'react';

const metadataTabs = ['SAN', '코멘트', '평가', '기보 정보'] as const;
type MetadataTab = (typeof metadataTabs)[number];

export const MoveMetadataTabs = () => {
  const [activeMetadataTab, setActiveMetadataTab] = useState<MetadataTab>('코멘트');

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
              onClick={() => setActiveMetadataTab(tab)}
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

      <div role="tabpanel" aria-label={activeMetadataTab} className="px-4 py-4">
        {activeMetadataTab === '코멘트' ? <MoveCommentEditor /> : null}
        {activeMetadataTab === '평가' ? <MoveAnnotationPicker /> : null}
        {activeMetadataTab === '기보 정보' ? <GameMetadataEditor /> : null}
      </div>
    </section>
  );
};
