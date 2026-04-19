# 📋 개별 작업 지침서: Zod를 활용한 전역 환경 변수 검증 체계 구축 (TASK-094)

**작업 상태**: 대기 중  
**선행 작업**: `[TASK-088]`, `[TASK-089]`  
**후속 작업**: `[TASK-090]`

---

## 0. 현재 코드 상태와 이 작업의 위치

- **현재 상태 요약**: `.env` 파일을 사용하기 시작했으나, 필수 변수가 누락되었을 때 서버가 실행 중에 에러를 내는 불안정한 상태입니다.
- **이 작업의 책임**: 애플리케이션 시작 시점에 모든 필수 환경 변수(`DATABASE_URL`, `JWT_SECRET` 등)를 Zod 스키마로 검증하여, 설정 오류 시 즉시 실행을 중단(Fail-Fast)시킵니다.

## 🛠️ 3. 상세 기술 사양

- **위치**: `apps/api/src/config/env.config.ts` (또는 shared 패키지 고려)
- **로직**:
  ```ts
  const envSchema = z.object({
    DATABASE_URL: z.string().url(),
    PORT: z.coerce.number().default(3000),
  });
  export const env = envSchema.parse(process.env);
  ```
- **NestJS 연동**: `ConfigModule`의 `validate` 함수에 이 로직을 연결.

## ✅ 4. 완료 판정 체크리스트

- [ ] 필수 환경 변수 누락 시 서버 실행이 즉시 중단되며 명확한 에러 메시지가 출력된다.
- [ ] `.env.example` 파일에 현재 필요한 모든 변수 목록이 최신화되어 있다.


## 💬 9. 추천 커밋 메시지

- `test: Zod를 활용한 전역 환경 변수 검증 체계 구축 (TASK-094)`
