import { describe, expect, it } from 'vitest';

import { resolveApiBaseUrl } from './env';

describe('resolveApiBaseUrl', () => {
  it('API base URL이 정의되어 있으면 그 값을 사용해야 한다', () => {
    expect(resolveApiBaseUrl('http://localhost:3000')).toBe('http://localhost:3000');
  });

  it('명시적인 빈 문자열은 same-origin API base URL로 허용해야 한다', () => {
    expect(resolveApiBaseUrl('')).toBe('');
  });

  it('API base URL이 정의되지 않으면 설정 오류를 던져야 한다', () => {
    expect(() => resolveApiBaseUrl(undefined)).toThrow('VITE_API_BASE_URL is required');
  });
});
