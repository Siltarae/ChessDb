import { COLOR, type Color, type GameState, type Move } from '@chess-db/shared';
import { create } from 'zustand';

type MoveHistoryItem = {
  readonly halfMoveIndex: number;
  readonly moveNumber: number;
  readonly side: Color;
  readonly san: string;
  readonly move: Move;
  readonly beforeState: GameState;
  readonly afterState: GameState;
};

export type AppendMoveHistoryInput = {
  readonly beforeState: GameState;
  readonly move: Move;
  readonly afterState: GameState;
  readonly san: string;
};

type BuildMoveHistoryItem = (
  historyItems: readonly MoveHistoryItem[],
  input: AppendMoveHistoryInput,
) => MoveHistoryItem;

type MoveHistoryStoreState = {
  readonly historyItems: MoveHistoryItem[];
  readonly selectedHalfMoveIndex: number | null;

  appendMoveHistory: (input: AppendMoveHistoryInput) => void;
  selectHalfMove: (halfMoveIndex: number) => void;
  clearMoveHistory: () => void;
};

export type MoveHistoryRow = {
  readonly moveNumber: number;
  white: MoveHistoryItem | null;
  black: MoveHistoryItem | null;
};

export const useMoveHistoryStore = create<MoveHistoryStoreState>((set) => ({
  historyItems: [],
  selectedHalfMoveIndex: null,

  appendMoveHistory: (input: AppendMoveHistoryInput) => {
    set((state) => {
      const nextItem = buildMoveHistoryItem(state.historyItems, input);

      return {
        ...state,
        historyItems: [...state.historyItems, nextItem],
        selectedHalfMoveIndex: nextItem.halfMoveIndex,
      };
    });
  },

  selectHalfMove: (halfMoveIndex: number) => {
    set((state) => {
      const targetItem = state.historyItems[halfMoveIndex];

      if (!targetItem) {
        return state;
      }

      return { ...state, selectedHalfMoveIndex: halfMoveIndex };
    });
  },

  clearMoveHistory: () => {
    set((state) => {
      return {
        ...state,
        historyItems: [],
        selectedHalfMoveIndex: null,
      };
    });
  },
}));

const buildMoveHistoryItem: BuildMoveHistoryItem = (
  historyItems: readonly MoveHistoryItem[],
  input: AppendMoveHistoryInput,
) => ({
  halfMoveIndex: historyItems.length,
  moveNumber: input.beforeState.fullmoveNumber,
  san: input.san,
  move: input.move,
  beforeState: input.beforeState,
  afterState: input.afterState,
  side: input.beforeState.turn,
});

export const groupMoveHistoryRows = (
  historyItems: readonly MoveHistoryItem[],
): MoveHistoryRow[] => {
  const rows: MoveHistoryRow[] = [];

  for (const item of historyItems) {
    const existingRow = rows.at(-1);

    if (!existingRow || existingRow.moveNumber !== item.moveNumber) {
      rows.push({
        moveNumber: item.moveNumber,
        white: item.side === COLOR.WHITE ? item : null,
        black: item.side === COLOR.BLACK ? item : null,
      });

      continue;
    }

    if (item.side === COLOR.WHITE) {
      existingRow.white = item;
      continue;
    }

    existingRow.black = item;
  }

  return rows;
};

export const selectMoveHistoryItems = (state: MoveHistoryStoreState) => state.historyItems;

export const selectSelectedHalfMoveIndex = (state: MoveHistoryStoreState) =>
  state.selectedHalfMoveIndex;

export const selectSelectedMoveHistoryItem = (state: MoveHistoryStoreState) => {
  if (state.selectedHalfMoveIndex === null) {
    return null;
  }

  return state.historyItems[state.selectedHalfMoveIndex] ?? null;
};

export const selectSelectedMoveHistoryBoard = (state: MoveHistoryStoreState) =>
  selectSelectedMoveHistoryItem(state)?.afterState.board ?? null;

export const selectAppendMoveHistory = (state: MoveHistoryStoreState) => state.appendMoveHistory;

export const selectSelectHalfMove = (state: MoveHistoryStoreState) => state.selectHalfMove;

export const selectClearMoveHistory = (state: MoveHistoryStoreState) => state.clearMoveHistory;
