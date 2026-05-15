import { cleanup, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { MoveMetadataTabs } from './move-metadata-tabs';

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
});
