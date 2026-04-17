# 📋 개별 작업 지침서: apps/web Vitest 및 React Testing Library 환경 구성 (TASK-092)

**작업 상태**: 대기 중  
**선행 작업**: `[TASK-083]`  
**후속 작업**: `[TASK-001]`

---

## 🛠️ 3. 상세 기술 사양

- **설치 대상**: `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`
- **설정 파일**: `vitest.config.ts` 작성 (또는 `vite.config.ts`에 test 속성 추가)
- **Setup**: `src/setupTests.ts` 생성 및 `import '@testing-library/jest-dom'` 포함.

## ✅ 4. 완료 판정 체크리스트

- [ ] `pnpm test` 실행 시 `apps/web` 내의 `*.test.tsx` 파일들이 정상 실행된다.
- [ ] 컴포넌트 렌더링 테스트가 성공한다.
