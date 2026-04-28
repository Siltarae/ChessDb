# 📋 개별 작업 지침서: 기보 정식 저장 API 구현 (TASK-095)

**작업 상태**: 대기 중  
**선행 작업**: `[TASK-063]` (GameRecord 스키마), `[TASK-089]` (PostgreSQL + Prisma), `[TASK-090]` (공통 DTO 공유 구조)  
**후속 작업**: `[TASK-025]` (정식 저장 확정)  
**연관 설계**: `[../architecture/tech-stack.md]`, `[../architecture/project-rules.md]`

---

## 0. 현재 코드 상태와 이 작업의 위치

- **현재 상태 요약**: API 프로젝트와 공통 DTO 구조는 준비되지만, 정식 기보를 서버에 생성하는 엔드포인트는 아직 없습니다.
- **이 작업의 책임**: `POST /api/games` 엔드포인트, 요청 검증, Prisma 저장, 저장 ID 응답 계약을 구현합니다.
- **이번 작업에서 하지 않는 것**: 프론트엔드 버튼, 토스트, 저장 성공 후 로컬 초안 삭제는 `[TASK-025]`에서 처리합니다.
- **경계 메모**:
  - `FEATURE-004` 전까지 저장 대상은 시스템 기본 저장소로 고정합니다.
  - 실제 상세 화면 이동은 `FEATURE-005`에서 연결하고, 이 태스크는 저장 ID 응답까지만 보장합니다.

## 🎯 1. 작업 목표

- **최종 상태**: 프론트엔드가 `GameRecord` 기반 payload를 보내면 서버가 검증 후 DB에 정식 기보를 저장하고 ID를 반환합니다.
- **이번 작업의 최소 결과물**:
  - `apps/api/src/games/games.controller.ts`
  - `apps/api/src/games/games.service.ts`
  - `apps/api/src/games/games.module.ts`
  - `apps/api/src/games/games.controller.spec.ts`
  - `apps/api/prisma/schema.prisma`
- **성공 기준 (AC)**:
  - `POST /api/games`가 shared DTO/Zod 계약으로 요청을 검증한다.
  - 유효한 요청은 시스템 기본 저장소에 저장되고 저장 기보 ID를 반환한다.
  - 유효하지 않은 요청은 DB에 기록하지 않고 400 계열 오류로 실패한다.

## 📂 2. 대상 아티팩트

- **신규 생성**:
  - `apps/api/src/games/games.controller.ts`
  - `apps/api/src/games/games.service.ts`
  - `apps/api/src/games/games.module.ts`
  - `apps/api/src/games/games.controller.spec.ts`
- **수정 대상**:
  - `apps/api/src/app.module.ts`
  - `apps/api/prisma/schema.prisma`
  - `packages/shared/src/dto/**` 또는 기존 shared 저장 DTO 파일
- **이번 작업에서 수정하지 않음**:
  - `apps/web/src/features/save-game/**`
  - `apps/web/src/pages/notation-input-page.tsx`

## 🛠️ 3. 상세 기술 사양

- **핵심 구현 대상**:
  - `GamesController.create`는 `POST /api/games`를 제공합니다.
  - 요청 body는 shared의 저장 요청 스키마를 통해 검증합니다.
  - `GamesService.createGame`은 Prisma로 정식 기보를 저장하고 `{ id }` 형태의 응답을 반환합니다.
- **데이터 모델 해석**:
  - 저장 payload는 현재 draft에서 만든 `GameRecord`와 시스템 기본 저장소 식별자를 포함합니다.
  - 수순과 메타데이터는 조회/분석 후속 Task가 재사용할 수 있도록 구조를 보존해 저장합니다.
- **외부 의존성**:
  - `@nestjs/common`
  - `@nestjs/swagger`
  - `@prisma/client`
  - `@chess-db/shared`
- **import/export 규칙**:
  - API 내부 DTO를 shared 스키마와 따로 복제하지 않습니다.
  - Prisma 모델명과 shared DTO 필드명 차이가 있으면 service layer에서만 명시적으로 매핑합니다.
- **권장 네이밍**:
  - `GamesController`, `GamesService`, `createGame`, `CreateGameRequestSchema`, `CreateGameResponse`
- **인수 이름 가이드**:
  - `savePayload`, `gameRecord`, `repositoryId`

## 🧪 4. 검증 시나리오 및 단언

1. **정상 시나리오: 기보 저장**
   - 유효한 `GameRecord` payload를 `POST /api/games`로 보낸다.
   - 응답은 저장 기보 ID를 포함하고 DB에 정식 기보가 생성된다.

2. **실패 시나리오: 잘못된 payload**
   - 필수 history 또는 metadata가 누락된 payload를 보낸다.
   - API는 400 계열 오류를 반환하고 DB에 저장하지 않는다.

3. **경계 시나리오: 시스템 기본 저장소**
   - 별도 저장소 선택 값 없이 저장한다.
   - 서버는 시스템 기본 저장소 식별자로 저장한다.

- **필수 describe/it 목록**:
  - `describe('GamesController.create')`
  - `it('유효한 기보 저장 요청을 DB에 저장하고 ID를 반환한다')`
  - `it('shared DTO 검증에 실패한 요청은 400으로 거절한다')`
  - `it('저장소 선택이 없으면 시스템 기본 저장소로 저장한다')`
- **최소 테스트 개수**:
  - 최소 3개

## 🚀 5. 권장 작업 순서

1. shared 저장 요청/응답 DTO가 준비되어 있는지 확인하고 부족하면 추가합니다.
2. Prisma `Game` 저장 모델을 정식 저장 payload에 맞게 정리합니다.
3. `GamesModule`, `GamesController`, `GamesService`를 작성합니다.
4. 성공/실패/기본 저장소 테스트를 추가합니다.

- **검증 실행**:
  - `pnpm --filter @chess-db/api test`
  - `pnpm --filter @chess-db/api build`

## ✅ 6. 완료 판정 체크리스트

- [ ] `POST /api/games`가 존재한다.
- [ ] shared DTO 기반 요청 검증이 적용된다.
- [ ] 저장 성공 응답에 후속 상세 진입용 ID가 포함된다.
- [ ] 잘못된 요청은 DB에 저장되지 않는다.

## 💬 9. 추천 커밋 메시지

- `feat: 기보 정식 저장 API를 추가 (TASK-095)`
