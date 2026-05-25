import {
  CreateGameRecordRequestSchema,
  GAME_RECORD_RESULT,
  type CreateGameRecordRequest,
} from '@chess-db/shared';

import type { DraftGameMetadata, DraftMoveAnnotation, DraftMoveComment } from '@/entities/draft';
import type { MoveHistoryItem } from '@/entities/move-history';

export type BuildCreateGameRecordRequestInput = {
  readonly repositoryId: string | null;
  readonly historyItems: readonly MoveHistoryItem[];
  readonly moveComments: readonly DraftMoveComment[];
  readonly moveAnnotations: readonly DraftMoveAnnotation[];
  readonly metadata: DraftGameMetadata;
};

export const buildCreateGameRecordRequest = (
  input: BuildCreateGameRecordRequestInput,
): CreateGameRecordRequest | null => {
  if (input.repositoryId === null) {
    return null;
  }

  if (input.historyItems.length === 0) {
    return null;
  }

  const result = input.metadata.result ?? GAME_RECORD_RESULT.ONGOING;

  const request = {
    repositoryId: input.repositoryId,
    result,
    terminationReason: input.metadata.result === null ? null : input.metadata.terminationReason,
    playedAt: input.metadata.playedAt,
    moves: input.historyItems.map((historyItem) => ({
      halfMoveIndex: historyItem.halfMoveIndex,
      san: historyItem.san,
      move: historyItem.move,
      comment: findMoveComment(input.moveComments, historyItem.halfMoveIndex),
      annotation: findMoveAnnotation(input.moveAnnotations, historyItem.halfMoveIndex),
    })),
  };

  const parseResult = CreateGameRecordRequestSchema.safeParse(request);

  if (!parseResult.success) {
    return null;
  }

  return {
    ...parseResult.data,
    terminationReason:
      parseResult.data.result === GAME_RECORD_RESULT.ONGOING
        ? null
        : parseResult.data.terminationReason,
  };
};

const findMoveComment = (
  moveComments: readonly DraftMoveComment[],
  halfMoveIndex: number,
): string | null => {
  return (
    moveComments.find((moveComment) => moveComment.halfMoveIndex === halfMoveIndex)?.comment ?? null
  );
};

const findMoveAnnotation = (
  moveAnnotations: readonly DraftMoveAnnotation[],
  halfMoveIndex: number,
) => {
  return (
    moveAnnotations.find((moveAnnotation) => moveAnnotation.halfMoveIndex === halfMoveIndex)
      ?.annotation ?? null
  );
};
