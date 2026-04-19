# 📋 개별 작업 지침서: apps/web Vitest 및 React Testing Library 환경 구성 (TASK-092)

**작업 상태**: 대기 중  
**선행 작업**: `[TASK-083]` (Web 초기화)  
**후속 작업**: `[TASK-001]` (UI 개발 시작)  
**연관 설계**: `[../architecture/project-rules.md]` (테스트 규칙)

---

## 0. 현재 코드 상태와 이 작업의 위치

- **현재 상태 요약**: 웹 프로젝트는 생성되었으나 컴포넌트의 동작을 검증할 테스트 도구가 없습니다.
- **이 작업의 책임**: Vite 환경에 최적화된 Vitest와 React Testing Library를 설정하여 BDD 방식의 테스트 환경을 구축합니다.

## 🎯 1. 작업 목표

- **최종 상태**: `pnpm --filter web test` 명령으로 컴포넌트 및 훅에 대한 단위 테스트를 실행할 수 있습니다.

## 🛠️ 3. 상세 기술 사양

- **설치 대상**: `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`.
- **설정 파일**: `apps/web/vitest.config.ts` 생성 또는 `vite.config.ts`에 `test` 옵션 추가.
- **Setup 파일**: `src/setupTests.ts` 생성하여 `jest-dom` 매처 등록.
- **필수 describe/it 목록**:
  - describe: `Component Testing Environment`
    - it: `가상 DOM 환경(jsdom)에서 컴포넌트가 정상적으로 렌더링되어야 한다`
    - it: `DOM 요소에 대한 jest-dom 단언(toBeInTheDocument 등)이 작동해야 한다`

## ✅ 7. 완료 판정 체크리스트

- [ ] 샘플 컴포넌트 테스트(`App.test.tsx`)가 성공적으로 실행된다.
- [ ] 테스트 커버리지 리포트 출력이 가능하도록 설정되었다 (선택 사항).
- [ ] 프로젝트 전역 테스트 규칙(Given-When-Then)이 명시된 `.spec.ts` 작성이 가능하다.

## 💬 9. 추천 커밋 메시지

- `feat: apps/web Vitest 및 React Testing Library 테스트 환경 구축 (TASK-092)`
