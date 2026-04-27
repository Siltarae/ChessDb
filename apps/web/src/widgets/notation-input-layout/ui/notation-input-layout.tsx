import type { ReactNode } from 'react';

type NotationInputLayoutProps = {
  boardSlot: ReactNode;
  sidebarSlot: ReactNode;
};

export const NotationInputLayout = ({ boardSlot, sidebarSlot }: NotationInputLayoutProps) => {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 px-4 py-4 lg:grid lg:grid-cols-[minmax(0,1fr)_360px] lg:px-6 lg:py-6">
        <section aria-label="보드 작업 영역" className="flex min-w-0 items-center justify-center">
          {boardSlot}
        </section>

        <section
          aria-label="기보 작업 패널 영역"
          className="min-h-0 min-w-0 lg:max-h-[calc(100vh-3rem)]"
        >
          {sidebarSlot}
        </section>
      </div>
    </main>
  );
};
