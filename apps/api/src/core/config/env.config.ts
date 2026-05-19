import { z } from 'zod';

export const envSchema = z.object({
  DATABASE_URL: z.url(),
  PORT: z.coerce.number().int().positive().default(3000),
  ALLOWED_ORIGINS: z.string().default(''),
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
});

export type EnvConfig = z.infer<typeof envSchema>;

export function parseEnv(config: Record<string, unknown>): EnvConfig {
  return envSchema.parse(config);
}
