import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { useCreateRepository } from './use-create-repository';

describe('useCreateRepository', () => {
  it('초기 상태는 빈 이름이고 제출할 수 없어야 한다', () => {
    const { result } = renderHook(() => useCreateRepository());

    expect(result.current.repositoryName).toBe('');
    expect(result.current.nameError).toBeNull();
    expect(result.current.canSubmit).toBe(false);
  });

  it('공백만 입력하면 에러를 노출하고 제출할 수 없어야 한다', () => {
    const { result } = renderHook(() => useCreateRepository());

    act(() => {
      result.current.setRepositoryName('   ');
    });

    expect(result.current.repositoryName).toBe('   ');
    expect(result.current.nameError).toBe('저장소 이름을 입력하세요.');
    expect(result.current.canSubmit).toBe(false);
  });

  it('유효한 이름이면 에러 없이 제출할 수 있어야 한다', () => {
    const { result } = renderHook(() => useCreateRepository());

    act(() => {
      result.current.setRepositoryName('오프닝 저장소');
    });

    expect(result.current.repositoryName).toBe('오프닝 저장소');
    expect(result.current.nameError).toBeNull();
    expect(result.current.canSubmit).toBe(true);
  });

  it('resetCreateRepositoryForm은 입력 상태를 초기화해야 한다', () => {
    const { result } = renderHook(() => useCreateRepository());

    act(() => {
      result.current.setRepositoryName('오프닝 저장소');
      result.current.resetCreateRepositoryForm();
    });

    expect(result.current.repositoryName).toBe('');
    expect(result.current.nameError).toBeNull();
    expect(result.current.canSubmit).toBe(false);
  });
});
