import { z } from 'zod';
import {
  GAME_RECORD_RESULT,
  GAME_TERMINATION_REASON,
  MOVE_ANNOTATION,
  type GameMoveRecord,
  type GameRecord,
} from '../models/game-record.js';
import {
  MOVE_KIND,
  PIECE_TYPE,
  type Move,
  type PromotionPieceType,
  type Square,
} from '../models/game-state.js';

const ResultSchema = z.enum(GAME_RECORD_RESULT);
const TerminationReasonSchema = z.enum(GAME_TERMINATION_REASON).nullable();
const DateTimeSchema = z.iso.datetime();
const PlayedAtSchema = z.iso.date().nullable();
const SquareSchema: z.ZodType<Square> = z.number().int().min(0).max(63) as z.ZodType<Square>;
const AnnotationSchema = z.enum(MOVE_ANNOTATION).nullable();
const PromotionSchema: z.ZodType<PromotionPieceType> = z.union([
  z.literal(PIECE_TYPE.QUEEN),
  z.literal(PIECE_TYPE.ROOK),
  z.literal(PIECE_TYPE.BISHOP),
  z.literal(PIECE_TYPE.KNIGHT),
]);

const StandardMoveSchema = z
  .object({
    from: SquareSchema,
    to: SquareSchema,
    kind: z.union([
      z.literal(MOVE_KIND.NORMAL),
      z.literal(MOVE_KIND.DOUBLE_PAWN_PUSH),
      z.literal(MOVE_KIND.CASTLE_KING_SIDE),
      z.literal(MOVE_KIND.CASTLE_QUEEN_SIDE),
    ]),
    promotion: PromotionSchema.optional(),
  })
  .strict();

const EnPassantMoveSchema = z
  .object({
    from: SquareSchema,
    to: SquareSchema,
    kind: z.literal(MOVE_KIND.EN_PASSANT),
    capturedSquare: SquareSchema,
  })
  .strict();

const MoveSchema: z.ZodType<Move> = z.union([StandardMoveSchema, EnPassantMoveSchema]);

export const GameMoveRecordSchema: z.ZodType<GameMoveRecord> = z.object({
  id: z.uuid(),
  gameId: z.uuid(),
  halfMoveIndex: z.number(),
  san: z.string(),
  move: MoveSchema,
  comment: z.string().nullable(),
  annotation: AnnotationSchema,
  createdAt: DateTimeSchema,
  updatedAt: DateTimeSchema,
});

export const GameRecordSchema: z.ZodType<GameRecord> = z
  .object({
    id: z.uuid(),
    result: ResultSchema,
    terminationReason: TerminationReasonSchema,
    playedAt: PlayedAtSchema.nullable(),
    createdAt: DateTimeSchema,
    updatedAt: DateTimeSchema,
    moves: z.array(GameMoveRecordSchema),
  })
  .superRefine((gameRecord, ctx) => {
    if (gameRecord.result === 'ONGOING' && gameRecord.terminationReason !== null) {
      ctx.addIssue({
        code: 'custom',
        path: ['terminationReason'],
        message: 'ONGOING result must have null terminationReason',
      });
    }

    if (gameRecord.result !== 'ONGOING' && gameRecord.terminationReason === null) {
      ctx.addIssue({
        code: 'custom',
        path: ['terminationReason'],
        message: 'Finished result must have non-null terminationReason',
      });
    }
  });
