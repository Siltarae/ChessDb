# TASK-086 packages/shared 패키지 초기화 및 기본 도메인 정의

## 상세 구현 지침

- [구현 지침서 (Phase 3)](../../tasks/TASK-086.md)

## 상위 Feature

- [FEATURE-001 공통 도메인 및 체스 엔진 구축](../features/FEATURE-001.md)

## 목적

- 프론트엔드와 백엔드가 공유할 순수 로직 전용 패키지인 `packages/shared`를 생성하고 기초 환경을 설정한다.

## 완료 조건

- [x] `packages/shared` 폴더 내에 `package.json`, `tsconfig.json`이 생성되어야 한다.
- [x] 패키지명은 `@chess-db/shared`로 정의되어야 한다.
- [x] `tsdown`을 이용한 ESM/CJS 듀얼 빌드 설정이 완료되어야 한다.
- [x] 루트 워크스페이스에서 해당 패키지를 인식해야 한다.

## 참고 사항

- 빌드 도구는 유지보수가 중단된 `tsup` 대신 최신 대안인 `tsdown`을 사용한다.
