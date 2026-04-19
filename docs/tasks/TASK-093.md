# 📋 개별 작업 지침서: apps/api Jest 및 Supertest 기반 테스트 환경 구성 (TASK-093)

**작업 상태**: 대기 중  
**선행 작업**: `[TASK-088]`  
**후속 작업**: `[TASK-094]`

---

## 🛠️ 3. 상세 기술 사양

- **테스트 도구**: `jest`, `ts-jest`, `supertest`
- **설정**: NestJS 기본 제공 `jest.config.js`를 사용하되 모노레포 경로 별칭 설정 확인.
- **단위 테스트**: 서비스 로직 검증용.
- **E2E 테스트**: `test/app.e2e-spec.ts`에서 실제 HTTP 요청 흐름 검증.

## ✅ 4. 완료 판정 체크리스트

- [ ] `pnpm test` 실행 시 단위 테스트가 정상 수행된다.
- [ ] `pnpm test:e2e` 실행 시 서버 엔드포인트 호출 결과가 200(성공)을 반환한다.


## 💬 9. 추천 커밋 메시지

- `test: apps/api Jest 및 Supertest 기반 테스트 환경 구성 (TASK-093)`
