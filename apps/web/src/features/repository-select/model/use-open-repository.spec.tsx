import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useOpenRepository } from './use-open-repository';

const navigateMock = vi.fn();

vi.mock('react-router', () => ({
  useNavigate: () => navigateMock,
}));

describe('useOpenRepository', () => {
  it('repositoryId 기반 경로로 navigate한다', () => {
    const { result } = renderHook(() => useOpenRepository());

    result.current('repository-1');

    expect(navigateMock).toHaveBeenCalledWith('/repositories/repository-1');
  });
});
