import { describe, it, expect } from 'vitest';
import { z } from 'zod';

describe('Shared Package Setup', () => {
  it('should run tests successfully', () => {
    expect(true).toBe(true);
  });

  it('should be able to use zod schema', () => {
    const schema = z.string();
    expect(schema.parse('hello')).toBe('hello');
    expect(() => schema.parse(123)).toThrow();
  });
});
