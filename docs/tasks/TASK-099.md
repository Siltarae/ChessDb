# 📋 개별 작업 지침서: apps/web Playwright E2E 환경 구성 (TASK-099)

**작업 상태**: 대기 중  
**선행 작업**: `[TASK-083]` (Web 초기화), `[TASK-092]` (Vitest 및 React Testing Library 환경 구성)  
**후속 작업**: `[TASK-100]` (기보 입력 핵심 흐름 E2E 스모크 테스트)  
**연관 설계**: `[../architecture/project-rules.md]`

---

## 0. 현재 코드 상태와 이 작업의 위치

- **현재 상태 요약**: `apps/web`에는 Vitest와 React Testing Library 기반 컴포넌트 테스트 환경은 있지만, 실제 브라우저에서 사용자 흐름을 검증하는 E2E 환경은 없습니다.
- **이 작업의 책임**: `apps/web`에서 Playwright E2E 테스트를 실행할 수 있도록 설정, 스크립트, 기본 스모크 테스트 진입점을 구성합니다.
- **이번 작업에서 하지 않는 것**: `[TASK-016]` 완료 판정에 E2E 통과 조건을 추가하지 않고, 기보 입력 핵심 조작 흐름 검증은 `[TASK-100]`에서 다룹니다.
- **경계 메모**:
  - 이번 Task는 E2E 인프라만 닫고, 보드 착수 성공 여부나 수순 기록 검증은 포함하지 않습니다.
  - Playwright 설치와 브라우저 준비는 공식 문서의 설치 절차를 따릅니다.

## 🎯 1. 작업 목표

- **최종 상태**: `apps/web`에서 Playwright E2E 테스트를 실행할 수 있고, 기본 앱 로딩 스모크 테스트가 통과합니다.
- **이번 작업의 최소 결과물**:
  - `apps/web/playwright.config.ts`
  - `apps/web/e2e/app-smoke.spec.ts`
  - `apps/web/package.json`의 E2E 실행 스크립트
- **성공 기준 (AC)**:
  - `pnpm --filter @chess-db/web test:e2e` 명령이 존재한다.
  - Playwright가 Vite dev server 또는 preview server와 연동된다.
  - 기본 스모크 테스트는 앱 진입 화면 로딩과 주요 shell 렌더링만 확인한다.
  - E2E 산출물(`playwright-report`, `test-results`)이 저장소에 불필요하게 포함되지 않는다.

## 📂 2. 대상 아티팩트

- **신규 생성**:
  - `apps/web/playwright.config.ts`
  - `apps/web/e2e/app-smoke.spec.ts`
- **수정 대상**:
  - `apps/web/package.json`
  - `.gitignore` 또는 관련 ignore 설정 파일
- **조건부 정리 대상**:
  - E2E 리포트, trace, screenshot 산출물 ignore 누락
- **이번 작업에서 수정하지 않음**:
  - `apps/web/src/features/make-move/model/use-make-move.ts`
  - `apps/web/src/entities/game/model/game-store.ts`
  - `apps/web/src/widgets/chess-board/ui/chess-board.tsx`
- **아티팩트 작성 규칙**:
  - E2E 설정 파일과 테스트 파일은 `apps/web` 내부에 둔다.
  - 실제 사용자 흐름 검증은 `[TASK-100]`으로 남긴다.

## 🛠️ 3. 상세 기술 사양

- Playwright 설치와 브라우저 준비는 공식 문서의 현재 설치 절차를 확인한 뒤 진행한다.
- `apps/web/package.json`에는 E2E 실행 스크립트를 추가한다.
- `playwright.config.ts`는 `apps/web` 기준 `baseURL`, `webServer`, `testDir`를 명확히 둔다.
- 브라우저 프로젝트는 최소 Chromium을 포함한다.
- 실패 시 확인 가능한 trace 또는 report 설정을 둔다.
- 산출물 디렉터리는 `.gitignore` 또는 관련 ignore 설정에 포함한다.

## 🧪 4. 검증 시나리오 및 단언

1. **정상 시나리오: E2E 환경 실행**
   - `pnpm --filter @chess-db/web test:e2e`를 실행한다.
   - Playwright가 앱을 띄우고 기본 스모크 테스트를 통과한다.

2. **정상 시나리오: 앱 shell 렌더링**
   - 테스트가 `/` 또는 현재 웹 앱의 기본 진입 경로에 접속한다.
   - 앱의 최상위 레이아웃 또는 기보 입력 진입 화면이 렌더링된다.

3. **실패 시나리오: dev server 연결 실패**
   - Vite 서버가 뜨지 않거나 `baseURL`이 잘못되면 테스트가 명확히 실패한다.

4. **범위 침범 차단**
   - 이 Task의 스모크 테스트는 착수, 턴 전환, 수순 기록을 검증하지 않는다.

## 🚀 5. 권장 작업 순서

1. Playwright 공식 문서의 설치 절차를 확인한다.
2. `apps/web` 기준 설정 파일과 `test:e2e` 스크립트를 추가한다.
3. 기본 앱 로딩 스모크 테스트를 작성한다.
4. E2E 산출물 ignore 규칙을 확인한다.
5. E2E 실행과 기존 web 검증 명령을 함께 확인한다.

- **검증 실행**:
  - `pnpm --filter @chess-db/web test:e2e`
  - `pnpm --filter @chess-db/web test`
  - `pnpm --filter @chess-db/web lint`
  - `pnpm --filter @chess-db/web format:check`
  - `pnpm --filter @chess-db/web build`

## ✅ 6. 완료 판정 체크리스트

- [ ] `apps/web/playwright.config.ts`가 생성되었다.
- [ ] `apps/web/e2e/app-smoke.spec.ts`가 생성되었다.
- [ ] `apps/web/package.json`에 `test:e2e` 스크립트가 추가되었다.
- [ ] E2E 산출물 ignore 규칙이 확인되었다.
- [ ] `pnpm --filter @chess-db/web test:e2e`가 통과한다.
- [ ] `TASK-016` 문서 또는 완료 조건에 E2E 항목을 추가하지 않았다.

## 💬 9. 추천 커밋 메시지

- `test: apps/web Playwright E2E 환경 추가`
