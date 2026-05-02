import { SQUARE } from '@chess-db/shared';
import { describe, expect, it } from 'vitest';

import {
  getSourceSquareFromDndOperation,
  getTargetSquareFromDndOperation,
  parseDraggablePieceId,
  parseDroppableSquareId,
  toDraggablePieceId,
  toDroppableSquareId,
} from './board-dnd-id';

type SourceOperation = Parameters<typeof getSourceSquareFromDndOperation>[0];
type TargetOperation = Parameters<typeof getTargetSquareFromDndOperation>[0];

describe('board dnd id helper', () => {
  describe('toDraggablePieceId', () => {
    it('출발 칸을 draggable piece id로 변환해야 한다', () => {
      expect(toDraggablePieceId(SQUARE.E2)).toBe(`piece:${SQUARE.E2}`);
      expect(toDraggablePieceId(SQUARE.A1)).toBe(`piece:${SQUARE.A1}`);
    });
  });

  describe('toDroppableSquareId', () => {
    it('도착 후보 칸을 droppable square id로 변환해야 한다', () => {
      expect(toDroppableSquareId(SQUARE.E4)).toBe(`square:${SQUARE.E4}`);
      expect(toDroppableSquareId(SQUARE.H8)).toBe(`square:${SQUARE.H8}`);
    });
  });

  describe('parseDraggablePieceId', () => {
    it('draggable piece id에서 출발 칸을 복원해야 한다', () => {
      expect(parseDraggablePieceId(`piece:${SQUARE.E2}`)).toBe(SQUARE.E2);
      expect(parseDraggablePieceId(`piece:${SQUARE.H8}`)).toBe(SQUARE.H8);
    });

    it('droppable square id는 거부해야 한다', () => {
      expect(parseDraggablePieceId(`square:${SQUARE.E2}`)).toBeNull();
    });

    it('문자열이 아닌 dnd id는 거부해야 한다', () => {
      expect(parseDraggablePieceId(SQUARE.E2)).toBeNull();
    });

    it('보드 범위 밖 square 값은 거부해야 한다', () => {
      expect(parseDraggablePieceId('piece:-1')).toBeNull();
      expect(parseDraggablePieceId('piece:64')).toBeNull();
    });

    it('숫자로만 파싱되지 않는 id는 거부해야 한다', () => {
      expect(parseDraggablePieceId('piece:e2')).toBeNull();
      expect(parseDraggablePieceId('piece:4.5')).toBeNull();
    });
  });

  describe('parseDroppableSquareId', () => {
    it('droppable square id에서 도착 칸을 복원해야 한다', () => {
      expect(parseDroppableSquareId(`square:${SQUARE.E4}`)).toBe(SQUARE.E4);
      expect(parseDroppableSquareId(`square:${SQUARE.A1}`)).toBe(SQUARE.A1);
    });

    it('draggable piece id는 거부해야 한다', () => {
      expect(parseDroppableSquareId(`piece:${SQUARE.E4}`)).toBeNull();
    });

    it('문자열이 아닌 dnd id는 거부해야 한다', () => {
      expect(parseDroppableSquareId(SQUARE.E4)).toBeNull();
    });

    it('보드 범위 밖 square 값은 거부해야 한다', () => {
      expect(parseDroppableSquareId('square:-1')).toBeNull();
      expect(parseDroppableSquareId('square:64')).toBeNull();
    });

    it('숫자로만 파싱되지 않는 id는 거부해야 한다', () => {
      expect(parseDroppableSquareId('square:e4')).toBeNull();
      expect(parseDroppableSquareId('square:4.5')).toBeNull();
    });
  });

  describe('getSourceSquareFromDndOperation', () => {
    it('source data에서 출발 칸을 우선 복원해야 한다', () => {
      const operation = {
        source: {
          id: `piece:${SQUARE.A1}`,
          data: {
            sourceSquare: SQUARE.E2,
          },
        },
      } as SourceOperation;

      expect(getSourceSquareFromDndOperation(operation)).toBe(SQUARE.E2);
    });

    it('source data가 없으면 source id에서 출발 칸을 복원해야 한다', () => {
      const operation = {
        source: {
          id: `piece:${SQUARE.E2}`,
          data: {},
        },
      } as SourceOperation;

      expect(getSourceSquareFromDndOperation(operation)).toBe(SQUARE.E2);
    });

    it('source data와 source id가 모두 유효하지 않으면 null을 반환해야 한다', () => {
      const operation = {
        source: {
          id: 'invalid-id',
          data: {},
        },
      } as SourceOperation;

      expect(getSourceSquareFromDndOperation(operation)).toBeNull();
    });
  });

  describe('getTargetSquareFromDndOperation', () => {
    it('target data에서 도착 칸을 우선 복원해야 한다', () => {
      const operation = {
        target: {
          id: `square:${SQUARE.A1}`,
          data: {
            targetSquare: SQUARE.E4,
          },
        },
      } as TargetOperation;

      expect(getTargetSquareFromDndOperation(operation)).toBe(SQUARE.E4);
    });

    it('target data가 없으면 target id에서 도착 칸을 복원해야 한다', () => {
      const operation = {
        target: {
          id: `square:${SQUARE.E4}`,
          data: {},
        },
      } as TargetOperation;

      expect(getTargetSquareFromDndOperation(operation)).toBe(SQUARE.E4);
    });

    it('target이 없으면 null을 반환해야 한다', () => {
      const operation = {
        target: null,
      } as TargetOperation;

      expect(getTargetSquareFromDndOperation(operation)).toBeNull();
    });

    it('target data와 target id가 모두 유효하지 않으면 null을 반환해야 한다', () => {
      const operation = {
        target: {
          id: 'invalid-id',
          data: {},
        },
      } as TargetOperation;

      expect(getTargetSquareFromDndOperation(operation)).toBeNull();
    });
  });
});
