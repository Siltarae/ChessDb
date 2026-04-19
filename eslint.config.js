import { configs } from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import { configs as _configs, config } from 'typescript-eslint';

export default config(
  configs.recommended,
  ..._configs.recommended,
  eslintConfigPrettier,
  {
    // 타입 기반 규칙(네이밍 컨벤션 등)을 위한 설정 추가
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      '@typescript-eslint/consistent-type-imports': 'error',
      'no-console': 'warn',
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'default',
          format: ['camelCase'],
          leadingUnderscore: 'allow',
          trailingUnderscore: 'allow',
        },
        {
          selector: 'variable',
          format: ['camelCase', 'UPPER_CASE'],
          leadingUnderscore: 'allow',
          trailingUnderscore: 'allow',
        },
        {
          selector: 'typeLike',
          format: ['PascalCase'],
        },
      ],
    },
  },
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/.turbo/**',
      '**/.next/**',
      '**/coverage/**',
      'eslint.config.js', // 설정 파일 자체는 규칙에서 제외 (CJS require 등 때문)
    ],
  },
);
