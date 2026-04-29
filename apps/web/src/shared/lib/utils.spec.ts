import { describe, expect, it } from 'vitest';

import { cn } from './utils';

describe('cn', () => {
  it('조건부 className을 병합하고 Tailwind 충돌을 뒤쪽 값으로 정리해야 한다', () => {
    const isHidden = false;

    expect(cn('px-2', isHidden && 'hidden', 'px-4', ['text-sm'])).toBe('px-4 text-sm');
  });
});
