# TASK-066 전역 TypeScript 베이스 설정 작성

## 상위 Feature

- [FEATURE-007 모노레포 전역 인프라 구축](../features/FEATURE-007.md)

## 목적

- 모든 패키지와 앱에서 공통으로 상속받아 사용할 전역 TypeScript 기본 설정을 정의한다.

## 완료 조건

- [ ] 루트 경로에 `tsconfig.base.json` (또는 `packages/tsconfig`) 파일이 생성되어야 한다.
- [ ] `strict: true`, `esModuleInterop: true`, `skipLibCheck: true` 등 권장되는 기본 옵션이 포함되어야 한다.
- [ ] 각 앱(Web, API) 환경에 맞는 개별 설정을 확장할 수 있는 구조여야 한다.

## 참고 사항

- 각 패키지/앱의 `tsconfig.json`은 이 베이스 설정을 `extends`하여 사용하게 된다.
