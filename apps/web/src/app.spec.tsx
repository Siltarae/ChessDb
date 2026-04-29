import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { App } from './app';

describe('App', () => {
  it('루트 라우트에서 기보 입력 화면을 렌더링해야 한다', () => {
    window.history.pushState({}, '', '/');

    render(<App />);

    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('region', { name: '기보 입력 보드 영역' })).toBeInTheDocument();
    expect(
      screen.getByRole('complementary', { name: '기보 입력 사이드 패널' }),
    ).toBeInTheDocument();
  });
});
