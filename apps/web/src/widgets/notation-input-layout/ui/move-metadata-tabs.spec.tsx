import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { useDraftStore } from '@/entities/draft';
import { useMoveHistoryStore } from '@/entities/move-history';
import { MoveMetadataTabs } from './move-metadata-tabs';

beforeEach(() => {
  useMoveHistoryStore.getState().clearMoveHistory();
  useDraftStore.getState().clearDraftComments();
  useDraftStore.getState().clearDraftAnnotations();
});

afterEach(() => {
  cleanup();
});

describe('MoveMetadataTabs', () => {
  it('후속 메타데이터 작업을 위한 탭 껍데기와 코멘트 패널을 렌더링해야 한다', () => {
    render(<MoveMetadataTabs />);

    const tablist = screen.getByRole('tablist', { name: '메타데이터 탭' });
    expect(within(tablist).getAllByRole('tab').map((tab) => tab.textContent)).toEqual([
      'SAN',
      '코멘트',
      '평가',
      '기보 정보',
    ]);
    expect(within(tablist).getByRole('tab', { name: '코멘트' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(screen.getByRole('tabpanel', { name: '코멘트' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: '선택 수 코멘트' })).toBeInTheDocument();
  });

  it('평가 탭을 선택하면 평가 기호 선택 UI를 렌더링해야 한다', () => {
    render(<MoveMetadataTabs />);

    fireEvent.click(screen.getByRole('tab', { name: '평가' }));

    expect(screen.getByRole('tab', { name: '평가', selected: true })).toBeInTheDocument();
    expect(screen.getByRole('tabpanel', { name: '평가' })).toBeInTheDocument();
    expect(screen.getByRole('group', { name: '평가 기호 선택' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '매우 좋은 수' })).toBeInTheDocument();
  });

  it('기보 정보 탭을 선택하면 기보 정보 편집 UI를 렌더링해야 한다', () => {
    render(<MoveMetadataTabs />);

    fireEvent.click(screen.getByRole('tab', { name: '기보 정보' }));

    expect(screen.getByRole('tab', { name: '기보 정보', selected: true })).toBeInTheDocument();
    expect(screen.getByRole('tabpanel', { name: '기보 정보' })).toBeInTheDocument();
    expect(screen.getByRole('group', { name: '기보 결과 선택' })).toBeInTheDocument();
    expect(screen.getByRole('group', { name: '종료 사유 선택' })).toBeInTheDocument();
    expect(screen.getByText('결과를 먼저 선택하세요.')).toBeInTheDocument();
  });
});
