import {
  type Board,
  COLOR,
  PIECE_TYPE,
  SQUARE,
  createInitialGameState,
  type Piece,
} from '@chess-db/shared';
import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { useLegalMoveHighlight } from './use-legal-move-highlight';

describe('useLegalMoveHighlight', () => {
  it('현재 턴의 아군 기물을 선택하면 선택 칸과 move.to 기반 하이라이트 칸을 제공해야 한다', () => {
    const gameState = createInitialGameState();
    const { result } = renderHook(() => useLegalMoveHighlight(gameState));

    act(() => {
      result.current.selectSquare(SQUARE.G1);
    });

    expect(result.current.selectedSquare).toBe(SQUARE.G1);
    expect(result.current.highlightSquares).toEqual(expect.arrayContaining([SQUARE.F3, SQUARE.H3]));
  });

  it('빈 칸을 선택하면 선택 칸과 하이라이트를 비워야 한다', () => {
    const gameState = createInitialGameState();
    const { result } = renderHook(() => useLegalMoveHighlight(gameState));

    act(() => {
      result.current.selectSquare(SQUARE.G1);
    });
    act(() => {
      result.current.selectSquare(SQUARE.E4);
    });

    expect(result.current.selectedSquare).toBeNull();
    expect(result.current.highlightSquares).toEqual([]);
  });

  it('상대 기물을 선택하면 선택 칸과 하이라이트를 만들지 않아야 한다', () => {
    const gameState = createInitialGameState();
    const { result } = renderHook(() => useLegalMoveHighlight(gameState));

    act(() => {
      result.current.selectSquare(SQUARE.G8);
    });

    expect(result.current.selectedSquare).toBeNull();
    expect(result.current.highlightSquares).toEqual([]);
  });

  it('같은 칸을 다시 선택하면 선택 칸과 하이라이트를 해제해야 한다', () => {
    const gameState = createInitialGameState();
    const { result } = renderHook(() => useLegalMoveHighlight(gameState));

    act(() => {
      result.current.selectSquare(SQUARE.G1);
    });
    act(() => {
      result.current.selectSquare(SQUARE.G1);
    });

    expect(result.current.selectedSquare).toBeNull();
    expect(result.current.highlightSquares).toEqual([]);
  });

  it('다른 아군 기물을 선택하면 이전 하이라이트를 새 기물 기준으로 교체해야 한다', () => {
    const gameState = createInitialGameState();
    const { result } = renderHook(() => useLegalMoveHighlight(gameState));

    act(() => {
      result.current.selectSquare(SQUARE.G1);
    });
    act(() => {
      result.current.selectSquare(SQUARE.B1);
    });

    expect(result.current.selectedSquare).toBe(SQUARE.B1);
    expect(result.current.highlightSquares).toEqual(expect.arrayContaining([SQUARE.A3, SQUARE.C3]));
    expect(result.current.highlightSquares).not.toContain(SQUARE.F3);
    expect(result.current.highlightSquares).not.toContain(SQUARE.H3);
  });

  it('캡처 가능한 합법 수는 도착 칸만 하이라이트 목록에 포함해야 한다', () => {
    const board = Array.from({ length: 64 }, () => null) as (Piece | null)[];
    board[SQUARE.E1] = { type: PIECE_TYPE.KING, color: COLOR.WHITE };
    board[SQUARE.E8] = { type: PIECE_TYPE.KING, color: COLOR.BLACK };
    board[SQUARE.D4] = { type: PIECE_TYPE.ROOK, color: COLOR.WHITE };
    board[SQUARE.D7] = { type: PIECE_TYPE.BISHOP, color: COLOR.BLACK };
    const gameState = { ...createInitialGameState(), board: board as Board, turn: COLOR.WHITE };
    const { result } = renderHook(() => useLegalMoveHighlight(gameState));

    act(() => {
      result.current.selectSquare(SQUARE.D4);
    });

    expect(result.current.highlightSquares).toContain(SQUARE.D7);
    expect(result.current.highlightSquares).not.toContain(SQUARE.D4);
  });
});
