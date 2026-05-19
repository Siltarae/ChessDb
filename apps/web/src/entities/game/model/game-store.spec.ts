import {
  COLOR,
  PIECE_TYPE,
  SQUARE,
  createInitialGameState,
  positionFingerprint,
} from '@chess-db/shared';
import { beforeEach, describe, expect, it } from 'vitest';

import {
  buildRepetitionHistoryFromStates,
  selectApplyGameState,
  selectBoardState,
  selectCurrentTurn,
  selectGameState,
  selectHydrateGameState,
  selectRepetitionHistory,
  selectResetGameState,
  useGameStore,
} from './game-store';

describe('game-store', () => {
  beforeEach(() => {
    useGameStore.setState({
      gameState: createInitialGameState(),
      repetitionHistory: {},
    });
  });

  describe('useGameStore로 초기 상태를 만들 때', () => {
    it('shared 초기 GameState를 소비해 표준 시작 보드를 제공해야 한다', () => {
      const state = useGameStore.getState();
      const gameState = selectGameState(state);
      const boardState = selectBoardState(state);

      expect(gameState.turn).toBe(COLOR.WHITE);
      expect(boardState).toBe(gameState.board);
      expect(boardState).toHaveLength(64);
      expect(boardState[SQUARE.A1]).toEqual({ type: PIECE_TYPE.ROOK, color: COLOR.WHITE });
      expect(boardState[SQUARE.E8]).toEqual({ type: PIECE_TYPE.KING, color: COLOR.BLACK });
    });

    it('현재 턴 selector가 초기 턴을 백으로 제공해야 한다', () => {
      const currentTurn = selectCurrentTurn(useGameStore.getState());

      expect(currentTurn).toBe(COLOR.WHITE);
    });
  });

  describe('외부 GameState를 store에 반영할 때', () => {
    it('action selector로 다음 GameState 전체를 반영하고 현재 턴 selector도 같은 상태의 턴을 읽어야 한다', () => {
      const state = useGameStore.getState();
      const currentGameState = selectGameState(state);
      const applyGameState = selectApplyGameState(state);
      const nextGameState = {
        ...currentGameState,
        turn: COLOR.BLACK,
        fullmoveNumber: currentGameState.fullmoveNumber + 1,
      };

      applyGameState(nextGameState);

      const updatedState = useGameStore.getState();
      expect(selectGameState(updatedState)).toBe(nextGameState);
      expect(selectBoardState(updatedState)).toBe(nextGameState.board);
      expect(selectCurrentTurn(updatedState)).toBe(COLOR.BLACK);
    });

    it('반복 이력에는 현재 상태가 아니라 이동 직전 상태의 fingerprint를 누적해야 한다', () => {
      const state = useGameStore.getState();
      const currentGameState = selectGameState(state);
      const applyGameState = selectApplyGameState(state);
      const nextGameState = {
        ...currentGameState,
        turn: COLOR.BLACK,
      };

      applyGameState(nextGameState);

      const repetitionHistory = selectRepetitionHistory(useGameStore.getState());
      expect(repetitionHistory[positionFingerprint(currentGameState)]).toBe(1);
      expect(repetitionHistory[positionFingerprint(nextGameState)]).toBeUndefined();
    });
  });

  describe('저장된 GameState를 복원할 때', () => {
    it('저장된 GameState와 재구성된 반복 이력을 함께 반영해야 한다', () => {
      const state = useGameStore.getState();
      const currentGameState = selectGameState(state);
      const applyGameState = selectApplyGameState(state);
      const hydrateGameState = selectHydrateGameState(state);
      const nextGameState = {
        ...currentGameState,
        turn: COLOR.BLACK,
      };
      const restoredGameState = {
        ...currentGameState,
        fullmoveNumber: currentGameState.fullmoveNumber + 3,
      };
      const restoredRepetitionHistory = buildRepetitionHistoryFromStates([
        currentGameState,
        currentGameState,
      ]);

      applyGameState(nextGameState);
      hydrateGameState(restoredGameState, restoredRepetitionHistory);

      const updatedState = useGameStore.getState();
      expect(selectGameState(updatedState)).toBe(restoredGameState);
      expect(selectRepetitionHistory(updatedState)).toEqual(restoredRepetitionHistory);
    });

    it('반복 이력을 넘기지 않으면 빈 반복 이력으로 복원해야 한다', () => {
      const currentGameState = selectGameState(useGameStore.getState());
      const hydrateGameState = selectHydrateGameState(useGameStore.getState());
      const restoredGameState = {
        ...currentGameState,
        turn: COLOR.BLACK,
      };

      hydrateGameState(restoredGameState);

      const updatedState = useGameStore.getState();
      expect(selectGameState(updatedState)).toBe(restoredGameState);
      expect(selectRepetitionHistory(updatedState)).toEqual({});
    });

    it('GameState 목록의 fingerprint 기준으로 반복 이력을 재구성해야 한다', () => {
      const currentGameState = selectGameState(useGameStore.getState());
      const nextGameState = {
        ...currentGameState,
        turn: COLOR.BLACK,
      };

      const repetitionHistory = buildRepetitionHistoryFromStates([
        currentGameState,
        nextGameState,
        currentGameState,
      ]);

      expect(repetitionHistory[positionFingerprint(currentGameState)]).toBe(2);
      expect(repetitionHistory[positionFingerprint(nextGameState)]).toBe(1);
    });
  });

  describe('새 draft 기준으로 GameState를 초기화할 때', () => {
    it('표준 시작 상태와 빈 반복 이력으로 되돌려야 한다', () => {
      const state = useGameStore.getState();
      const currentGameState = selectGameState(state);
      const applyGameState = selectApplyGameState(state);
      const resetGameState = selectResetGameState(state);
      const nextGameState = {
        ...currentGameState,
        turn: COLOR.BLACK,
      };

      applyGameState(nextGameState);
      resetGameState();

      const updatedState = useGameStore.getState();
      const resetState = selectGameState(updatedState);
      expect(resetState).toEqual(createInitialGameState());
      expect(selectCurrentTurn(updatedState)).toBe(COLOR.WHITE);
      expect(selectBoardState(updatedState)[SQUARE.A1]).toEqual({
        type: PIECE_TYPE.ROOK,
        color: COLOR.WHITE,
      });
      expect(selectRepetitionHistory(updatedState)).toEqual({});
    });
  });
});
