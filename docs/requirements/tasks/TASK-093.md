# TASK-093 apps/api Jest 및 Supertest 기반 테스트 환경 구성

## 상위 Feature

- [FEATURE-003 기보 메타데이터 입력 및 초안 저장 관리](../features/FEATURE-003.md)

## 목적

- 백엔드 비즈니스 로직과 API 엔드포인트의 동작을 검증하기 위한 테스트 환경을 구축한다.

## 완료 조건

- [ ] `apps/api`에 `jest`, `ts-jest`, `supertest`, `@types/jest`가 설치되어야 한다.
- [ ] `jest.config.js` 또는 `package.json`의 jest 설정이 NestJS 환경에 맞게 구성되어야 한다.
- [ ] 기초적인 Controller E2E 테스트(`test/app.e2e-spec.ts`)가 정상 실행되어야 한다.

## 참고 사항

- NestJS의 기본 생태계와 가장 잘 어울리는 `Jest`를 사용한다.


## 💬 9. 추천 커밋 메시지

- `chore: update TASK-093.md`
