import {
  MOVE_KIND,
  SQUARE,
  createInitialGameState,
  executeMove,
  type GameState,
  type Move,
} from '@chess-db/shared';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { BoardShell } from './board-shell';
import { useMoveHistoryStore } from '@/entities/move-history';
import { NotationInputLayout } from './notation-input-layout';
import { SidebarShell } from './sidebar-shell';

afterEach(() => {
  cleanup();
  useMoveHistoryStore.getState().clearMoveHistory();
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
        'max-w-180',
      );
    });
  });

  describe('사이드 패널 shell을 렌더링할 때', () => {
    it('독립 스크롤 영역을 가져야 한다', () => {
      render(<SidebarShell />);

      const sidebar = screen.getByRole('complementary', { name: '기보 입력 사이드 패널' });
      expect(sidebar).toHaveClass('flex', 'h-full', 'min-h-80', 'flex-col');

      const scrollContainer = sidebar.querySelector('.overflow-y-auto');
      expect(scrollContainer).toBeInTheDocument();
      expect(scrollContainer).toHaveClass('min-h-0', 'flex-1', 'overflow-y-auto');
    });

    it('왼쪽 방향키로 이전 반수를 선택하고 오른쪽 방향키로 다음 반수를 선택해야 한다', () => {
      appendSampleMoves();
      useMoveHistoryStore.getState().selectHalfMove(2);

      render(<SidebarShell />);

      fireEvent.keyDown(window, { key: 'ArrowLeft' });
      expect(useMoveHistoryStore.getState().selectedHalfMoveIndex).toBe(1);

      fireEvent.keyDown(window, { key: 'ArrowRight' });
      expect(useMoveHistoryStore.getState().selectedHalfMoveIndex).toBe(2);
    });

    it('입력 필드에 포커스가 있으면 좌우 방향키로 수순을 이동하지 않아야 한다', () => {
      appendSampleMoves();
      useMoveHistoryStore.getState().selectHalfMove(2);

      render(
        <>
          <input aria-label="수순 메모" />
          <SidebarShell />
        </>,
      );

      screen.getByRole('textbox', { name: '수순 메모' }).focus();
      fireEvent.keyDown(screen.getByRole('textbox', { name: '수순 메모' }), { key: 'ArrowLeft' });

      expect(useMoveHistoryStore.getState().selectedHalfMoveIndex).toBe(2);
    });
  });
});

const createMove = (
  from: Move['from'],
  to: Move['to'],
  kind: typeof MOVE_KIND.NORMAL | typeof MOVE_KIND.DOUBLE_PAWN_PUSH = MOVE_KIND.NORMAL,
): Move => ({
  from,
  to,
  kind,
});

const appendMove = (beforeState: GameState, move: Move, san: string) => {
  const afterState = executeMove(beforeState, move);

  useMoveHistoryStore.getState().appendMoveHistory({
    beforeState,
    move,
    afterState,
    san,
  });

  return afterState;
};

const appendSampleMoves = () => {
  let state = createInitialGameState();
  state = appendMove(state, createMove(SQUARE.E2, SQUARE.E4, MOVE_KIND.DOUBLE_PAWN_PUSH), 'e4');
  state = appendMove(state, createMove(SQUARE.E7, SQUARE.E5, MOVE_KIND.DOUBLE_PAWN_PUSH), 'e5');
  appendMove(state, createMove(SQUARE.G1, SQUARE.F3), 'Nf3');
};
