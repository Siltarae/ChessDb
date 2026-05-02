import {
  COLOR,
  MOVE_KIND,
  PIECE_TYPE,
  SQUARE,
  executeMove,
  type Board,
  type Color,
  type GameState,
  type Move,
  type Piece,
} from '@chess-db/shared';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { BoardShell } from './board-shell';
import { useMoveHistoryStore } from '@/features/move-history/model/move-history-store';

const mockApplyGameState = vi.fn();
const mockSelectSquare = vi.fn();
const mockClearSelection = vi.fn();
const mockMakeMove = vi.fn();
const mockClearPendingPromotion = vi.fn();
const mockSelectPromotionPiece = vi.fn();

const mockGameStoreState = vi.hoisted(() => ({
  state: {
    gameState: null as GameState | null,
    boardState: [] as unknown as Board,
    repetitionHistory: {} as Record<string, number>,
    applyGameState: vi.fn(),
  },
}));

const mockLegalMoveHighlight = vi.hoisted(() => ({
  selectedSquare: null as number | null,
  highlightSquares: [] as number[],
  selectSquare: vi.fn(),
  clearSelection: vi.fn(),
}));

const mockMakeMoveState = vi.hoisted(() => ({
  makeMove: vi.fn(),
  lastMove: null as { from: number; to: number } | null,
  pendingPromotionMove: null as {
    from: number;
    to: number;
    candidates: Array<{ from: number; to: number; kind: number; promotion?: number }>;
  } | null,
  clearPendingPromotion: vi.fn(),
  selectPromotionPiece: vi.fn(),
}));

const mockGameResultStatus = vi.hoisted(() => ({
  isGameOver: false,
  resultReason: null as string | null,
  canStartNewMove: true,
}));

vi.mock('@/entities/game/model/game-store', () => ({
  selectApplyGameState: (state: typeof mockGameStoreState.state) => state.applyGameState,
  selectBoardState: (state: typeof mockGameStoreState.state) => state.boardState,
  selectGameState: (state: typeof mockGameStoreState.state) => state.gameState,
  selectRepetitionHistory: (state: typeof mockGameStoreState.state) => state.repetitionHistory,
  useGameStore: <T,>(selector: (state: typeof mockGameStoreState.state) => T) =>
    selector(mockGameStoreState.state),
}));

vi.mock('@/features/legal-move-highlight/model/use-legal-move-highlight', () => ({
  useLegalMoveHighlight: () => mockLegalMoveHighlight,
}));

vi.mock('@/features/make-move/model/use-make-move', () => ({
  useMakeMove: () => mockMakeMoveState,
}));

vi.mock('@/features/game-result/model/use-game-result-status', () => ({
  useGameResultStatus: () => mockGameResultStatus,
}));

vi.mock('@/widgets/chess-board/ui/chess-board', () => ({
  ChessBoard: ({
    boardState,
    highlightSquares,
    selectedSquare,
    onSquareClick,
    lastMove,
  }: {
    boardState: Board;
    highlightSquares: number[];
    selectedSquare: number | null;
    onSquareClick: (square: number) => void;
    lastMove: { from: number; to: number } | null;
  }) => (
    <button
      type="button"
      data-piece-e2={toPieceLabel(boardState[SQUARE.E2] ?? null)}
      data-piece-e4={toPieceLabel(boardState[SQUARE.E4] ?? null)}
      data-highlight-count={highlightSquares.length}
      data-selected-square={selectedSquare ?? 'none'}
      data-last-move={lastMove === null ? 'none' : `${lastMove.from}-${lastMove.to}`}
      onClick={() => onSquareClick(SQUARE.E4)}
    >
      mock chess board
    </button>
  ),
}));

const createBoard = (): Board => {
  const board = Array.from({ length: 64 }, () => null) as (Piece | null)[];
  board[SQUARE.E2] = { type: PIECE_TYPE.PAWN, color: COLOR.WHITE };
  board[SQUARE.A7] = { type: PIECE_TYPE.PAWN, color: COLOR.WHITE };
  board[SQUARE.H2] = { type: PIECE_TYPE.PAWN, color: COLOR.BLACK };

  return board as Board;
};

const createGameState = (turn: Color = COLOR.WHITE): GameState => ({
  board: createBoard(),
  turn,
  castlingRights: 0,
  enPassantSquare: null,
  halfmoveClock: 0,
  fullmoveNumber: 1,
});

const setPendingPromotionMove = (turn: Color = COLOR.WHITE) => {
  mockGameStoreState.state.gameState = createGameState(turn);
  mockGameStoreState.state.boardState = mockGameStoreState.state.gameState.board;
  mockMakeMoveState.pendingPromotionMove = {
    from: turn === COLOR.WHITE ? SQUARE.A7 : SQUARE.H2,
    to: turn === COLOR.WHITE ? SQUARE.A8 : SQUARE.H1,
    candidates: [
      {
        from: turn === COLOR.WHITE ? SQUARE.A7 : SQUARE.H2,
        to: turn === COLOR.WHITE ? SQUARE.A8 : SQUARE.H1,
        kind: MOVE_KIND.NORMAL,
        promotion: PIECE_TYPE.QUEEN,
      },
      {
        from: turn === COLOR.WHITE ? SQUARE.A7 : SQUARE.H2,
        to: turn === COLOR.WHITE ? SQUARE.A8 : SQUARE.H1,
        kind: MOVE_KIND.NORMAL,
        promotion: PIECE_TYPE.KNIGHT,
      },
    ],
  };
};

beforeEach(() => {
  mockApplyGameState.mockReset();
  mockSelectSquare.mockReset();
  mockClearSelection.mockReset();
  mockMakeMove.mockReset();
  mockClearPendingPromotion.mockReset();
  mockSelectPromotionPiece.mockReset();

  mockGameStoreState.state.gameState = createGameState();
  mockGameStoreState.state.boardState = mockGameStoreState.state.gameState.board;
  mockGameStoreState.state.repetitionHistory = {};
  mockGameStoreState.state.applyGameState = mockApplyGameState;

  mockLegalMoveHighlight.selectedSquare = null;
  mockLegalMoveHighlight.highlightSquares = [];
  mockLegalMoveHighlight.selectSquare = mockSelectSquare;
  mockLegalMoveHighlight.clearSelection = mockClearSelection;

  mockMakeMoveState.makeMove = mockMakeMove;
  mockMakeMoveState.lastMove = null;
  mockMakeMoveState.pendingPromotionMove = null;
  mockMakeMoveState.clearPendingPromotion = mockClearPendingPromotion;
  mockMakeMoveState.selectPromotionPiece = mockSelectPromotionPiece;

  mockGameResultStatus.isGameOver = false;
  mockGameResultStatus.resultReason = null;
  mockGameResultStatus.canStartNewMove = true;

  useMoveHistoryStore.getState().clearMoveHistory();
});

afterEach(() => {
  cleanup();
});

describe('BoardShell', () => {
  it('기본 상태에서는 현재 턴 status와 보드를 렌더링하고 프로모션 UI는 숨겨야 한다', () => {
    render(<BoardShell />);

    expect(screen.getByRole('region', { name: '기보 입력 보드 영역' })).toHaveClass('relative');
    expect(screen.getByRole('status', { name: '현재 턴 백' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'mock chess board' })).toBeInTheDocument();
    expect(screen.queryByRole('dialog', { name: '프로모션 기물 선택' })).not.toBeInTheDocument();
  });

  it('일반 보드 클릭은 makeMove 실패 시 selectSquare로 이어져야 한다', () => {
    mockMakeMove.mockReturnValue(false);

    render(<BoardShell />);

    fireEvent.click(screen.getByRole('button', { name: 'mock chess board' }));

    expect(mockMakeMove).toHaveBeenCalledWith(SQUARE.E4);
    expect(mockSelectSquare).toHaveBeenCalledWith(SQUARE.E4);
  });

  it('일반 보드 클릭에서 makeMove가 성공하면 selectSquare를 호출하지 않아야 한다', () => {
    mockMakeMove.mockReturnValue(true);

    render(<BoardShell />);

    fireEvent.click(screen.getByRole('button', { name: 'mock chess board' }));

    expect(mockMakeMove).toHaveBeenCalledWith(SQUARE.E4);
    expect(mockSelectSquare).not.toHaveBeenCalled();
  });

  it('게임 종료 상태에서는 보드 클릭이 makeMove와 selectSquare로 이어지지 않아야 한다', () => {
    mockGameResultStatus.isGameOver = true;
    mockGameResultStatus.resultReason = 'CHECKMATE';
    mockGameResultStatus.canStartNewMove = false;

    render(<BoardShell />);

    fireEvent.click(screen.getByRole('button', { name: 'mock chess board' }));

    expect(mockMakeMove).not.toHaveBeenCalled();
    expect(mockSelectSquare).not.toHaveBeenCalled();
  });

  it('프로모션 보류 상태에서는 selector를 표시하고 보드 클릭을 무시해야 한다', () => {
    setPendingPromotionMove();

    render(<BoardShell />);

    expect(screen.getByRole('dialog', { name: '프로모션 기물 선택' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '퀸으로 승격' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '나이트로 승격' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'mock chess board' }));

    expect(mockMakeMove).not.toHaveBeenCalled();
    expect(mockSelectSquare).not.toHaveBeenCalled();
  });

  it('프로모션 selector 바깥을 누르면 보류 상태와 선택 상태를 정리해야 한다', () => {
    setPendingPromotionMove();

    render(<BoardShell />);

    fireEvent.pointerDown(document.body);

    expect(mockClearPendingPromotion).toHaveBeenCalledOnce();
    expect(mockClearSelection).toHaveBeenCalledOnce();
  });

  it('프로모션 selector 안을 누르면 취소하지 않고 선택 handler를 호출해야 한다', () => {
    setPendingPromotionMove();

    render(<BoardShell />);

    fireEvent.pointerDown(screen.getByRole('dialog', { name: '프로모션 기물 선택' }));
    fireEvent.click(screen.getByRole('button', { name: '퀸으로 승격' }));

    expect(mockClearPendingPromotion).not.toHaveBeenCalled();
    expect(mockClearSelection).not.toHaveBeenCalled();
    expect(mockSelectPromotionPiece).toHaveBeenCalledWith(PIECE_TYPE.QUEEN);
  });

  it('백 프로모션 팝오버는 도착 칸 위치에서 시작해야 한다', () => {
    setPendingPromotionMove(COLOR.WHITE);

    render(<BoardShell />);

    const popover = screen.getByRole('dialog', { name: '프로모션 기물 선택' }).parentElement;

    expect(popover).toHaveStyle({
      left: '0%',
      top: '0%',
      width: '12.5%',
    });
  });

  it('흑 프로모션 팝오버는 Q 후보가 도착 칸에 오도록 위쪽에서 시작해야 한다', () => {
    setPendingPromotionMove(COLOR.BLACK);

    render(<BoardShell />);

    const popover = screen.getByRole('dialog', { name: '프로모션 기물 선택' }).parentElement;

    expect(popover).toHaveStyle({
      left: '87.5%',
      top: '50%',
      width: '12.5%',
    });
  });

  it('과거 수순을 선택하면 해당 반수의 afterState 보드를 표시하고 새 입력을 막아야 한다', () => {
    const beforeState = createGameState();
    const move: Move = {
      from: SQUARE.E2,
      to: SQUARE.E4,
      kind: MOVE_KIND.DOUBLE_PAWN_PUSH,
    };
    const afterState = executeMove(beforeState, move);
    const currentBoard = Array.from(createBoard()) as (Piece | null)[];
    currentBoard[SQUARE.E2] = { type: PIECE_TYPE.PAWN, color: COLOR.WHITE };
    currentBoard[SQUARE.E4] = null;

    mockGameStoreState.state.gameState = beforeState;
    mockGameStoreState.state.boardState = currentBoard as Board;
    mockLegalMoveHighlight.highlightSquares = [SQUARE.E4];
    mockLegalMoveHighlight.selectedSquare = SQUARE.E2;
    useMoveHistoryStore.getState().appendMoveHistory({
      beforeState,
      move,
      afterState,
      san: 'e4',
    });
    useMoveHistoryStore.getState().appendMoveHistory({
      beforeState: afterState,
      move: {
        from: SQUARE.H2,
        to: SQUARE.H1,
        kind: MOVE_KIND.NORMAL,
      },
      afterState: {
        ...afterState,
        fullmoveNumber: 2,
      },
      san: 'h1',
    });
    useMoveHistoryStore.getState().selectHalfMove(0);

    render(<BoardShell />);

    const board = screen.getByRole('button', { name: 'mock chess board' });
    expect(board).toHaveAttribute('data-piece-e2', 'empty');
    expect(board).toHaveAttribute('data-piece-e4', 'white pawn');
    expect(board).toHaveAttribute('data-highlight-count', '0');
    expect(board).toHaveAttribute('data-selected-square', 'none');
    expect(board).toHaveAttribute('data-last-move', `${SQUARE.E2}-${SQUARE.E4}`);
    expect(screen.getByRole('status', { name: '현재 턴 흑' })).toBeInTheDocument();

    fireEvent.click(board);

    expect(mockMakeMove).not.toHaveBeenCalled();
    expect(mockSelectSquare).not.toHaveBeenCalled();
  });
});

const toPieceLabel = (piece: Piece | null) => {
  if (piece === null) {
    return 'empty';
  }

  return `${piece.color === COLOR.WHITE ? 'white' : 'black'} ${toPieceTypeLabel(piece.type)}`;
};

const toPieceTypeLabel = (pieceType: Piece['type']) => {
  switch (pieceType) {
    case PIECE_TYPE.PAWN:
      return 'pawn';
    case PIECE_TYPE.KNIGHT:
      return 'knight';
    case PIECE_TYPE.BISHOP:
      return 'bishop';
    case PIECE_TYPE.ROOK:
      return 'rook';
    case PIECE_TYPE.QUEEN:
      return 'queen';
    case PIECE_TYPE.KING:
      return 'king';
    default:
      return 'unknown';
  }
};
