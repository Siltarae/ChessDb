import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Button } from './button';

describe('Button', () => {
  it('기본 button 요소와 variant 정보를 렌더링해야 한다', () => {
    render(<Button>저장</Button>);

    const button = screen.getByRole('button', { name: '저장' });
    expect(button).toHaveAttribute('data-slot', 'button');
    expect(button).toHaveAttribute('data-variant', 'default');
    expect(button).toHaveAttribute('data-size', 'default');
  });

  it('asChild가 true이면 자식 요소를 버튼 스타일 대상으로 사용해야 한다', () => {
    render(
      <Button asChild variant="outline" size="sm">
        <a href="/games">기보</a>
      </Button>,
    );

    const link = screen.getByRole('link', { name: '기보' });
    expect(link).toHaveAttribute('href', '/games');
    expect(link).toHaveAttribute('data-slot', 'button');
    expect(link).toHaveAttribute('data-variant', 'outline');
    expect(link).toHaveAttribute('data-size', 'sm');
  });
});
