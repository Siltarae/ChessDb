# 📋 개별 작업 지침서: apps/api Jest 및 Supertest 기반 테스트 환경 구성 (TASK-093)

**작업 상태**: 대기 중  
**선행 작업**: `[TASK-088]` (API 초기화)  
**후속 작업**: `[TASK-094]` (환경 변수 검증)  
**연관 설계**: `[../architecture/project-rules.md]`

---

## 0. 현재 코드 상태와 이 작업의 위치

- **현재 상태 요약**: NestJS 초기화 시 생성된 기본 테스트 코드는 있으나, 모노레포 구조와 공유 패키지를 고려한 정밀한 테스트 설정은 부재합니다.
- **이 작업의 책임**: 서비스 로직을 검증하는 단위 테스트(Jest)와 실제 API 호출을 시뮬레이션하는 E2E 테스트 환경을 최적화합니다.

## 🎯 1. 작업 목표

- **최종 상태**: `pnpm --filter api test`와 `test:e2e` 명령을 통해 백엔드의 모든 레이어를 검증할 수 있습니다.

## 🛠️ 3. 상세 기술 사양

- **도구**: `jest`, `ts-jest`, `supertest`.
- **단위 테스트**: 각 서비스 및 컨트롤러 파일 옆에 `.spec.ts` 배치.
- **E2E 테스트**: `apps/api/test/` 폴더 내에서 전체 HTTP 흐름 검증.
- **모노레포 연동**: `jest.config.ts`에서 `@chess-db/shared` 및 기타 별칭 경로를 `moduleNameMapper`에 정확히 등록.
- **필수 describe/it 목록**:
  - describe: `API Integration Testing`
    - it: `E2E 테스트 환경에서 DB Mocking 또는 Test DB 연결이 정상 작동해야 한다`
    - it: `모노레포 공유 패키지의 코드를 Jest 환경에서 인식해야 한다`

## ✅ 7. 완료 판정 체크리스트

- [ ] 단위 테스트와 E2E 테스트 명령어가 각각 정상적으로 수행된다.
- [ ] 테스트 환경에서도 환경 변수(`.env.test`)가 올바르게 주입된다.
- [ ] `shared` 패키지 코드를 사용하는 서비스에 대한 테스트가 성공한다.

## 💬 9. 추천 커밋 메시지

- `feat: apps/api Jest 및 E2E 테스트 인프라 고도화 (TASK-093)`
