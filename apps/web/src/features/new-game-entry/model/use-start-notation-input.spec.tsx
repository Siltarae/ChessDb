import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useStartNotationInput } from './use-start-notation-input';

const navigateMock = vi.fn();

vi.mock('react-router', () => ({
  useNavigate: () => navigateMock,
}));

describe('useStartNotationInput', () => {
  beforeEach(() => {
    navigateMock.mockClear();
  });

  it('새 기보 작성 버튼 클릭 시 입력 뷰로 navigate한다', () => {
    const { result } = renderHook(() => useStartNotationInput({ hasDraftToReplace: false }));

    act(() => {
      result.current.startNotationInput('repository-1');
    });

    expect(navigateMock).toHaveBeenCalledWith('/repositories/repository-1/new');
  });

  it('기존 초안이 있으면 확인 흐름을 먼저 호출한다', () => {
    const { result } = renderHook(() => useStartNotationInput({ hasDraftToReplace: true }));

    act(() => {
      result.current.startNotationInput('repository-1');
    });

    expect(result.current.isDraftReplaceDialogOpen).toBe(true);
    expect(navigateMock).not.toHaveBeenCalled();

    act(() => {
      result.current.confirmDraftReplace();
    });

    expect(navigateMock).toHaveBeenCalledWith('/repositories/repository-1/new');
  });
});
