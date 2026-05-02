import { COLOR, PIECE_TYPE, SQUARE, createInitialGameState } from '@chess-db/shared';
import { cleanup, fireEvent, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import blackKing from '@/entities/piece/assets/pieces/black-king.svg';
import blackQueen from '@/entities/piece/assets/pieces/black-queen.svg';
import { ChessPiece } from '@/entities/piece';
import whiteKing from '@/entities/piece/assets/pieces/white-king.svg';
import whiteRook from '@/entities/piece/assets/pieces/white-rook.svg';
import { ChessBoard } from './chess-board';

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

const renderChessBoard = (props: Partial<React.ComponentProps<typeof ChessBoard>> = {}) => {
  const boardState = props.boardState ?? createInitialGameState().board;

  return render(
    <ChessBoard
      boardState={boardState}
      highlightSquares={props.highlightSquares ?? []}
      selectedSquare={props.selectedSquare ?? null}
      onSquareClick={props.onSquareClick ?? (() => {})}
      lastMove={props.lastMove ?? null}
      checkedKingSquare={props.checkedKingSquare ?? null}
    />,
  );
};

describe('ChessBoard', () => {
  describe('표준 시작 boardState를 렌더링할 때', () => {
    it('64개 칸과 32개 기물을 표시해야 한다', () => {
      const { container } = renderChessBoard();

      expect(container.querySelectorAll('[data-square]')).toHaveLength(64);
      expect(container.querySelectorAll('img')).toHaveLength(32);
    });

    it('흰색 기준으로 위쪽 a8부터 아래쪽 h1까지 칸을 배치해야 한다', () => {
      const { container } = renderChessBoard();

      const squares = Array.from(container.querySelectorAll('[data-square]')).map((square) =>
        square.getAttribute('data-square'),
      );

      expect(squares[0]).toBe('a8');
      expect(squares[7]).toBe('h8');
      expect(squares[56]).toBe('a1');
      expect(squares[63]).toBe('h1');
    });

    it('a1은 어두운 칸이고 h1은 밝은 칸이어야 한다', () => {
      const { container } = renderChessBoard();

      expect(getSquare(container, 'a1')).toHaveAttribute('data-tone', 'dark');
      expect(getSquare(container, 'h1')).toHaveAttribute('data-tone', 'light');
    });

    it('주요 시작 위치에 맞는 SVG 기물을 표시해야 한다', () => {
      const { container } = renderChessBoard();

      expect(getSquare(container, 'a1').querySelector('img')).toHaveAttribute('src', whiteRook);
      expect(getSquare(container, 'e1').querySelector('img')).toHaveAttribute('src', whiteKing);
      expect(getSquare(container, 'd8').querySelector('img')).toHaveAttribute('src', blackQueen);
      expect(getSquare(container, 'e8').querySelector('img')).toHaveAttribute('src', blackKing);
    });
  });

  describe('선택과 합법 수 하이라이트를 렌더링할 때', () => {
    it('selectedSquare 칸에 선택 배경 class를 적용해야 한다', () => {
      const { container } = renderChessBoard({ selectedSquare: SQUARE.G1 });

      expect(getSquare(container, 'g1')).toHaveClass('bg-square-selected');
    });

    it('빈 합법 수 칸에는 legal 배경 class를 적용해야 한다', () => {
      const { container } = renderChessBoard({ highlightSquares: [SQUARE.F3] });

      expect(getSquare(container, 'f3')).toHaveClass('bg-square-legal');
      expect(getSquare(container, 'f3')).not.toHaveClass('bg-square-capture');
    });

    it('기물이 있는 합법 수 칸에는 capture 배경 class를 적용해야 한다', () => {
      const { container } = renderChessBoard({ highlightSquares: [SQUARE.E2] });

      expect(getSquare(container, 'e2')).toHaveClass('bg-square-capture');
      expect(getSquare(container, 'e2')).not.toHaveClass('bg-square-legal');
    });

    it('칸 클릭 시 해당 Square 값을 상위 콜백으로 전달해야 한다', () => {
      const onSquareClick = vi.fn();
      const { container } = renderChessBoard({ onSquareClick });

      fireEvent.click(getSquare(container, 'g1'));

      expect(onSquareClick).toHaveBeenCalledWith(SQUARE.G1);
    });

    it('마지막 착수의 출발 칸과 도착 칸에 last move class를 적용해야 한다', () => {
      const { container } = renderChessBoard({
        lastMove: { from: SQUARE.E2, to: SQUARE.E4 },
      });

      expect(getSquare(container, 'e2')).toHaveClass('bg-square-last-move');
      expect(getSquare(container, 'e4')).toHaveClass('bg-square-last-move');
      expect(getSquare(container, 'e3')).not.toHaveClass('bg-square-last-move');
    });

    it('체크받은 왕 칸에 checked king class를 적용해야 한다', () => {
      const { container } = renderChessBoard({ checkedKingSquare: SQUARE.E1 });

      expect(getSquare(container, 'e1')).toHaveClass('bg-square-checked-king');
      expect(getSquare(container, 'e2')).not.toHaveClass('bg-square-checked-king');
    });

    it('체크받은 왕 칸 표시와 마지막 착수 표시가 같은 칸에서 공존해야 한다', () => {
      const { container } = renderChessBoard({
        checkedKingSquare: SQUARE.E1,
        lastMove: { from: SQUARE.E8, to: SQUARE.E1 },
      });

      expect(getSquare(container, 'e1')).toHaveClass('bg-square-checked-king');
      expect(getSquare(container, 'e1')).toHaveClass('bg-square-last-move');
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
