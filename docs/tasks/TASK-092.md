# 📋 개별 작업 지침서: apps/web Vitest 및 React Testing Library 환경 구성 (TASK-092)

**작업 상태**: 대기 중  
**선행 작업**: `[TASK-083]` (Web 초기화)  
**후속 작업**: `[TASK-001]` (UI 개발 시작)  
**연관 설계**: `[../architecture/project-rules.md]` (테스트 규칙)

---

## 0. 현재 코드 상태와 이 작업의 위치

- **현재 상태 요약**: 웹 프로젝트는 생성되었으나 컴포넌트의 동작을 검증할 테스트 도구가 없습니다.
- **이 작업의 책임**: Vite 환경에 최적화된 Vitest와 React Testing Library를 설정하여 BDD 방식의 테스트 환경을 구축합니다.

- **이번 작업에서 하지 않는 것**: `[TASK-001]` (UI 개발 시작)에 연결된 후속 책임은 이번 태스크에서 함께 닫지 않는다.

- **경계 메모**:
  - 이번 태스크는 apps/web Vitest 및 React Testing Library 환경 구성 범위만 닫고, 후속 태스크 또는 인접 Feature의 세부 구현은 여기서 함께 처리하지 않는다.

## 🎯 1. 작업 목표

- **최종 상태**: `pnpm --filter web test` 명령으로 컴포넌트 및 훅에 대한 단위 테스트를 실행할 수 있습니다.

- **이번 작업의 최소 결과물**:
  - `apps/web/vitest.config.ts`
  - `src/setupTests.ts`

- **성공 기준 (AC)**:
  - 샘플 컴포넌트 테스트(`App.test.tsx`)가 성공적으로 실행된다.
  - 테스트 커버리지 리포트 출력이 가능하도록 설정되었다 (선택 사항).
  - 프로젝트 전역 테스트 규칙(Given-When-Then)이 명시된 `.spec.ts` 작성이 가능하다.

## 📂 2. 대상 아티팩트

- **신규 생성**:
  - `apps/web/vitest.config.ts`
  - `src/setupTests.ts`

- **수정 대상**:
  - `apps/web/vitest.config.ts`
  - `src/setupTests.ts`

- **조건부 정리 대상**: 필요할 때만 작성
  - placeholder, 임시 스켈레톤, 중복 export, 오래된 경로 표기

- **이번 작업에서 수정하지 않음**:
  - `[TASK-001]` (UI 개발 시작)에 연결된 후속 책임 파일

- **아티팩트 작성 규칙**:
  - 가능한 한 실제 파일 경로를 기준으로 작성하고, 범위 밖 파일은 이유 없이 함께 수정하지 않는다.
  - 수정 금지 범위나 후속 태스크 책임 파일은 이 섹션에서 명시적으로 분리한다.

## 🛠️ 3. 상세 기술 사양

- **설치 대상**: `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`.
- **설정 파일**: `apps/web/vitest.config.ts` 생성 또는 `vite.config.ts`에 `test` 옵션 추가.
- **Setup 파일**: `src/setupTests.ts` 생성하여 `jest-dom` 매처 등록.
- **필수 describe/it 목록**:
  - describe: `Component Testing Environment`
    - it: `가상 DOM 환경(jsdom)에서 컴포넌트가 정상적으로 렌더링되어야 한다`
    - it: `DOM 요소에 대한 jest-dom 단언(toBeInTheDocument 등)이 작동해야 한다`

- **핵심 조립/흐름 규칙**:
  - 샘플 컴포넌트 테스트(`App.test.tsx`)가 성공적으로 실행된다.
  - 테스트 커버리지 리포트 출력이 가능하도록 설정되었다 (선택 사항).
  - 프로젝트 전역 테스트 규칙(Given-When-Then)이 명시된 `.spec.ts` 작성이 가능하다.

- **데이터 모델 해석**:
  - 핵심 데이터는 Vitest 설정, jsdom 환경, RTL setup 파일과 matcher 확장입니다.
  - 입력은 web 앱 테스트 대상과 DOM 환경 설정 파일입니다.

- **외부 의존성**:
  - `vitest`
  - `@testing-library/react`
  - `@testing-library/jest-dom`
  - `jsdom`

- **import/export 규칙**:
  - `../architecture/project-rules.md`의 named export, 상대 경로 최소화, `.js` 확장자 규칙을 따른다.

- **권장 네이밍**:
  - 공개 함수/타입 이름: apps/web Vitest 및 React Testing Library 환경 구성 책임이 드러나는 이름
  - 내부 helper 이름: 역할이 바로 드러나는 동사형 또는 조합형 이름
  - 핵심 변수명: 상태와 대상이 분명한 이름
  - 피해야 할 이름: data, item, obj, temp

- **이름별 사용 의도와 적용 시점**:
  - `vitest.config.ts`, `setupTests.ts`는 테스트 진입 계약 파일 이름으로 유지합니다.
  - `render` 헬퍼가 필요하면 공통 테스트 유틸 이름으로 사용합니다.

- **인수 이름 가이드**:
  - `environment`, `setupFiles`, `include`

- **짧은 예시 골격**:

```ts
test: { environment: "jsdom", setupFiles: ["./src/test/setup-tests.ts"] }
```

- **최소 테스트 개수**:
  - 최소 3개

- **반드시 포함할 실패 시나리오**:
  - jsdom 없이 브라우저 컴포넌트 테스트를 실행하는 경우
  - matcher 확장을 setup에서 누락하는 경우

## ⚖️ 4. 기술 제약 및 규칙

- **작성 원칙**:
  - 전역 규칙을 반복 나열하지 말고, 이번 태스크에서 특히 강조해야 하는 제약만 짧게 적는다.

- **구조 규칙**:
  - 현재 디렉토리 구조와 연관 설계 문서의 책임 경계를 유지한다.

- **불변성/상태 규칙**:
  - 기존 상태를 직접 오염시키지 않고, 이번 태스크의 책임 범위 안에서 상태를 갱신한다.

- **범위 규칙**:
  - `[TASK-001]` (UI 개발 시작)에 연결된 범위는 여기서 닫지 않는다.

- **헌법 정렬 규칙**:
  - `../architecture/project-rules.md`의 네이밍, import/export, 상태 규칙을 그대로 따른다.

- **문서화 규칙**:
  - 이 문서에서 고정한 파일 경로, 검증 기준, 후속 태스크 경계를 구현 단계와 동일하게 유지한다.

## 🧪 5. 검증 시나리오 및 단언

1. **정상 시나리오: 핵심 동작 확인**
   - 샘플 컴포넌트 테스트(`App.test.tsx`)가 성공적으로 실행된다.
   - 요구사항 문서의 완료 기준이 코드 또는 테스트에서 직접 확인되어야 한다.

2. **실패 시나리오: 범위 침범 차단**
   - 웹 컴포넌트 테스트가 jsdom 환경에서 돌아야 한다.
   - RTL matcher가 전역으로 확장되어야 한다.

- **검증 시나리오 작성 규칙**:
  - 정상 흐름과 반려 흐름을 함께 적고, 가능하면 현재 테스트 파일 또는 후속 테스트 포인트와 연결한다.

## 🚀 6. 권장 작업 순서

1. **문맥 확인**: `[../architecture/project-rules.md]` (테스트 규칙)
2. **입력 자산 확인**: 이번 태스크가 기대하는 타입, 상수, helper, 화면 구조, API 진입점이 이미 준비됐는지 확인한다.
3. **핵심 구현**: apps/web Vitest 및 React Testing Library 환경 구성 범위의 핵심 로직, 화면, 타입, 문서 또는 테스트를 작성한다.
4. **연동**: 공개 export, 소비 코드, 테스트 연결, 후속 태스크가 기대하는 연결점을 맞춘다.
5. **검증 실행**:
   - `pnpm --filter @chess-db/web build`
   - `pnpm --filter @chess-db/web test`
6. **자가 점검**: 범위 침범, 수정 금지 파일 변경, 링크 경로, 후속 태스크와의 책임 충돌 여부를 점검한다.

## ✅ 7. 완료 판정 체크리스트

- [ ] 샘플 컴포넌트 테스트(`App.test.tsx`)가 성공적으로 실행된다.
- [ ] 테스트 커버리지 리포트 출력이 가능하도록 설정되었다 (선택 사항).
- [ ] 프로젝트 전역 테스트 규칙(Given-When-Then)이 명시된 `.spec.ts` 작성이 가능하다.

## 💬 9. 추천 커밋 메시지

- `feat: apps/web Vitest 및 React Testing Library 테스트 환경 구축 (TASK-092)`
