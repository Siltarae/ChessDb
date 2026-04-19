# 📋 개별 작업 지침서: apps/web 필수 공통 라이브러리 의존성 추가 (TASK-085)

**작업 상태**: 대기 중  
**선행 작업**: `[TASK-083]` (Web 초기화)  
**후속 작업**: `[TASK-092]` (테스트 환경)  
**연관 설계**: `[../architecture/tech-stack.md]`

---

## 0. 현재 코드 상태와 이 작업의 위치

- **현재 상태 요약**: 스타일링 환경은 잡혔으나 상태 관리, 데이터 페칭 등 앱 구동에 필요한 핵심 라이브러리가 없습니다.
- **이 작업의 책임**: 프로젝트 전반에서 사용할 필수 라이브러리들을 설치하고, 모노레포 내부 패키지(`@chess-db/shared`)를 연결합니다.

## 🎯 1. 작업 목표

- **최종 상태**: `Zustand`, `TanStack Query` 등을 사용할 준비가 완료되며, `shared` 패키지의 도메인 로직을 웹 앱에서 가져다 쓸 수 있습니다.

## 🛠️ 3. 상세 기술 사양

- **설치 목록**:
  - 상태 관리: `zustand`
  - 서버 상태: `@tanstack/react-query`, `@tanstack/react-query-devtools`
  - 유틸리티: `clsx`, `tailwind-merge`, `lucide-react`
- **로컬 패키지 연결**: `pnpm add @chess-db/shared --filter web`
- **설정**: `QueryClientProvider`를 `App.tsx` 최상단에 배치.
- **필수 describe/it 목록**:
  - describe: `Library Integration`
    - it: `@chess-db/shared 패키지의 코드를 정상적으로 import 할 수 있어야 한다`
    - it: `Zustand 스토어가 React 컴포넌트와 유기적으로 연동되어야 한다`

## ✅ 7. 완료 판정 체크리스트

- [ ] 모든 필수 의존성이 `apps/web/package.json`에 명시되었다.
- [ ] `shared` 패키지의 타입 추론이 IDE에서 정상적으로 이루어진다.
- [ ] React Query Devtools가 개발 환경에서 정상 노출된다 (선택 사항).

## 💬 9. 추천 커밋 메시지

- `chore: apps/web 핵심 상태 관리 및 데이터 페칭 라이브러리 설치 (TASK-085)`
