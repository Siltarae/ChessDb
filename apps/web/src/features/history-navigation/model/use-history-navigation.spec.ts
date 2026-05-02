import {
  MOVE_KIND,
  SQUARE,
  createInitialGameState,
  executeMove,
  type GameState,
  type Move,
} from '@chess-db/shared';
import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import type { MoveHistoryItem } from '@/entities/move-history';
import { useHistoryNavigation } from './use-history-navigation';

const createMove = (
  from: Move['from'],
  to: Move['to'],
  kind: typeof MOVE_KIND.NORMAL | typeof MOVE_KIND.DOUBLE_PAWN_PUSH = MOVE_KIND.NORMAL,
): Move => ({
  from,
  to,
  kind,
});

const createHistoryItem = ({
  beforeState,
  move,
  san,
  halfMoveIndex,
}: {
  beforeState: GameState;
  move: Move;
  san: string;
  halfMoveIndex: number;
}): MoveHistoryItem => ({
  halfMoveIndex,
  moveNumber: beforeState.fullmoveNumber,
  side: beforeState.turn,
  san,
  move,
  beforeState,
  afterState: executeMove(beforeState, move),
});

const createHistoryItems = (): MoveHistoryItem[] => {
  const firstBeforeState = createInitialGameState();
  const firstMove = createMove(SQUARE.E2, SQUARE.E4, MOVE_KIND.DOUBLE_PAWN_PUSH);
  const secondBeforeState = executeMove(firstBeforeState, firstMove);
  const secondMove = createMove(SQUARE.E7, SQUARE.E5, MOVE_KIND.DOUBLE_PAWN_PUSH);
  const thirdBeforeState = executeMove(secondBeforeState, secondMove);
  const thirdMove = createMove(SQUARE.G1, SQUARE.F3);

  return [
    createHistoryItem({
      beforeState: firstBeforeState,
      move: firstMove,
      san: 'e4',
      halfMoveIndex: 0,
    }),
    createHistoryItem({
      beforeState: secondBeforeState,
      move: secondMove,
      san: 'e5',
      halfMoveIndex: 1,
    }),
    createHistoryItem({
      beforeState: thirdBeforeState,
      move: thirdMove,
      san: 'Nf3',
      halfMoveIndex: 2,
    }),
  ];
};

describe('useHistoryNavigation', () => {
  it('빈 기록에서는 canUndo가 false이고 되돌리기를 호출해도 선택 상태를 바꾸지 않아야 한다', () => {
    const selectHalfMove = vi.fn();
    const { result } = renderHook(() =>
      useHistoryNavigation({
        historyItems: [],
        selectedHalfMoveIndex: null,
        selectHalfMove,
      }),
    );

    expect(result.current.canUndo).toBe(false);

    act(() => {
      result.current.goToPreviousHalfMove();
    });

    expect(selectHalfMove).not.toHaveBeenCalled();
  });

  it('첫 반수에서는 canUndo가 false이고 0 아래 인덱스로 이동하지 않아야 한다', () => {
    const selectHalfMove = vi.fn();
    const historyItems = createHistoryItems();
    const { result } = renderHook(() =>
      useHistoryNavigation({
        historyItems,
        selectedHalfMoveIndex: 0,
        selectHalfMove,
      }),
    );

    expect(result.current.canUndo).toBe(false);

    act(() => {
      result.current.goToPreviousHalfMove();
    });

    expect(selectHalfMove).not.toHaveBeenCalled();
  });

  it('선택된 반수가 없으면 마지막 반수를 현재 기준으로 삼아 직전 반수로 이동해야 한다', () => {
    const selectHalfMove = vi.fn();
    const historyItems = createHistoryItems();
    const { result } = renderHook(() =>
      useHistoryNavigation({
        historyItems,
        selectedHalfMoveIndex: null,
        selectHalfMove,
      }),
    );

    expect(result.current.canUndo).toBe(true);

    act(() => {
      result.current.goToPreviousHalfMove();
    });

    expect(selectHalfMove).toHaveBeenCalledWith(1);
  });

  it('선택된 반수가 있으면 그 반수를 현재 기준으로 삼아 한 반수만 뒤로 이동해야 한다', () => {
    const selectHalfMove = vi.fn();
    const historyItems = createHistoryItems();
    const { result } = renderHook(() =>
      useHistoryNavigation({
        historyItems,
        selectedHalfMoveIndex: 2,
        selectHalfMove,
      }),
    );

    expect(result.current.canUndo).toBe(true);

    act(() => {
      result.current.goToPreviousHalfMove();
    });

    expect(selectHalfMove).toHaveBeenCalledOnce();
    expect(selectHalfMove).toHaveBeenCalledWith(1);
  });

  it('선택된 반수가 중간이면 최신 수순이나 수순 배열을 직접 변경하지 않아야 한다', () => {
    const selectHalfMove = vi.fn();
    const historyItems = createHistoryItems();
    const originalHistoryItems = [...historyItems];
    const { result } = renderHook(() =>
      useHistoryNavigation({
        historyItems,
        selectedHalfMoveIndex: 1,
        selectHalfMove,
      }),
    );

    act(() => {
      result.current.goToPreviousHalfMove();
    });

    expect(selectHalfMove).toHaveBeenCalledWith(0);
    expect(historyItems).toEqual(originalHistoryItems);
    expect(historyItems.at(-1)?.san).toBe('Nf3');
  });

  describe('redo', () => {
    it('다음 반수가 있을 때만 canRedo가 true다', () => {
      const selectHalfMove = vi.fn();
      const historyItems = createHistoryItems();

      const { result, rerender } = renderHook(
        ({ selectedHalfMoveIndex }: { selectedHalfMoveIndex: number | null }) =>
          useHistoryNavigation({
            historyItems,
            selectedHalfMoveIndex,
            selectHalfMove,
          }),
        {
          initialProps: {
            selectedHalfMoveIndex: 1,
          } as { selectedHalfMoveIndex: number | null },
        },
      );

      expect(result.current.canRedo).toBe(true);

      rerender({ selectedHalfMoveIndex: 2 });
      expect(result.current.canRedo).toBe(false);

      rerender({ selectedHalfMoveIndex: null });
      expect(result.current.canRedo).toBe(false);
    });

    it('goToNextHalfMove 호출 시 다음 반수 인덱스를 선택해야 한다', () => {
      const selectHalfMove = vi.fn();
      const historyItems = createHistoryItems();
      const { result } = renderHook(() =>
        useHistoryNavigation({
          historyItems,
          selectedHalfMoveIndex: 1,
          selectHalfMove,
        }),
      );

      act(() => {
        result.current.goToNextHalfMove();
      });

      expect(selectHalfMove).toHaveBeenCalledOnce();
      expect(selectHalfMove).toHaveBeenCalledWith(2);
    });

    it('다음 반수가 없으면 goToNextHalfMove 호출 시 선택 상태를 바꾸지 않아야 한다', () => {
      const selectHalfMove = vi.fn();
      const historyItems = createHistoryItems();
      const { result } = renderHook(() =>
        useHistoryNavigation({
          historyItems,
          selectedHalfMoveIndex: null,
          selectHalfMove,
        }),
      );

      expect(result.current.canRedo).toBe(false);

      act(() => {
        result.current.goToNextHalfMove();
      });

      expect(selectHalfMove).not.toHaveBeenCalled();
    });
  });
});
