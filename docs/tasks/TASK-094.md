# 📋 개별 작업 지침서: Zod를 활용한 전역 환경 변수 검증 체계 구축 (TASK-094)

**작업 상태**: 대기 중  
**선행 작업**: `[TASK-088]` (API 초기화), `[TASK-089]` (DB 설정)  
**후속 작업**: `[TASK-090]` (DTO 연결)  
**연관 설계**: `[../architecture/project-rules.md]` (환경 변수 규칙)

---

## 0. 현재 코드 상태와 이 작업의 위치

- **현재 상태 요약**: `.env` 파일을 통해 설정을 관리하기 시작했으나, 필수 변수 누락 시 서버가 실행 중에 에러를 내는 불안정한 상태입니다.
- **이 작업의 책임**: 애플리케이션 시작 시점에 모든 필수 환경 변수(`DATABASE_URL` 등)를 Zod 스키마로 강제 검증하여, 설정 오류 시 즉시 실행을 중단(Fail-Fast)시킵니다.

## 🎯 1. 작업 목표

- **최종 상태**: 환경 변수에 오타가 있거나 누락된 경우, 서버가 구동되기 직전에 명확한 에러 메시지를 남기며 종료됩니다.

## 🛠️ 3. 상세 기술 사양

- **위치**: `apps/api/src/config/env.config.ts`
- **구현 방식**:
  ```ts
  const envSchema = z.object({
    DATABASE_URL: z.string().url(),
    PORT: z.coerce.number().default(3000),
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  });
  export const env = envSchema.parse(process.env);
  ```
- **NestJS 연동**: `ConfigModule.forRoot({ validate: (config) => envSchema.parse(config) })`와 같이 연동 검토.
- **필수 describe/it 목록**:
  - describe: `Environment Variable Validation`
    - it: `필수 변수(DATABASE_URL) 누락 시 프로세스가 에러를 던지며 중단되어야 한다`
    - it: `유효한 변수가 주어지면 파싱된 설정 객체를 반환해야 한다`

## ✅ 7. 완료 판정 체크리스트

- [ ] 서버 시작 시 Zod 검증 로직이 가장 먼저 실행됨을 확인했다.
- [ ] `.env.example` 파일에 현재 필요한 모든 변수 목록이 최신화되었다.
- [ ] 잘못된 형식의 URL이나 숫자 값이 들어올 경우 정확한 검증 에러를 출력한다.

## 💬 9. 추천 커밋 메시지

- `feat: Zod를 활용한 서버 환경 변수 강제 검증 체계 구축 (TASK-094)`
