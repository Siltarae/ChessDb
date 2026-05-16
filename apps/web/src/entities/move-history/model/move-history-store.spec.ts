import {
  COLOR,
  MOVE_KIND,
  SQUARE,
  createInitialGameState,
  executeMove,
  type GameState,
  type Move,
} from '@chess-db/shared';
import { beforeEach, describe, expect, it } from 'vitest';

import {
  groupMoveHistoryRows,
  selectSelectedMoveHistoryBoard,
  selectSelectedMoveHistoryItem,
  useMoveHistoryStore,
} from './move-history-store';

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

describe('수순 목록 기록 및 내역 표시', () => {
  beforeEach(() => {
    useMoveHistoryStore.getState().clearMoveHistory();
  });

  describe('useMoveHistoryStore가 착수 기록을 추가할 때', () => {
    it('성공한 착수를 반수 단위 항목으로 누적하고 마지막 반수를 선택해야 한다', () => {
      const beforeState = createInitialGameState();
      const move = createMove(SQUARE.E2, SQUARE.E4, MOVE_KIND.DOUBLE_PAWN_PUSH);
      const afterState = executeMove(beforeState, move);

      useMoveHistoryStore.getState().appendMoveHistory({
        beforeState,
        move,
        afterState,
        san: 'e4',
      });

      const { historyItems, selectedHalfMoveIndex } = useMoveHistoryStore.getState();
      expect(historyItems).toHaveLength(1);
      expect(historyItems[0]).toMatchObject({
        halfMoveIndex: 0,
        moveNumber: 1,
        side: COLOR.WHITE,
        san: 'e4',
        move,
        beforeState,
        afterState,
      });
      expect(selectedHalfMoveIndex).toBe(0);
    });

    it('백과 흑 착수를 순서대로 같은 수 번호 행에 묶을 수 있어야 한다', () => {
      let state = createInitialGameState();
      state = appendMove(state, createMove(SQUARE.E2, SQUARE.E4, MOVE_KIND.DOUBLE_PAWN_PUSH), 'e4');
      state = appendMove(state, createMove(SQUARE.E7, SQUARE.E5, MOVE_KIND.DOUBLE_PAWN_PUSH), 'e5');
      appendMove(state, createMove(SQUARE.G1, SQUARE.F3), 'Nf3');

      const rows = groupMoveHistoryRows(useMoveHistoryStore.getState().historyItems);

      expect(rows).toHaveLength(2);
      expect(rows[0]).toMatchObject({
        moveNumber: 1,
        white: { halfMoveIndex: 0, san: 'e4' },
        black: { halfMoveIndex: 1, san: 'e5' },
      });
      expect(rows[1]).toMatchObject({
        moveNumber: 2,
        white: { halfMoveIndex: 2, san: 'Nf3' },
        black: null,
      });
    });

    it('존재하지 않는 반수를 선택하면 기존 선택 상태를 유지해야 한다', () => {
      const beforeState = createInitialGameState();
      appendMove(beforeState, createMove(SQUARE.E2, SQUARE.E4, MOVE_KIND.DOUBLE_PAWN_PUSH), 'e4');

      useMoveHistoryStore.getState().selectHalfMove(99);

      expect(useMoveHistoryStore.getState().selectedHalfMoveIndex).toBe(0);
    });

    it('선택한 반수의 afterState를 조회할 수 있어야 한다', () => {
      let state = createInitialGameState();
      state = appendMove(state, createMove(SQUARE.E2, SQUARE.E4, MOVE_KIND.DOUBLE_PAWN_PUSH), 'e4');
      const afterBlackMove = appendMove(
        state,
        createMove(SQUARE.E7, SQUARE.E5, MOVE_KIND.DOUBLE_PAWN_PUSH),
        'e5',
      );

      useMoveHistoryStore.getState().selectHalfMove(1);

      const selectedItem = selectSelectedMoveHistoryItem(useMoveHistoryStore.getState());
      const selectedBoard = selectSelectedMoveHistoryBoard(useMoveHistoryStore.getState());
      expect(selectedItem?.san).toBe('e5');
      expect(selectedItem?.afterState).toBe(afterBlackMove);
      expect(selectedBoard).toBe(afterBlackMove.board);
    });

    it('수순 기록을 비우면 항목과 선택 상태를 함께 초기화해야 한다', () => {
      const beforeState = createInitialGameState();
      appendMove(beforeState, createMove(SQUARE.E2, SQUARE.E4, MOVE_KIND.DOUBLE_PAWN_PUSH), 'e4');

      useMoveHistoryStore.getState().clearMoveHistory();

      expect(useMoveHistoryStore.getState().historyItems).toEqual([]);
      expect(useMoveHistoryStore.getState().selectedHalfMoveIndex).toBeNull();
      expect(selectSelectedMoveHistoryItem(useMoveHistoryStore.getState())).toBeNull();
      expect(selectSelectedMoveHistoryBoard(useMoveHistoryStore.getState())).toBeNull();
    });

    it('저장된 수순 목록을 복원하면 선택 반수는 복원하지 않고 null로 초기화해야 한다', () => {
      let state = createInitialGameState();
      state = appendMove(state, createMove(SQUARE.E2, SQUARE.E4, MOVE_KIND.DOUBLE_PAWN_PUSH), 'e4');
      appendMove(state, createMove(SQUARE.E7, SQUARE.E5, MOVE_KIND.DOUBLE_PAWN_PUSH), 'e5');
      const savedHistoryItems = useMoveHistoryStore.getState().historyItems;

      useMoveHistoryStore.getState().selectHalfMove(0);
      useMoveHistoryStore.getState().hydrateMoveHistory(savedHistoryItems);

      expect(useMoveHistoryStore.getState().historyItems).toEqual(savedHistoryItems);
      expect(useMoveHistoryStore.getState().historyItems).not.toBe(savedHistoryItems);
      expect(useMoveHistoryStore.getState().selectedHalfMoveIndex).toBeNull();
      expect(selectSelectedMoveHistoryItem(useMoveHistoryStore.getState())).toBeNull();
    });
  });
});
