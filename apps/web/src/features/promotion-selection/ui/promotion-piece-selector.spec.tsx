import { COLOR, PIECE_TYPE } from '@chess-db/shared';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { PromotionPieceSelector, type PromotionCandidate } from './promotion-piece-selector';

afterEach(() => {
  cleanup();
});

const ALL_PROMOTION_CANDIDATES: PromotionCandidate[] = [
  { promotion: PIECE_TYPE.QUEEN },
  { promotion: PIECE_TYPE.ROOK },
  { promotion: PIECE_TYPE.BISHOP },
  { promotion: PIECE_TYPE.KNIGHT },
];

const renderSelector = ({
  side = COLOR.WHITE,
  candidates = ALL_PROMOTION_CANDIDATES,
  onSelectPromotionPiece = vi.fn(),
}: Partial<React.ComponentProps<typeof PromotionPieceSelector>> = {}) => {
  render(
    <PromotionPieceSelector
      side={side}
      candidates={candidates}
      onSelectPromotionPiece={onSelectPromotionPiece}
    />,
  );

  return { onSelectPromotionPiece };
};

const getCandidateNames = () => {
  const dialog = screen.getByRole('dialog', { name: '프로모션 기물 선택' });

  return within(dialog)
    .getAllByRole('button')
    .map((button) => button.getAttribute('aria-label'));
};

describe('PromotionPieceSelector', () => {
  it('백 프로모션 후보를 Q-N-R-B 순서로 표시해야 한다', () => {
    renderSelector({ side: COLOR.WHITE });

    expect(getCandidateNames()).toEqual([
      '퀸으로 승격',
      '나이트로 승격',
      '룩으로 승격',
      '비숍으로 승격',
    ]);
  });

  it('흑 프로모션 후보를 B-R-N-Q 순서로 표시해야 한다', () => {
    renderSelector({ side: COLOR.BLACK });

    expect(getCandidateNames()).toEqual([
      '비숍으로 승격',
      '룩으로 승격',
      '나이트로 승격',
      '퀸으로 승격',
    ]);
  });

  it('후보 버튼은 ChessPiece 이미지를 사용하고 선택 값을 상위로 전달해야 한다', () => {
    const onSelectPromotionPiece = vi.fn();
    renderSelector({ side: COLOR.WHITE, onSelectPromotionPiece });

    expect(screen.getByAltText('white queen')).toBeInTheDocument();
    expect(screen.getByAltText('white knight')).toBeInTheDocument();
    expect(screen.getByAltText('white rook')).toBeInTheDocument();
    expect(screen.getByAltText('white bishop')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: '나이트로 승격' }));

    expect(onSelectPromotionPiece).toHaveBeenCalledWith(PIECE_TYPE.KNIGHT);
  });

  it('후보가 없으면 선택 UI를 렌더링하지 않아야 한다', () => {
    renderSelector({ candidates: [] });

    expect(screen.queryByRole('dialog', { name: '프로모션 기물 선택' })).not.toBeInTheDocument();
  });

  it('전달된 후보만 렌더링해야 한다', () => {
    const candidates: PromotionCandidate[] = [
      { promotion: PIECE_TYPE.QUEEN },
      { promotion: PIECE_TYPE.KNIGHT },
    ];

    renderSelector({ candidates });

    expect(getCandidateNames()).toEqual(['퀸으로 승격', '나이트로 승격']);
  });
});
