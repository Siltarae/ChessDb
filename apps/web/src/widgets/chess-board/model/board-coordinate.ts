import { type Square } from '@chess-db/shared';

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

export const DISPLAY_SQUARES = createDisplaySquares();

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
