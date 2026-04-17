# TASK-092 apps/web Vitest 및 React Testing Library 환경 구성

## 상위 Feature

- [FEATURE-002 기보 입력 보드 상호작용 및 수순 관리](../features/FEATURE-002.md)

## 목적

- 프론트엔드 컴포넌트와 유틸리티 함수들을 검증하기 위한 테스트 환경을 구축한다.

## 완료 조건

- [ ] `apps/web`에 `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`이 설치되어야 한다.
- [ ] `vitest.config.ts` (또는 `vite.config.ts`)에 테스트 설정이 포함되어야 한다.
- [ ] `setupTests.ts` 파일을 통해 Jest-dom 매처가 전역으로 확장되어야 한다.

## 참고 사항

- Vite 환경과의 호환성을 위해 `Vitest`를 우선적으로 사용한다.
