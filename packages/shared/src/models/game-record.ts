import type { Move } from './game-state.js';

export const GAME_RECORD_RESULT = {
  ONGOING: 'ONGOING',
  WHITE_WIN: 'WHITE_WIN',
  BLACK_WIN: 'BLACK_WIN',
  DRAW: 'DRAW',
} as const;
export type GameRecordResult = (typeof GAME_RECORD_RESULT)[keyof typeof GAME_RECORD_RESULT];

export const GAME_TERMINATION_REASON = {
  CHECKMATE: 'CHECKMATE',
  STALEMATE: 'STALEMATE',
  FIFTY_MOVE: 'FIFTY_MOVE',
  THREEFOLD_REPETITION: 'THREEFOLD_REPETITION',
  INSUFFICIENT_MATERIAL: 'INSUFFICIENT_MATERIAL',
  RESIGNATION: 'RESIGNATION',
  TIMEOUT: 'TIMEOUT',
  AGREEMENT: 'AGREEMENT',
  OTHER: 'OTHER',
} as const;
export type GameTerminationReason =
  (typeof GAME_TERMINATION_REASON)[keyof typeof GAME_TERMINATION_REASON];

export const MOVE_ANNOTATION = {
  BRILLIANT: 'BRILLIANT',
  GOOD: 'GOOD',
  INTERESTING: 'INTERESTING',
  DUBIOUS: 'DUBIOUS',
  MISTAKE: 'MISTAKE',
  BLUNDER: 'BLUNDER',
} as const;
export type MoveAnnotation = (typeof MOVE_ANNOTATION)[keyof typeof MOVE_ANNOTATION];

export interface GameMoveRecord {
  readonly id: string;
  readonly gameId: string;
  readonly halfMoveIndex: number;
  readonly san: string;
  readonly move: Move;
  readonly comment: string | null;
  readonly annotation: MoveAnnotation | null;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface GameRecord {
  readonly id: string;
  readonly result: GameRecordResult;
  readonly terminationReason: GameTerminationReason | null;
  readonly playedAt: string | null;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly moves: readonly GameMoveRecord[];
}
