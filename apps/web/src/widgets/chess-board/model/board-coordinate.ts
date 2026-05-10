import { type Square } from '@chess-db/shared';

export type BoardOrientation = 'white' | 'black';

const createDisplaySquares = () => {
  const displaySquares = [] as Square[];
  for (let rank = 7; rank >= 0; rank--) {
    for (let file = 0; file < 8; file++) {
      displaySquares.push(calculateSquare(rank, file));
    }
  }

  return displaySquares;
};

const calculateSquare = (rank: number, file: number): Square => (rank * 8 + file) as Square;

export const WHITE_ORIENTATION_DISPLAY_SQUARES = createDisplaySquares();
export const BLACK_ORIENTATION_DISPLAY_SQUARES = [...WHITE_ORIENTATION_DISPLAY_SQUARES].reverse();
export const DISPLAY_SQUARES = WHITE_ORIENTATION_DISPLAY_SQUARES;

export const getDisplaySquares = (orientation: BoardOrientation): readonly Square[] => {
  return orientation === 'white'
    ? WHITE_ORIENTATION_DISPLAY_SQUARES
    : BLACK_ORIENTATION_DISPLAY_SQUARES;
};

export const toSquareLabel = (square: Square) => {
  const rank = Math.floor(square / 8) + 1;
  const file = (square % 8) + 1;

  return `${String.fromCharCode('a'.charCodeAt(0) + file - 1)}${rank}`;
};

export const getSquareTone = (square: Square) => {
  const fileIndex = square % 8;
  const rankIndex = Math.floor(square / 8);

  return (fileIndex + rankIndex) % 2 === 0 ? 'dark' : 'light';
};
