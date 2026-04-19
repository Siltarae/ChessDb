# TASK-087 packages/shared 테스트 환경(Vitest) 및 검증(Zod) 라이브러리 설치

## 상위 Feature

- [FEATURE-001 체스 규칙 및 합법 수 판정 엔진](../features/FEATURE-001.md)

## 목적

- 핵심 도메인 로직의 단위 테스트를 위한 환경과 런타임 데이터 검증을 위한 기반을 마련한다.

## 완료 조건

- [ ] `packages/shared`에 `vitest`가 설치되고 관련 설정 파일(`vitest.config.ts` 등)이 구성되어야 한다.
- [ ] 데이터 타입 검증을 위한 `zod`가 설치되어야 한다.
- [ ] 간단한 더미 테스트가 실행되어 `pnpm test` 명령어가 정상 동작하는지 확인해야 한다.

## 참고 사항

- 합법 수 판정 등의 로직 검증에 `vitest`를 적극 활용한다.


## 💬 9. 추천 커밋 메시지

- `chore: update TASK-087.md`
