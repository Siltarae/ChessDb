# 📋 개별 작업 지침서: apps/web 필수 공통 라이브러리 의존성 추가 (TASK-085)

**작업 상태**: 대기 중  
**선행 작업**: `[TASK-083]`  
**후속 작업**: `[TASK-092]`, `[TASK-001]`

---

## 🛠️ 3. 상세 기술 사양

- **설치 대상**:
  - 상태 관리: `zustand`
  - 서버 데이터 페칭: `@tanstack/react-query`
  - 아이콘: `lucide-react`
  - 유틸리티: `clsx`, `tailwind-merge`
- **워크스페이스 연결**: `pnpm add @chess-db/shared --filter web` (로컬 패키지 참조)

## ✅ 4. 완료 판정 체크리스트

- [ ] `shared` 패키지의 타입을 `apps/web`에서 import 하여 사용할 수 있다.
- [ ] `QueryClientProvider`가 `App.tsx` 또는 `main.tsx`에 설정되었다.
