import { fileURLToPath } from 'node:url';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import { defineConfig, globalIgnores } from 'eslint/config';
import rootConfig from '../../eslint.config.js';

const tsconfigRootDir = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig([
  ...rootConfig,
  globalIgnores([
    'dist',
    'coverage',
    'playwright-report',
    'test-results',
    'blob-report',
    'playwright/.cache',
    'playwright/.auth',
  ]),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [reactHooks.configs.flat.recommended, reactRefresh.configs.vite],
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        project: false,
        tsconfigRootDir,
      },
    },
    rules: {
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'default',
          format: ['camelCase'],
          leadingUnderscore: 'allow',
          trailingUnderscore: 'allow',
        },
        {
          selector: 'import',
          format: ['camelCase', 'PascalCase'],
        },
        {
          selector: 'variable',
          format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
          leadingUnderscore: 'allow',
          trailingUnderscore: 'allow',
        },
        {
          selector: 'function',
          format: ['camelCase', 'PascalCase'],
        },
        {
          selector: 'objectLiteralMethod',
          format: ['camelCase', 'PascalCase'],
        },
        {
          selector: 'objectLiteralProperty',
          modifiers: ['requiresQuotes'],
          format: null,
        },
        {
          selector: 'objectLiteralProperty',
          filter: {
            regex: '^[0-9]+$',
            match: true,
          },
          format: null,
        },
        {
          selector: 'objectLiteralProperty',
          format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
        },
        {
          selector: 'typeLike',
          format: ['PascalCase'],
        },
      ],
    },
  },
  {
    files: ['src/entities/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/features/**', '@/widgets/**', '@/pages/**', '@/app/**'],
              message: 'entities 레이어는 상위 FSD 레이어를 import할 수 없습니다.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/features/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/features/**', '@/widgets/**', '@/pages/**', '@/app/**'],
              message:
                'features 레이어는 다른 feature slice나 상위 FSD 레이어를 import하지 마세요.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/widgets/**/*.{ts,tsx}', 'src/pages/**/*.{ts,tsx}', 'src/app/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: [
                '@/entities/*/model/**',
                '@/entities/*/ui/**',
                '@/features/*/model/**',
                '@/features/*/ui/**',
                '@/widgets/*/model/**',
                '@/widgets/*/ui/**',
              ],
              message: '다른 FSD slice의 내부 세그먼트 대신 public API(index.ts)를 import하세요.',
            },
          ],
        },
      ],
    },
  },
]);
