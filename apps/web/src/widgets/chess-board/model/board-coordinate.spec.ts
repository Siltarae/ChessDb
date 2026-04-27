import { SQUARE } from '@chess-db/shared';
import { describe, expect, it } from 'vitest';

import { DISPLAY_SQUARES, getSquareTone, toSquareLabel } from './board-coordinate';

describe('board-coordinate', () => {
  describe('DISPLAY_SQUARES로 화면 표시 순서를 만들 때', () => {
    it('위에서 아래로 8랭크부터 1랭크까지 64개 칸을 반환해야 한다', () => {
      expect(DISPLAY_SQUARES).toHaveLength(64);
      expect(DISPLAY_SQUARES[0]).toBe(SQUARE.A8);
      expect(DISPLAY_SQUARES[7]).toBe(SQUARE.H8);
      expect(DISPLAY_SQUARES[56]).toBe(SQUARE.A1);
      expect(DISPLAY_SQUARES[63]).toBe(SQUARE.H1);
    });
  });

  describe('toSquareLabel로 도메인 좌표를 표시명으로 바꿀 때', () => {
    it('대표 좌표를 파일과 랭크 표기 문자열로 변환해야 한다', () => {
      expect(toSquareLabel(SQUARE.A1)).toBe('a1');
      expect(toSquareLabel(SQUARE.E4)).toBe('e4');
      expect(toSquareLabel(SQUARE.H8)).toBe('h8');
    });
  });

  describe('getSquareTone으로 칸 색상을 계산할 때', () => {
    it('a1을 어두운 칸으로 두고 인접 칸은 반대 색상이어야 한다', () => {
      expect(getSquareTone(SQUARE.A1)).toBe('dark');
      expect(getSquareTone(SQUARE.B1)).toBe('light');
      expect(getSquareTone(SQUARE.A2)).toBe('light');
      expect(getSquareTone(SQUARE.H8)).toBe('dark');
    });
  });
});
