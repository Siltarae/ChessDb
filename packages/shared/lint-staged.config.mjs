import { baseConfig } from '../../tools/lint-staged/base.mjs';

export default {
  ...baseConfig,
  '*.ts': ['eslint --fix', 'prettier --write'],
};
