# TASK-068 Husky 및 lint-staged 커밋 훅 연결

## 상위 Feature

- [FEATURE-007 모노레포 전역 인프라 구축](../features/FEATURE-007.md)

## 목적

- 잘못된 코드가 커밋되는 것을 방지하기 위해 커밋 전 자동으로 린트와 포맷을 검사하는 시스템을 구축한다.

## 완료 조건

- [ ] `husky`가 설치되고 `.husky/pre-commit` 스크립트가 생성되어야 한다.
- [ ] `lint-staged`가 설치되고 루트 `package.json` 또는 별도 파일에 검사 규칙이 정의되어야 한다.
- [ ] 커밋 시 변경된 파일에 대해 `prettier`와 `eslint`가 정상 작동하는지 확인해야 한다.

## 참고 사항

- 초기에는 설정만 하고, 실제 검사 대상 파일은 이후 작업에서 늘려나간다.
