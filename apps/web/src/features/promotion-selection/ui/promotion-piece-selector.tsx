import { cn } from '@/shared/lib/utils';
import { ChessPiece } from '@/widgets/chess-board/ui/chess-piece';
import { COLOR, PIECE_TYPE, type Color, type PromotionPieceType } from '@chess-db/shared';

export type PromotionCandidate = {
  promotion: PromotionPieceType;
};

type PromotionPieceSelectorProps = {
  side: Color;
  candidates: PromotionCandidate[];
  onSelectPromotionPiece: (promotion: PromotionPieceType) => void;
};

export const PromotionPieceSelector = ({
  side,
  candidates,
  onSelectPromotionPiece,
}: PromotionPieceSelectorProps) => {
  const orderedCandidates = getOrderedCandidates(side, candidates);

  if (orderedCandidates.length === 0) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-label="프로모션 기물 선택"
      className="z-20 flex w-full flex-col rounded-sm border border-primary/70 bg-popover text-popover-foreground shadow-lg"
    >
      <div className="sr-only">승격할 기물을 선택하세요.</div>

      {orderedCandidates.map((candidate) => {
        const promotionLabel = getPromotionLabel(candidate.promotion);

        return (
          <button
            key={candidate.promotion}
            type="button"
            aria-label={`${promotionLabel} 승격`}
            className={cn(
              'flex aspect-square w-full items-center justify-center border border-border bg-background p-1',
              'hover:bg-accent hover:text-accent-foreground',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            )}
            onClick={() => onSelectPromotionPiece(candidate.promotion)}
          >
            <ChessPiece piece={{ type: candidate.promotion, color: side }} />
          </button>
        );
      })}
    </div>
  );
};

const getOrderedCandidates = (side: Color, candidates: PromotionCandidate[]) => {
  const promotionOrder = getPromotionOrder(side);

  return promotionOrder
    .map((promotion) => candidates.find((candidate) => candidate.promotion === promotion))
    .filter((candidate): candidate is PromotionCandidate => candidate !== undefined);
};

const getPromotionOrder = (side: Color): PromotionPieceType[] => {
  return side === COLOR.WHITE
    ? [PIECE_TYPE.QUEEN, PIECE_TYPE.KNIGHT, PIECE_TYPE.ROOK, PIECE_TYPE.BISHOP]
    : [PIECE_TYPE.BISHOP, PIECE_TYPE.ROOK, PIECE_TYPE.KNIGHT, PIECE_TYPE.QUEEN];
};

const getPromotionLabel = (promotion: PromotionPieceType) => {
  switch (promotion) {
    case PIECE_TYPE.QUEEN:
      return '퀸으로';
    case PIECE_TYPE.KNIGHT:
      return '나이트로';
    case PIECE_TYPE.ROOK:
      return '룩으로';
    case PIECE_TYPE.BISHOP:
      return '비숍으로';
  }
};
