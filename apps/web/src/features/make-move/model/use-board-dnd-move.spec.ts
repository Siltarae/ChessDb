import { COLOR, SQUARE, createInitialGameState, type Board } from '@chess-db/shared';
import type { DragEndEvent, DragOverEvent, DragStartEvent } from '@dnd-kit/react';
import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useBoardDndMove } from './use-board-dnd-move';

const createBoard = (): Board => createInitialGameState().board;

describe('useBoardDndMove', () => {
  const mockSelectSquare = vi.fn();
  const mockClearSelection = vi.fn();
  const mockMakeMove = vi.fn();

  beforeEach(() => {
    mockSelectSquare.mockReset();
    mockClearSelection.mockReset();
    mockMakeMove.mockReset();
  });

  const setupParams = (overrides = {}) => ({
    boardState: createBoard(),
    turn: COLOR.WHITE,
    isBoardInputDisabled: false,
    pendingPromotionMoveExists: false,
    highlightSquares: [SQUARE.E3, SQUARE.E4],
    selectSquare: mockSelectSquare,
    clearSelection: mockClearSelection,
    makeMove: mockMakeMove,
    ...overrides,
  });

  describe('handleDragStart', () => {
    it('유효한 드래그 시작 시 activeDragSquare를 설정하고 selectSquare를 호출해야 한다', () => {
      const { result } = renderHook(() => useBoardDndMove(setupParams()));

      const event = {
        operation: {
          source: { id: `piece:${SQUARE.E2}`, data: { sourceSquare: SQUARE.E2 } },
        },
      } as unknown as DragStartEvent;

      act(() => {
        result.current.handleDragStart(event);
      });

      expect(result.current.activeDragSquare).toBe(SQUARE.E2);
      expect(mockSelectSquare).toHaveBeenCalledWith(SQUARE.E2);
    });

    it('입력이 차단된 상태면 드래그 시작을 무시해야 한다', () => {
      const { result } = renderHook(() =>
        useBoardDndMove(setupParams({ isBoardInputDisabled: true })),
      );

      const event = {
        operation: {
          source: { id: `piece:${SQUARE.E2}`, data: { sourceSquare: SQUARE.E2 } },
        },
      } as unknown as DragStartEvent;

      act(() => {
        result.current.handleDragStart(event);
      });

      expect(result.current.activeDragSquare).toBeNull();
      expect(mockSelectSquare).not.toHaveBeenCalled();
    });

    it('source를 파싱할 수 없으면 드래그 시작을 무시해야 한다', () => {
      const { result } = renderHook(() => useBoardDndMove(setupParams()));

      const event = {
        operation: {
          source: null,
        },
      } as unknown as DragStartEvent;

      act(() => {
        result.current.handleDragStart(event);
      });

      expect(result.current.activeDragSquare).toBeNull();
      expect(mockSelectSquare).not.toHaveBeenCalled();
    });
  });

  describe('handleDragOver', () => {
    it('합법 수 칸 위로 드래그하면 dragOverSquare를 설정해야 한다', () => {
      const { result } = renderHook(() => useBoardDndMove(setupParams()));

      const event = {
        operation: {
          target: { id: `square:${SQUARE.E4}`, data: { targetSquare: SQUARE.E4 } },
        },
      } as unknown as DragOverEvent;

      act(() => {
        result.current.handleDragOver(event);
      });

      expect(result.current.dragOverSquare).toBe(SQUARE.E4);
    });

    it('합법 수 칸이 아닌 곳 위로 드래그하면 dragOverSquare를 null로 설정해야 한다', () => {
      const { result } = renderHook(() => useBoardDndMove(setupParams()));

      const event = {
        operation: {
          target: { id: `square:${SQUARE.E5}`, data: { targetSquare: SQUARE.E5 } },
        },
      } as unknown as DragOverEvent;

      act(() => {
        result.current.handleDragOver(event);
      });

      expect(result.current.dragOverSquare).toBeNull();
    });

    it('target을 파싱할 수 없으면 dragOverSquare를 null로 설정해야 한다', () => {
      const { result } = renderHook(() => useBoardDndMove(setupParams()));

      const validEvent = {
        operation: {
          target: { id: `square:${SQUARE.E4}`, data: { targetSquare: SQUARE.E4 } },
        },
      } as unknown as DragOverEvent;

      act(() => {
        result.current.handleDragOver(validEvent);
      });
      expect(result.current.dragOverSquare).toBe(SQUARE.E4);

      const invalidEvent = {
        operation: {
          target: null,
        },
      } as unknown as DragOverEvent;

      act(() => {
        result.current.handleDragOver(invalidEvent);
      });

      expect(result.current.dragOverSquare).toBeNull();
    });
  });

  describe('handleDragEnd', () => {
    it('합법 수 칸에 드롭하면 makeMove를 호출하고 상태를 초기화해야 한다', () => {
      const { result } = renderHook(() => useBoardDndMove(setupParams()));

      // 1. 드래그 시작
      const startEvent = {
        operation: {
          source: { id: `piece:${SQUARE.E2}`, data: { sourceSquare: SQUARE.E2 } },
        },
      } as unknown as DragStartEvent;

      act(() => {
        result.current.handleDragStart(startEvent);
      });

      // 2. 드래그 오버
      const overEvent = {
        operation: {
          target: { id: `square:${SQUARE.E4}`, data: { targetSquare: SQUARE.E4 } },
        },
      } as unknown as DragOverEvent;

      act(() => {
        result.current.handleDragOver(overEvent);
      });

      // 3. 드롭
      const endEvent = {
        canceled: false,
        operation: {
          target: { id: `square:${SQUARE.E4}`, data: { targetSquare: SQUARE.E4 } },
        },
      } as unknown as DragEndEvent;

      act(() => {
        result.current.handleDragEnd(endEvent);
      });

      expect(mockMakeMove).toHaveBeenCalledWith(SQUARE.E4);
      expect(result.current.activeDragSquare).toBeNull();
      expect(result.current.dragOverSquare).toBeNull();
    });

    it('드래그가 취소되면 상태를 초기화하고 clearSelection을 호출해야 한다', () => {
      const { result } = renderHook(() => useBoardDndMove(setupParams()));

      const startEvent = {
        operation: {
          source: { id: `piece:${SQUARE.E2}`, data: { sourceSquare: SQUARE.E2 } },
        },
      } as unknown as DragStartEvent;

      act(() => {
        result.current.handleDragStart(startEvent);
      });

      const endEvent = {
        canceled: true,
        operation: {},
      } as unknown as DragEndEvent;

      act(() => {
        result.current.handleDragEnd(endEvent);
      });

      expect(mockMakeMove).not.toHaveBeenCalled();
      expect(mockClearSelection).toHaveBeenCalled();
      expect(result.current.activeDragSquare).toBeNull();
    });

    it('합법 수가 아닌 칸에 드롭하면 makeMove를 호출하지 않고 상태를 초기화해야 한다', () => {
      const { result } = renderHook(() => useBoardDndMove(setupParams()));

      const startEvent = {
        operation: {
          source: { id: `piece:${SQUARE.E2}`, data: { sourceSquare: SQUARE.E2 } },
        },
      } as unknown as DragStartEvent;

      act(() => {
        result.current.handleDragStart(startEvent);
      });

      const endEvent = {
        canceled: false,
        operation: {
          target: { id: `square:${SQUARE.E5}`, data: { targetSquare: SQUARE.E5 } },
        },
      } as unknown as DragEndEvent;

      act(() => {
        result.current.handleDragEnd(endEvent);
      });

      expect(mockMakeMove).not.toHaveBeenCalled();
      expect(mockClearSelection).toHaveBeenCalled();
      expect(result.current.activeDragSquare).toBeNull();
    });

    it('드래그 중 입력이 차단되면 makeMove를 호출하지 않고 상태를 초기화해야 한다', () => {
      const { result, rerender } = renderHook((props) => useBoardDndMove(props), {
        initialProps: setupParams(),
      });

      const startEvent = {
        operation: {
          source: { id: `piece:${SQUARE.E2}`, data: { sourceSquare: SQUARE.E2 } },
        },
      } as unknown as DragStartEvent;

      act(() => {
        result.current.handleDragStart(startEvent);
      });

      // 중간에 게임 상태 변경으로 입력 차단됨
      rerender(setupParams({ isBoardInputDisabled: true }));

      const endEvent = {
        canceled: false,
        operation: {
          target: { id: `square:${SQUARE.E4}`, data: { targetSquare: SQUARE.E4 } },
        },
      } as unknown as DragEndEvent;

      act(() => {
        result.current.handleDragEnd(endEvent);
      });

      expect(mockMakeMove).not.toHaveBeenCalled();
      expect(mockClearSelection).toHaveBeenCalled();
      expect(result.current.activeDragSquare).toBeNull();
    });

    it('activeDragSquare가 없는 상태에서 드롭되면 무시해야 한다', () => {
      const { result } = renderHook(() => useBoardDndMove(setupParams()));

      const endEvent = {
        canceled: false,
        operation: {
          target: { id: `square:${SQUARE.E4}`, data: { targetSquare: SQUARE.E4 } },
        },
      } as unknown as DragEndEvent;

      act(() => {
        result.current.handleDragEnd(endEvent);
      });

      expect(mockMakeMove).not.toHaveBeenCalled();
      expect(mockClearSelection).toHaveBeenCalled();
    });

    it('target을 파싱할 수 없는 칸에 드롭하면 무시해야 한다', () => {
      const { result } = renderHook(() => useBoardDndMove(setupParams()));

      const startEvent = {
        operation: {
          source: { id: `piece:${SQUARE.E2}`, data: { sourceSquare: SQUARE.E2 } },
        },
      } as unknown as DragStartEvent;

      act(() => {
        result.current.handleDragStart(startEvent);
      });

      const endEvent = {
        canceled: false,
        operation: {
          target: null,
        },
      } as unknown as DragEndEvent;

      act(() => {
        result.current.handleDragEnd(endEvent);
      });

      expect(mockMakeMove).not.toHaveBeenCalled();
      expect(mockClearSelection).toHaveBeenCalled();
    });
  });
});
