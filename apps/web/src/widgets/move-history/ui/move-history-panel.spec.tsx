import {
  COLOR,
  GAME_RESULT_STATUS,
  MOVE_KIND,
  SQUARE,
  createInitialGameState,
  executeMove,
  type GameState,
  type Move,
} from '@chess-db/shared';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import type { MoveHistoryRow } from '@/entities/move-history';
import type { GameResultStatusView } from '@/features/game-result';
import { MoveHistoryPanel } from './move-history-panel';

const ongoingGameResultStatus: GameResultStatusView = {
  gameResult: { status: GAME_RESULT_STATUS.ONGOING },
  isGameOver: false,
  isDraw: false,
  isWhiteWin: false,
  isBlackWin: false,
  resultReason: null,
  canStartNewMove: true,
};

const renderMoveHistoryPanel = ({
  rows = [],
  selectedHalfMoveIndex = null,
  moveAnnotationLabelsByHalfMoveIndex = {},
  gameResultStatus = ongoingGameResultStatus,
  canUndo = false,
  canRedo = false,
  boardOrientation = 'white',
  onToggleBoardOrientation = vi.fn(),
  onSelectHalfMove = vi.fn(),
  onUndo = vi.fn(),
  onRedo = vi.fn(),
}: {
  rows?: MoveHistoryRow[];
  selectedHalfMoveIndex?: number | null;
  moveAnnotationLabelsByHalfMoveIndex?: React.ComponentProps<
    typeof MoveHistoryPanel
  >['moveAnnotationLabelsByHalfMoveIndex'];
  gameResultStatus?: GameResultStatusView;
  canUndo?: boolean;
  canRedo?: boolean;
  boardOrientation?: React.ComponentProps<typeof MoveHistoryPanel>['boardOrientation'];
  onToggleBoardOrientation?: () => void;
  onSelectHalfMove?: (halfMoveIndex: number) => void;
  onUndo?: () => void;
  onRedo?: () => void;
}) =>
  render(
    <MoveHistoryPanel
      rows={rows}
      selectedHalfMoveIndex={selectedHalfMoveIndex}
      moveAnnotationLabelsByHalfMoveIndex={moveAnnotationLabelsByHalfMoveIndex}
      gameResultStatus={gameResultStatus}
      canUndo={canUndo}
      canRedo={canRedo}
      boardOrientation={boardOrientation}
      onToggleBoardOrientation={onToggleBoardOrientation}
      onSelectHalfMove={onSelectHalfMove}
      onUndo={onUndo}
      onRedo={onRedo}
    />,
  );

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
}) => ({
  halfMoveIndex,
  moveNumber: beforeState.fullmoveNumber,
  side: beforeState.turn,
  san,
  move,
  beforeState,
  afterState: executeMove(beforeState, move),
});

describe('MoveHistoryPanel', () => {
  afterEach(() => {
    cleanup();
  });

  it('첫 착수 전에는 빈 수순 안내를 표시해야 한다', () => {
    renderMoveHistoryPanel({});

    expect(screen.getByRole('region', { name: '수순 목록' })).toBeInTheDocument();
    expect(screen.getByText('아직 기록된 수가 없습니다.')).toBeInTheDocument();
  });

  it('수순 목록 헤더에 보드 시점 전환 아이콘 버튼을 표시해야 한다', () => {
    renderMoveHistoryPanel({});

    expect(screen.getByRole('button', { name: '보드 시점 전환' })).toBeInTheDocument();
  });

  it('보드 시점 전환 아이콘 버튼을 클릭하면 onToggleBoardOrientation을 호출해야 한다', () => {
    const onToggleBoardOrientation = vi.fn();

    renderMoveHistoryPanel({ onToggleBoardOrientation });

    fireEvent.click(screen.getByRole('button', { name: '보드 시점 전환' }));

    expect(onToggleBoardOrientation).toHaveBeenCalledOnce();
  });

  it('흑 기준 시점에서는 보드 시점 전환 버튼이 눌린 상태여야 한다', () => {
    renderMoveHistoryPanel({ boardOrientation: 'black' });

    expect(screen.getByRole('button', { name: '보드 시점 전환' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  it('백과 흑 수순을 한 행에 표시하고 마지막 반수 셀을 강조해야 한다', () => {
    const whiteState = createInitialGameState();
    const whiteMove = createMove(SQUARE.E2, SQUARE.E4, MOVE_KIND.DOUBLE_PAWN_PUSH);
    const blackState = executeMove(whiteState, whiteMove);
    const blackMove = createMove(SQUARE.E7, SQUARE.E5, MOVE_KIND.DOUBLE_PAWN_PUSH);
    const rows: MoveHistoryRow[] = [
      {
        moveNumber: 1,
        white: createHistoryItem({
          beforeState: whiteState,
          move: whiteMove,
          san: 'e4',
          halfMoveIndex: 0,
        }),
        black: createHistoryItem({
          beforeState: blackState,
          move: blackMove,
          san: 'e5',
          halfMoveIndex: 1,
        }),
      },
    ];

    renderMoveHistoryPanel({ rows, selectedHalfMoveIndex: 1 });

    expect(screen.getByText('1.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'e4' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'e5' })).toHaveAttribute('aria-current', 'step');
  });

  it('반수별 평가 기호 label을 SAN 뒤에 붙여 표시해야 한다', () => {
    const whiteState = createInitialGameState();
    const whiteMove = createMove(SQUARE.E2, SQUARE.E4, MOVE_KIND.DOUBLE_PAWN_PUSH);
    const rows: MoveHistoryRow[] = [
      {
        moveNumber: 1,
        white: createHistoryItem({
          beforeState: whiteState,
          move: whiteMove,
          san: 'e4',
          halfMoveIndex: 0,
        }),
        black: null,
      },
    ];

    renderMoveHistoryPanel({
      rows,
      moveAnnotationLabelsByHalfMoveIndex: { 0: '!' },
    });

    expect(screen.getByRole('button', { name: 'e4!' })).toBeInTheDocument();
  });

  it('과거 수순 선택 상태와 마지막 착수 강조를 분리해야 한다', () => {
    const whiteState = createInitialGameState();
    const whiteMove = createMove(SQUARE.E2, SQUARE.E4, MOVE_KIND.DOUBLE_PAWN_PUSH);
    const blackState = executeMove(whiteState, whiteMove);
    const blackMove = createMove(SQUARE.E7, SQUARE.E5, MOVE_KIND.DOUBLE_PAWN_PUSH);
    const rows: MoveHistoryRow[] = [
      {
        moveNumber: 1,
        white: createHistoryItem({
          beforeState: whiteState,
          move: whiteMove,
          san: 'e4',
          halfMoveIndex: 0,
        }),
        black: createHistoryItem({
          beforeState: blackState,
          move: blackMove,
          san: 'e5',
          halfMoveIndex: 1,
        }),
      },
    ];

    renderMoveHistoryPanel({ rows, selectedHalfMoveIndex: 0 });

    expect(screen.getByRole('button', { name: 'e4' })).toHaveAttribute('data-selected', 'true');
    expect(screen.getByRole('button', { name: 'e4' })).not.toHaveAttribute('aria-current', 'step');
    expect(screen.getByRole('button', { name: 'e5' })).toHaveAttribute('aria-current', 'step');
  });

  it('수순 셀을 클릭하면 해당 반수 인덱스를 전달해야 한다', () => {
    const onSelectHalfMove = vi.fn();
    const state = createInitialGameState();
    const move = createMove(SQUARE.E2, SQUARE.E4, MOVE_KIND.DOUBLE_PAWN_PUSH);
    const rows: MoveHistoryRow[] = [
      {
        moveNumber: 1,
        white: createHistoryItem({
          beforeState: state,
          move,
          san: 'e4',
          halfMoveIndex: 0,
        }),
        black: null,
      },
    ];

    renderMoveHistoryPanel({ rows, onSelectHalfMove });

    fireEvent.click(screen.getByRole('button', { name: 'e4' }));

    expect(onSelectHalfMove).toHaveBeenCalledWith(0);
  });

  it('되돌리기 가능 상태에서 보조 액션을 클릭하면 onUndo를 호출해야 한다', () => {
    const onUndo = vi.fn();

    renderMoveHistoryPanel({ canUndo: true, onUndo });

    fireEvent.click(screen.getByRole('button', { name: '↶' }));

    expect(onUndo).toHaveBeenCalledOnce();
  });

  it('다시하기 가능 상태에서 보조 액션을 클릭하면 onRedo를 호출해야 한다', () => {
    const onRedo = vi.fn();

    renderMoveHistoryPanel({ canRedo: true, onRedo });

    fireEvent.click(screen.getByRole('button', { name: '↷' }));

    expect(onRedo).toHaveBeenCalledOnce();
  });

  it('다시하기 불가능 상태에서는 onRedo를 호출하지 않아야 한다', () => {
    const onRedo = vi.fn();

    renderMoveHistoryPanel({ canRedo: false, onRedo });

    fireEvent.click(screen.getByRole('button', { name: '↷' }));

    expect(onRedo).not.toHaveBeenCalled();
  });

  it('흑 수가 없는 마지막 행에는 클릭 가능한 흑 셀을 만들지 않아야 한다', () => {
    const state = createInitialGameState();
    const move = createMove(SQUARE.E2, SQUARE.E4, MOVE_KIND.DOUBLE_PAWN_PUSH);
    const rows: MoveHistoryRow[] = [
      {
        moveNumber: 1,
        white: createHistoryItem({
          beforeState: state,
          move,
          san: 'e4',
          halfMoveIndex: 0,
        }),
        black: null,
      },
    ];

    renderMoveHistoryPanel({ rows, selectedHalfMoveIndex: 0 });

    expect(screen.getByRole('button', { name: 'e4' })).toBeInTheDocument();
    expect(screen.getAllByRole('button')).toHaveLength(4);
  });

  it('백 승리 종료 상태이면 결과와 종료 사유를 표시해야 한다', () => {
    renderMoveHistoryPanel({
      gameResultStatus: {
        gameResult: {
          status: GAME_RESULT_STATUS.FINISHED,
          reason: 'CHECKMATE',
          winner: COLOR.WHITE,
        },
        isGameOver: true,
        isDraw: false,
        isWhiteWin: true,
        isBlackWin: false,
        resultReason: 'CHECKMATE',
        canStartNewMove: false,
      },
    });

    expect(screen.getByText('1-0')).toBeInTheDocument();
    expect(screen.getByText('CHECKMATE')).toBeInTheDocument();
  });

  it('흑 승리 종료 상태이면 결과 표기를 표시해야 한다', () => {
    renderMoveHistoryPanel({
      gameResultStatus: {
        gameResult: {
          status: GAME_RESULT_STATUS.FINISHED,
          reason: 'CHECKMATE',
          winner: COLOR.BLACK,
        },
        isGameOver: true,
        isDraw: false,
        isWhiteWin: false,
        isBlackWin: true,
        resultReason: 'CHECKMATE',
        canStartNewMove: false,
      },
    });

    expect(screen.getByText('0-1')).toBeInTheDocument();
  });

  it('무승부 종료 상태이면 결과 표기를 표시해야 한다', () => {
    renderMoveHistoryPanel({
      gameResultStatus: {
        gameResult: {
          status: GAME_RESULT_STATUS.FINISHED,
          reason: 'STALEMATE',
        },
        isGameOver: true,
        isDraw: true,
        isWhiteWin: false,
        isBlackWin: false,
        resultReason: 'STALEMATE',
        canStartNewMove: false,
      },
    });

    expect(screen.getByText('1/2-1/2')).toBeInTheDocument();
  });
});
