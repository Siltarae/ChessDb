import { z } from 'zod';

// [TASK-059] 고성능 숫자 기반 체스 데이터 모델 (최소 스켈레톤)

export const COLOR = {
  WHITE: 0,
  BLACK: 1,
} as const;
export type Color = (typeof COLOR)[keyof typeof COLOR];

export const PIECE_TYPE = {
  NONE: 0,
  PAWN: 1,
  KNIGHT: 2,
  BISHOP: 3,
  ROOK: 4,
  QUEEN: 5,
  KING: 6,
} as const;
export type PieceType = (typeof PIECE_TYPE)[keyof typeof PIECE_TYPE];

export interface Piece {
  readonly type: PieceType;
  readonly color: Color;
}

export type Board = readonly (Piece | null)[];

export const SQUARE = {
  A1: 0,
  B1: 1,
  C1: 2,
  D1: 3,
  E1: 4,
  F1: 5,
  G1: 6,
  H1: 7,
  A2: 8,
  B2: 9,
  C2: 10,
  D2: 11,
  E2: 12,
  F2: 13,
  G2: 14,
  H2: 15,
  A3: 16,
  B3: 17,
  C3: 18,
  D3: 19,
  E3: 20,
  F3: 21,
  G3: 22,
  H3: 23,
  A4: 24,
  B4: 25,
  C4: 26,
  D4: 27,
  E4: 28,
  F4: 29,
  G4: 30,
  H4: 31,
  A5: 32,
  B5: 33,
  C5: 34,
  D5: 35,
  E5: 36,
  F5: 37,
  G5: 38,
  H5: 39,
  A6: 40,
  B6: 41,
  C6: 42,
  D6: 43,
  E6: 44,
  F6: 45,
  G6: 46,
  H6: 47,
  A7: 48,
  B7: 49,
  C7: 50,
  D7: 51,
  E7: 52,
  F7: 53,
  G7: 54,
  H7: 55,
  A8: 56,
  B8: 57,
  C8: 58,
  D8: 59,
  E8: 60,
  F8: 61,
  G8: 62,
  H8: 63,
} as const;
export type Square = (typeof SQUARE)[keyof typeof SQUARE];

export const FILE = {
  A: 0,
  B: 1,
  C: 2,
  D: 3,
  E: 4,
  F: 5,
  G: 6,
  H: 7,
} as const;
export type File = (typeof FILE)[keyof typeof FILE];

export const RANK = {
  '1': 0,
  '2': 1,
  '3': 2,
  '4': 3,
  '5': 4,
  '6': 5,
  '7': 6,
  '8': 7,
} as const;
export type Rank = (typeof RANK)[keyof typeof RANK];

export const CASTLE = {
  WHITE_KING_SIDE: 1,
  WHITE_QUEEN_SIDE: 2,
  BLACK_KING_SIDE: 4,
  BLACK_QUEEN_SIDE: 8,
} as const;
export type Castle = (typeof CASTLE)[keyof typeof CASTLE];

export interface GameState {
  readonly board: Board;
  readonly turn: Color;
  readonly castlingRights: number;
  readonly enPassantSquare: number | null;
  readonly halfmoveClock: number;
  readonly fullmoveNumber: number;
}

export const GameStateSchema: z.ZodType<GameState> = z.object({
  board: z
    .array(
      z.union([
        z.literal(null),
        z.object({
          type: z.enum(PIECE_TYPE),
          color: z.enum(COLOR),
        }),
      ]),
    )
    .length(64),
  turn: z.enum(COLOR),
  castlingRights: z.number(),
  enPassantSquare: z.number().nullable(),
  halfmoveClock: z.number(),
  fullmoveNumber: z.number(),
});
