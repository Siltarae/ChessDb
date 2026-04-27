import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { BoardShell } from './board-shell';
import { NotationInputLayout } from './notation-input-layout';
import { SidebarShell } from './sidebar-shell';

afterEach(() => {
  cleanup();
});

describe('NotationInputLayout', () => {
  describe('보드와 사이드 패널 슬롯을 렌더링할 때', () => {
    it('boardSlot과 sidebarSlot을 각각의 작업 영역에 렌더링해야 한다', () => {
      render(
        <NotationInputLayout
          boardSlot={<div>테스트 보드 슬롯</div>}
          sidebarSlot={<div>테스트 사이드바 슬롯</div>}
        />,
      );

      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.getByRole('region', { name: '보드 작업 영역' })).toHaveTextContent(
        '테스트 보드 슬롯',
      );
      expect(screen.getByRole('region', { name: '기보 작업 패널 영역' })).toHaveTextContent(
        '테스트 사이드바 슬롯',
      );
    });
  });

  describe('모바일 폭의 기본 배치를 확인할 때', () => {
    it('세로 스택 레이아웃을 렌더링해야 한다', () => {
      render(<NotationInputLayout boardSlot={<BoardShell />} sidebarSlot={<SidebarShell />} />);

      const layoutContainer = screen.getByRole('main').firstElementChild;

      expect(layoutContainer).toHaveClass('flex', 'flex-col', 'gap-6');
      expect(screen.getByRole('region', { name: '보드 작업 영역' })).toBeInTheDocument();
      expect(screen.getByRole('region', { name: '기보 작업 패널 영역' })).toBeInTheDocument();
    });
  });

  describe('데스크탑 폭의 전환 배치를 확인할 때', () => {
    it('2열 레이아웃을 렌더링해야 한다', () => {
      render(<NotationInputLayout boardSlot={<BoardShell />} sidebarSlot={<SidebarShell />} />);

      const layoutContainer = screen.getByRole('main').firstElementChild;

      expect(layoutContainer).toHaveClass('lg:grid', 'lg:grid-cols-[minmax(0,1fr)_360px]');
      expect(screen.getByRole('region', { name: '보드 작업 영역' })).toHaveClass(
        'items-center',
        'justify-center',
      );
      expect(screen.getByRole('region', { name: '기보 작업 패널 영역' })).toHaveClass(
        'min-h-0',
        'lg:max-h-[calc(100vh-3rem)]',
      );
    });
  });

  describe('보드 shell을 렌더링할 때', () => {
    it('정사각형 비율을 유지해야 한다', () => {
      render(<BoardShell />);

      expect(screen.getByRole('region', { name: '기보 입력 보드 영역' })).toHaveClass(
        'aspect-square',
        'w-full',
        'max-w-[720px]',
      );
    });
  });

  describe('사이드 패널 shell을 렌더링할 때', () => {
    it('독립 스크롤 영역을 가져야 한다', () => {
      render(<SidebarShell />);

      const sidebar = screen.getByRole('complementary', { name: '기보 입력 사이드 패널' });
      expect(sidebar).toHaveClass('flex', 'h-full', 'min-h-[320px]', 'flex-col');

      const scrollContainer = sidebar.querySelector('.overflow-y-auto');
      expect(scrollContainer).toBeInTheDocument();
      expect(scrollContainer).toHaveClass('min-h-0', 'flex-1', 'overflow-y-auto');
    });
  });
});
