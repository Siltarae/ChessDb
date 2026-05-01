import {
  type Board,
  COLOR,
  PIECE_TYPE,
  SQUARE,
  createInitialGameState,
  getLegalMoves,
  type GameState,
  type Piece,
} from '@chess-db/shared';
import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { findLegalMove, findPromotionCandidates, useMakeMove } from './use-make-move';

const renderMakeMoveHook = ({
  gameState = createInitialGameState(),
  selectedSquare = SQUARE.E2,
  highlightSquares = [SQUARE.E4],
  applyGameState = vi.fn(),
  clearSelection = vi.fn(),
}: Partial<Parameters<typeof useMakeMove>[0]> = {}) =>
  renderHook(() =>
    useMakeMove({
      gameState,
      selectedSquare,
      highlightSquares,
      applyGameState,
      clearSelection,
    }),
  );

const createCaptureGameState = (): GameState => {
  const board = Array.from({ length: 64 }, () => null) as (Piece | null)[];
  board[SQUARE.E1] = { type: PIECE_TYPE.KING, color: COLOR.WHITE };
  board[SQUARE.E8] = { type: PIECE_TYPE.KING, color: COLOR.BLACK };
  board[SQUARE.D4] = { type: PIECE_TYPE.ROOK, color: COLOR.WHITE };
  board[SQUARE.D7] = { type: PIECE_TYPE.BISHOP, color: COLOR.BLACK };

  return {
    ...createInitialGameState(),
    board: board as Board,
    turn: COLOR.WHITE,
    castlingRights: 0,
    enPassantSquare: null,
  };
};

const createWhitePromotionGameState = (): GameState => {
  const board = Array.from({ length: 64 }, () => null) as (Piece | null)[];
  board[SQUARE.E1] = { type: PIECE_TYPE.KING, color: COLOR.WHITE };
  board[SQUARE.E8] = { type: PIECE_TYPE.KING, color: COLOR.BLACK };
  board[SQUARE.A7] = { type: PIECE_TYPE.PAWN, color: COLOR.WHITE };

  return {
    ...createInitialGameState(),
    board: board as Board,
    turn: COLOR.WHITE,
    castlingRights: 0,
    enPassantSquare: null,
  };
};

describe('합법 수 착수와 보드 갱신', () => {
  it('하이라이트된 합법 수를 실행하면 기물이 이동하고 턴이 전환되어야 한다', () => {
    const applyGameState = vi.fn();
    const clearSelection = vi.fn();
    const { result } = renderMakeMoveHook({ applyGameState, clearSelection });

    act(() => {
      expect(result.current.makeMove(SQUARE.E4)).toBe(true);
    });

    const nextGameState = applyGameState.mock.calls[0]?.[0] as GameState;
    expect(nextGameState.board[SQUARE.E2]).toBeNull();
    expect(nextGameState.board[SQUARE.E4]).toEqual({
      type: PIECE_TYPE.PAWN,
      color: COLOR.WHITE,
    });
    expect(nextGameState.turn).toBe(COLOR.BLACK);
    expect(clearSelection).toHaveBeenCalledOnce();
    expect(result.current.lastMove).toEqual({ from: SQUARE.E2, to: SQUARE.E4 });
  });

  it('캡처 합법 수를 실행하면 상대 기물이 사라지고 내 기물이 도착 칸을 차지해야 한다', () => {
    const gameState = createCaptureGameState();
    const applyGameState = vi.fn();
    const { result } = renderMakeMoveHook({
      gameState,
      selectedSquare: SQUARE.D4,
      highlightSquares: [SQUARE.D7],
      applyGameState,
    });

    act(() => {
      expect(result.current.makeMove(SQUARE.D7)).toBe(true);
    });

    const nextGameState = applyGameState.mock.calls[0]?.[0] as GameState;
    expect(nextGameState.board[SQUARE.D4]).toBeNull();
    expect(nextGameState.board[SQUARE.D7]).toEqual({
      type: PIECE_TYPE.ROOK,
      color: COLOR.WHITE,
    });
    expect(nextGameState.turn).toBe(COLOR.BLACK);
  });

  it('하이라이트되지 않은 칸은 착수하지 않고 상태와 선택을 유지해야 한다', () => {
    const applyGameState = vi.fn();
    const clearSelection = vi.fn();
    const { result } = renderMakeMoveHook({ applyGameState, clearSelection });

    act(() => {
      expect(result.current.makeMove(SQUARE.E5)).toBe(false);
    });

    expect(applyGameState).not.toHaveBeenCalled();
    expect(clearSelection).not.toHaveBeenCalled();
    expect(result.current.lastMove).toBeNull();
  });

  it('선택된 기물이 없으면 착수하지 않아야 한다', () => {
    const applyGameState = vi.fn();
    const clearSelection = vi.fn();
    const { result } = renderMakeMoveHook({
      selectedSquare: null,
      applyGameState,
      clearSelection,
    });

    act(() => {
      expect(result.current.makeMove(SQUARE.E4)).toBe(false);
    });

    expect(applyGameState).not.toHaveBeenCalled();
    expect(clearSelection).not.toHaveBeenCalled();
  });

  it('하이라이트에 포함됐지만 합법 수가 아니면 착수하지 않아야 한다', () => {
    const applyGameState = vi.fn();
    const clearSelection = vi.fn();
    const { result } = renderMakeMoveHook({
      highlightSquares: [SQUARE.A3],
      applyGameState,
      clearSelection,
    });

    act(() => {
      expect(result.current.makeMove(SQUARE.A3)).toBe(false);
    });

    expect(applyGameState).not.toHaveBeenCalled();
    expect(clearSelection).not.toHaveBeenCalled();
    expect(result.current.lastMove).toBeNull();
  });

  it('프로모션 후보 칸을 클릭하면 즉시 착수하지 않고 후보를 보류해야 한다', () => {
    const gameState = createWhitePromotionGameState();
    const applyGameState = vi.fn();
    const clearSelection = vi.fn();
    const { result } = renderMakeMoveHook({
      gameState,
      selectedSquare: SQUARE.A7,
      highlightSquares: [SQUARE.A8],
      applyGameState,
      clearSelection,
    });

    act(() => {
      expect(result.current.makeMove(SQUARE.A8)).toBe(true);
    });

    expect(applyGameState).not.toHaveBeenCalled();
    expect(clearSelection).not.toHaveBeenCalled();
    expect(result.current.lastMove).toBeNull();
    expect(result.current.pendingPromotionMove).toMatchObject({
      from: SQUARE.A7,
      to: SQUARE.A8,
    });
    expect(result.current.pendingPromotionMove?.candidates.map((move) => move.promotion)).toEqual([
      PIECE_TYPE.QUEEN,
      PIECE_TYPE.ROOK,
      PIECE_TYPE.BISHOP,
      PIECE_TYPE.KNIGHT,
    ]);
  });

  it('보류 중인 프로모션 기물을 선택하면 해당 기물로 착수를 확정해야 한다', () => {
    const gameState = createWhitePromotionGameState();
    const applyGameState = vi.fn();
    const clearSelection = vi.fn();
    const { result } = renderMakeMoveHook({
      gameState,
      selectedSquare: SQUARE.A7,
      highlightSquares: [SQUARE.A8],
      applyGameState,
      clearSelection,
    });

    act(() => {
      result.current.makeMove(SQUARE.A8);
    });

    act(() => {
      expect(result.current.selectPromotionPiece(PIECE_TYPE.KNIGHT)).toBe(true);
    });

    const nextGameState = applyGameState.mock.calls[0]?.[0] as GameState;
    expect(nextGameState.board[SQUARE.A7]).toBeNull();
    expect(nextGameState.board[SQUARE.A8]).toEqual({
      type: PIECE_TYPE.KNIGHT,
      color: COLOR.WHITE,
    });
    expect(nextGameState.turn).toBe(COLOR.BLACK);
    expect(clearSelection).toHaveBeenCalledOnce();
    expect(result.current.pendingPromotionMove).toBeNull();
    expect(result.current.lastMove).toEqual({ from: SQUARE.A7, to: SQUARE.A8 });
  });

  it('프로모션 보류 상태가 없거나 후보가 없으면 선택 확정을 거절해야 한다', () => {
    const applyGameState = vi.fn();
    const { result } = renderMakeMoveHook({ applyGameState });

    act(() => {
      expect(result.current.selectPromotionPiece(PIECE_TYPE.QUEEN)).toBe(false);
    });

    expect(applyGameState).not.toHaveBeenCalled();
  });

  it('프로모션 보류 상태를 명시적으로 정리할 수 있어야 한다', () => {
    const gameState = createWhitePromotionGameState();
    const { result } = renderMakeMoveHook({
      gameState,
      selectedSquare: SQUARE.A7,
      highlightSquares: [SQUARE.A8],
    });

    act(() => {
      result.current.makeMove(SQUARE.A8);
    });
    expect(result.current.pendingPromotionMove).not.toBeNull();

    act(() => {
      result.current.clearPendingPromotion();
    });

    expect(result.current.pendingPromotionMove).toBeNull();
  });

  it('findLegalMove는 도착 칸이 같은 Move 전체를 반환해 특수 이동 정보를 보존해야 한다', () => {
    const gameState = createInitialGameState();
    const legalMoves = getLegalMoves(SQUARE.E2, gameState);
    const move = findLegalMove(SQUARE.E2, SQUARE.E4, legalMoves);

    expect(move).toMatchObject({ from: SQUARE.E2, to: SQUARE.E4 });
    expect(move).toHaveProperty('kind');
  });

  it('findLegalMove는 선택 칸이 없으면 null을 반환해야 한다', () => {
    const gameState = createInitialGameState();
    const legalMoves = getLegalMoves(SQUARE.E2, gameState);

    expect(findLegalMove(null, SQUARE.E4, legalMoves)).toBeNull();
  });

  it('findPromotionCandidates는 선택 칸이 없으면 빈 배열을 반환해야 한다', () => {
    const gameState = createWhitePromotionGameState();
    const legalMoves = getLegalMoves(SQUARE.A7, gameState);

    expect(findPromotionCandidates(null, SQUARE.A8, legalMoves)).toEqual([]);
  });
});
