import { COLOR, PIECE_TYPE, createInitialGameState } from '@chess-db/shared';
import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import blackKing from '../assets/pieces/black-king.svg';
import blackQueen from '../assets/pieces/black-queen.svg';
import whiteKing from '../assets/pieces/white-king.svg';
import whiteRook from '../assets/pieces/white-rook.svg';
import { ChessBoard } from './chess-board';
import { ChessPiece } from './chess-piece';

afterEach(() => {
  cleanup();
});

const getSquare = (container: HTMLElement, square: string) => {
  const element = container.querySelector(`[data-square="${square}"]`);

  if (!(element instanceof HTMLElement)) {
    throw new Error(`${square} 칸을 찾을 수 없습니다.`);
  }

  return element;
};

describe('ChessBoard', () => {
  describe('표준 시작 boardState를 렌더링할 때', () => {
    it('64개 칸과 32개 기물을 표시해야 한다', () => {
      const { container } = render(<ChessBoard boardState={createInitialGameState().board} />);

      expect(container.querySelectorAll('[data-square]')).toHaveLength(64);
      expect(container.querySelectorAll('img')).toHaveLength(32);
    });

    it('흰색 기준으로 위쪽 a8부터 아래쪽 h1까지 칸을 배치해야 한다', () => {
      const { container } = render(<ChessBoard boardState={createInitialGameState().board} />);

      const squares = Array.from(container.querySelectorAll('[data-square]')).map((square) =>
        square.getAttribute('data-square'),
      );

      expect(squares[0]).toBe('a8');
      expect(squares[7]).toBe('h8');
      expect(squares[56]).toBe('a1');
      expect(squares[63]).toBe('h1');
    });

    it('a1은 어두운 칸이고 h1은 밝은 칸이어야 한다', () => {
      const { container } = render(<ChessBoard boardState={createInitialGameState().board} />);

      expect(getSquare(container, 'a1')).toHaveAttribute('data-tone', 'dark');
      expect(getSquare(container, 'h1')).toHaveAttribute('data-tone', 'light');
    });

    it('주요 시작 위치에 맞는 SVG 기물을 표시해야 한다', () => {
      const { container } = render(<ChessBoard boardState={createInitialGameState().board} />);

      expect(getSquare(container, 'a1').querySelector('img')).toHaveAttribute('src', whiteRook);
      expect(getSquare(container, 'e1').querySelector('img')).toHaveAttribute('src', whiteKing);
      expect(getSquare(container, 'd8').querySelector('img')).toHaveAttribute('src', blackQueen);
      expect(getSquare(container, 'e8').querySelector('img')).toHaveAttribute('src', blackKing);
    });
  });

  describe('기물 컴포넌트를 렌더링할 때', () => {
    it('기물이 없는 칸은 이미지를 렌더링하지 않아야 한다', () => {
      const { container } = render(<ChessPiece piece={null} />);

      expect(container.querySelector('img')).not.toBeInTheDocument();
    });

    it('표시 asset이 없는 기물은 이미지를 렌더링하지 않아야 한다', () => {
      const { container } = render(
        <ChessPiece piece={{ type: PIECE_TYPE.NONE, color: COLOR.WHITE }} />,
      );

      expect(container.querySelector('img')).not.toBeInTheDocument();
    });
  });
});
