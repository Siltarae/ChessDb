# TASK-099 apps/web Playwright E2E 환경 구성

## 상세 구현 지침

- [구현 지침서 (Phase 3)](../../tasks/TASK-099.md)

## 상위 Feature

- [FEATURE-002 기보 입력 보드 상호작용 및 수순 관리](../features/FEATURE-002.md)

## 추천 커밋 메시지

- `test: apps/web Playwright E2E 환경 추가`

## 목적

- `apps/web`에서 실제 브라우저 기반 E2E 테스트를 실행할 수 있는 기본 환경을 구축한다.
- `TASK-016` 완료 판정에는 E2E를 포함하지 않고, 브라우저 수준 검증은 별도 Task로 분리한다.

## 완료 기준

- `apps/web`에 Playwright 설정 파일과 E2E 테스트 실행 스크립트가 준비되어 있다.
- Vite 개발 서버 또는 preview 서버와 연동해 E2E 테스트를 실행할 수 있다.
- 기본 스모크 테스트는 앱 진입 화면 로딩까지만 검증한다.
- E2E 리포트와 테스트 산출물은 저장소에 불필요하게 포함되지 않는다.

## 관련 메모

- Playwright 설치와 브라우저 준비는 공식 문서의 설치 절차를 따른다.
- 실제 기보 입력 조작 흐름은 `TASK-100`에서 검증한다.

## 💬 9. 추천 커밋 메시지

- `test: apps/web Playwright E2E 환경 추가`
