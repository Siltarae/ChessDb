module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // 제목(subject)의 대소문자 강제를 비활성화 (한국어 및 고유명사 사용을 위해)
    'subject-case': [0],
  },
};
