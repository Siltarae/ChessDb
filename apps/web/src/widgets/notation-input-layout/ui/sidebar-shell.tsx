export function SidebarShell() {
  return (
    <aside
      aria-label="기보 입력 사이드 패널"
      className="flex h-full min-h-80 flex-col rounded-md border bg-card text-card-foreground"
    >
      <div className="border-b px-4 py-3">
        <h2 className="text-sm font-semibold">기보 작업</h2>
        <p className="mt-1 text-xs text-muted-foreground">수순, 메모, 작업 도구가 들어갈 영역</p>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        <div className="rounded-md border border-dashed bg-muted/40 px-4 py-8 text-center text-sm text-muted-foreground">
          수순 패널 영역
        </div>
      </div>
    </aside>
  );
}
