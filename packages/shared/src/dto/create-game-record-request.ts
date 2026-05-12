import { z } from 'zod';
import {
  GAME_RECORD_RESULT,
  GAME_TERMINATION_REASON,
  MOVE_ANNOTATION,
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

export const CreateGameMoveRecordRequestSchema = z
  .object({
    halfMoveIndex: z.number().int().nonnegative(),
    san: z.string().min(1),
    move: MoveSchema,
    comment: z.string().nullable(),
    annotation: AnnotationSchema,
  })
  .strict();

export const CreateGameRecordRequestSchema = z
  .object({
    result: ResultSchema,
    terminationReason: TerminationReasonSchema,
    playedAt: PlayedAtSchema,
    moves: z.array(CreateGameMoveRecordRequestSchema).min(1),
  })
  .strict()
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

export type CreateGameMoveRecordRequest = z.infer<typeof CreateGameMoveRecordRequestSchema>;
export type CreateGameRecordRequest = z.infer<typeof CreateGameRecordRequestSchema>;
