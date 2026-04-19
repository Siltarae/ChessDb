# TASK-085 apps/web 필수 공통 라이브러리(Zustand, Query 등) 의존성 추가

## 상위 Feature

- [FEATURE-002 기보 입력 보드 상호작용 및 수순 관리](../features/FEATURE-002.md)

## 목적

- 애플리케이션 상태 관리와 데이터 통신을 위한 핵심 라이브러리들을 설치한다.

## 완료 조건

- [ ] `apps/web`의 `dependencies`에 `zustand`, `@tanstack/react-query`, `lucide-react`가 포함되어야 한다.
- [ ] `main.tsx` 또는 `App.tsx`에서 `QueryClientProvider` 등 필수 Provider 설정이 완료되어야 한다.
- [ ] `shared` 패키지를 참조할 수 있도록 워크스페이스 의존성 설정이 확인되어야 한다.

## 참고 사항

- 실제 비즈니스 로직 작성은 이후 태스크에서 진행한다.


## 💬 9. 추천 커밋 메시지

- `chore: update TASK-085.md`
